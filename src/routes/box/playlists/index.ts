import { Router } from "express";
import boxService from "../../../services/box/boxService";
import playlistService from "../../../services/boxItem/playlistService";
import queueService from "../../../services/queue/queueService";

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
    const newBoxPlaylist = await playlistService.createBoxPlaylist(boxId, newPlaylist.spotifyId, newPlaylistPosition);

    return res.status(201).json(newBoxPlaylist);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Reorder a playlist in a box
routes.put("/:boxId/playlists/:boxPlaylistId/reorder", async (req, res) => {
  try {
    const { boxId, boxPlaylistId } = req.params;
    const { destinationId } = req.body;

    const targetPlaylist = await playlistService.getPlaylistInBox(boxPlaylistId);
    const destinationPlaylist = await playlistService.getPlaylistInBox(destinationId);

    if (!targetPlaylist || !destinationPlaylist) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    const newPosition = destinationPlaylist.position;
    await playlistService.updateBoxPlaylistPosition(targetPlaylist.boxPlaylistId, newPosition);

    return res.status(200).json({ message: "Playlist reordered successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Delete a playlist from a box
routes.delete("/:boxId/playlists/:boxPlaylistId", async (req, res) => {
  try {
    const { boxId, boxPlaylistId } = req.params;

    const playlist = await playlistService.getPlaylistInBox(boxPlaylistId);

    const boxPlaylistCount = await playlistService.getPlaylistBoxCount(playlist!.playlistId);
    const queuePlaylistCount = await queueService.getPlaylistQueueCount(playlist!.playlistId);
    await playlistService.deleteBoxPlaylist(boxPlaylistId);

    if (boxPlaylistCount === 1 && queuePlaylistCount === 0) {
      await playlistService.deletePlaylist(playlist!.playlistId);
    }

    const updatedBox = await boxService.getBoxById(boxId);

    return res.status(201).json(updatedBox);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Add a playlist to a subsection
routes.post("/:boxId/subsections/:subsectionId/playlists", async (req, res) => {
  try {
    const { boxId, subsectionId } = req.params;
    const { boxPlaylistId } = req.body;

    // Check if the playlist is a valid boxPlaylist
    const playlistInBox = await playlistService.getPlaylistInBox(boxPlaylistId);
    if (!playlistInBox) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    // Check if the playlist is already in the subsection
    const playlistInSubsection = await playlistService.checkPlaylistInSubsection(subsectionId, boxPlaylistId);
    if (playlistInSubsection) {
      return res.status(400).json({ error: "Playlist already in subsection" });
    }

    const boxPlaylist = await playlistService.getPlaylistInBox(boxPlaylistId);
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
    const { destinationId } = req.body;

    const playlistInSubsection = await playlistService.checkPlaylistInSubsection(subsectionId, boxPlaylistId);
    const destinationPlaylist = await playlistService.getPlaylistInSubsection(subsectionId, destinationId);

    if (!playlistInSubsection || !destinationPlaylist) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    const newPosition = destinationPlaylist.position;
    await playlistService.updateSubsectionPlaylistPosition(subsectionId, boxPlaylistId, newPosition);

    return res.status(200).json({ message: "Playlist reordered successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Move a playlist to a different subsection
routes.put("/:boxId/subsections/:subsectionId/playlists/:boxPlaylistId/move", async (req, res) => {
  try {
    const { boxId, boxPlaylistId, subsectionId } = req.params;
    const { destinationSubsectionId } = req.body;

    // Check if the playlist is a valid boxPlaylist
    const playlistInBox = await playlistService.getPlaylistInBox(boxPlaylistId);
    if (!playlistInBox) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    // Check if the playlist is in the current subsection
    const playlistInSubsection = await playlistService.checkPlaylistInSubsection(subsectionId, boxPlaylistId);
    if (!playlistInSubsection) {
      return res.status(404).json({ error: "Playlist not found in the current subsection" });
    }

    // Check if the playlist is already in the destination subsection
    const playlistInDestinationSubsection = await playlistService.checkPlaylistInSubsection(destinationSubsectionId, boxPlaylistId);
    if (playlistInDestinationSubsection) {
      return res.status(400).json({ error: "Playlist already in the destination subsection" });
    }

    // Remove the playlist from the current subsection
    await playlistService.deleteBoxSubsectionPlaylist(subsectionId, boxPlaylistId);

    // Get the max position in the destination subsection
    const maxPlaylistPosition = await playlistService.getMaxSubsectionPlaylistPosition(destinationSubsectionId);
    const newPlaylistPosition = (maxPlaylistPosition || 0) + 1;

    // Add the playlist to the destination subsection
    await playlistService.createBoxSubsectionPlaylist(destinationSubsectionId, boxPlaylistId, newPlaylistPosition);

    const updatedBox = await boxService.getBoxById(boxId);

    return res.status(200).json(updatedBox);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Remove a playlist from a subsection
routes.delete("/:boxId/subsections/:subsectionId/playlists/:boxPlaylistId", async (req, res) => {
  try {
    const { boxId, boxPlaylistId, subsectionId } = req.params;

    // Check if the playlist is in the subsection
    const playlistInSubsection = await playlistService.checkPlaylistInSubsection(subsectionId, boxPlaylistId);
    if (!playlistInSubsection) {
      return res.status(400).json({ error: "Playlist not in subsection" });
    }

    await playlistService.deleteBoxSubsectionPlaylist(subsectionId, boxPlaylistId);
    const updatedBox = await boxService.getBoxById(boxId);

    return res.status(200).json(updatedBox);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Update a playlist note
routes.put("/:boxId/playlists/:boxPlaylistId/note", async (req, res) => {
  try {
    const { boxPlaylistId } = req.params;
    const { note } = req.body;
    const updatedNote = await playlistService.updateBoxPlaylistNote(boxPlaylistId, note);

    return res.status(200).json({ updatedNote });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Update a playlist note in a subsection
routes.put("/:boxId/subsections/:subsectionId/playlists/:boxPlaylistId/note", async (req, res) => {
  try {
    const { boxPlaylistId, subsectionId } = req.params;
    const { note } = req.body;
    const updatedNote = await playlistService.updateBoxSubsectionPlaylistNote(
      boxPlaylistId,
      subsectionId,
      note
    );

    return res.status(200).json({ updatedNote });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

export default routes;