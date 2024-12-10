import { Router } from "express";
import boxService from "../../../services/box/boxService";
import playlistService from "../../../services/boxItem/playlistService";

const routes = Router();

// Add a playlist to a box
routes.post("/:boxId/playlists", async (req, res) => {
  try {
    const { boxId } = req.params;
    const playlistData = req.body.newPlaylist;

    const playlistInBox = await playlistService.checkPlaylistInBox(boxId, playlistData.spotifyId);
    if (playlistInBox) {
      return res.status(400).json({ error: "Item already in box" });
    }

    const newPlaylist = await playlistService.createPlaylist(playlistData);
    const maxPlaylistPosition = await playlistService.getMaxBoxPlaylistPosition(boxId);
    const newPlaylistPosition = (maxPlaylistPosition || 0) + 1;
    const newBoxPlaylist = await playlistService.createBoxPlaylist(boxId, newPlaylist.itemId, newPlaylistPosition);

    return res.status(201).json(newBoxPlaylist);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Reorder a playlist in a box
routes.put("/:boxId/playlists/:playlistId/reorder", async (req, res) => {
  try {
    const { boxId, playlistId } = req.params;
    const newPosition = parseInt(req.body.newPosition);

    const targetPlaylist = await playlistService.getPlaylistInBox(boxId, playlistId);

    if (!targetPlaylist) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    await playlistService.updateBoxPlaylistPosition(targetPlaylist.boxPlaylistId, newPosition);
    await playlistService.updateSubsequentBoxPlaylistPositions(boxId, playlistId, newPosition);

    return res.status(200).json({ message: "Playlist reordered successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Delete a playlist from a box
routes.delete("/:boxId/playlists/:playlistId", async (req, res) => {
  try {
    const { boxId, playlistId } = req.params;

    const boxPlaylistCount = await playlistService.getPlaylistBoxCount(playlistId);
    await playlistService.deleteBoxPlaylist(boxId, playlistId);

    if (boxPlaylistCount === 1) {
      await playlistService.deletePlaylist(playlistId);
    }

    const updatedBox = await playlistService.getBoxWithPlaylists(boxId);
    const updatedPlaylists = updatedBox!.playlists.map(item => ({ note: item.note, position: item.position, subsections: item.subsections, ...item.playlist }));

    return res.status(201).json(updatedPlaylists);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Add a playlist to a subsection
routes.post("/:boxId/subsections/:subsectionId/playlists", async (req, res) => {
  try {
    const { boxId, subsectionId } = req.params;
    const { itemId } = req.body;

    const boxPlaylist = await playlistService.getPlaylistInBox(boxId, itemId);
    const maxPlaylistPosition = await playlistService.getMaxSubsectionPlaylistPosition(subsectionId);
    const newPlaylistPosition = (maxPlaylistPosition || 0) + 1;
    await playlistService.createBoxSubsectionPlaylist(subsectionId, boxPlaylist!.boxPlaylistId, newPlaylistPosition);

    const updatedBox = await boxService.getBoxById(boxId);

    return res.status(201).json(updatedBox);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Reorder a playlist in a subsection
routes.put("/:boxId/subsections/:subsectionId/playlists/:boxPlaylistId/reorder", async (req, res) => {
  try {
    const { subsectionId, boxPlaylistId } = req.params;
    const newPosition = parseInt(req.body.newPosition);

    const playlistInSubsection = await playlistService.checkPlaylistInSubsection(subsectionId, boxPlaylistId);

    if (!playlistInSubsection) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    await playlistService.updateSubsectionPlaylistPosition(subsectionId, boxPlaylistId, newPosition);
    await playlistService.updateSubsequentSubsectionPlaylistPositions(subsectionId, boxPlaylistId, newPosition);

    return res.status(200).json({ message: "Playlist reordered successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Remove a playlist from a subsection
routes.delete("/:boxId/subsections/:subsectionId/playlists/:boxPlaylistId", async (req, res) => {
  try {
    const { boxPlaylistId, subsectionId } = req.params;
    await playlistService.deleteBoxSubsectionPlaylist(subsectionId, boxPlaylistId);

    return res.status(200).json({ message: "Playlist removed from subsection successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

export default routes;