import { Router } from "express";
import boxService from "../../../services/box/boxService";
import boxPlaylistService from "../../../services/boxItem/boxPlaylistService";
import queueService from "../../../services/queue/queueService";
import playlistService from "../../../services/item/playlistService";
import authenticate from "../../../middleware/autenticate";
import { User } from "@prisma/client";

const routes = Router();

// Add a playlist to a box
routes.post("/:boxId/playlists", async (req, res) => {
  try {
    const { boxId } = req.params;
    const playlistData = req.body.newPlaylist;

    const playlistInBox = await boxPlaylistService.checkPlaylistInBox(boxId, playlistData.spotifyId);
    if (playlistInBox) {
      return res.status(400).json({ error: "Item already in box" });
    }

    const newPlaylist = await playlistService.createPlaylist(playlistData);
    const maxPlaylistPosition = await boxPlaylistService.getMaxBoxPlaylistPosition(boxId);
    const newPlaylistPosition = (maxPlaylistPosition || 0) + 1;
    const newBoxPlaylist = await boxPlaylistService.createBoxPlaylist(boxId, newPlaylist.spotifyId, newPlaylistPosition);

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

    const targetPlaylist = await boxPlaylistService.getPlaylistInBox(boxPlaylistId);
    const destinationPlaylist = await boxPlaylistService.getPlaylistInBox(destinationId);

    if (!targetPlaylist || !destinationPlaylist) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    const newPosition = destinationPlaylist.position;
    await boxPlaylistService.updateBoxPlaylistPosition(targetPlaylist.boxPlaylistId, newPosition);

    return res.status(200).json({ message: "Playlist reordered successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Delete a playlist from a box
routes.delete("/:boxId/playlists/:boxPlaylistId", authenticate, async (req, res) => {
  try {
    const { boxId, boxPlaylistId } = req.params;
    const viewingUser: User = req.user;

    const playlist = await boxPlaylistService.getPlaylistInBox(boxPlaylistId);

    const boxPlaylistCount = await boxPlaylistService.getPlaylistBoxCount(playlist!.playlistId);
    const queuePlaylistCount = await queueService.getPlaylistQueueCount(playlist!.playlistId);
    await boxPlaylistService.deleteBoxPlaylist(boxPlaylistId);

    if (boxPlaylistCount === 1 && queuePlaylistCount === 0) {
      await playlistService.deletePlaylist(playlist!.playlistId);
    }

    const updatedBox = await boxService.getBoxById(boxId, viewingUser?.userId);

    return res.status(201).json(updatedBox);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Add a playlist to a subsection
routes.post("/:boxId/subsections/:subsectionId/playlists", authenticate, async (req, res) => {
  try {
    const { boxId, subsectionId } = req.params;
    const { boxPlaylistId } = req.body;
    const viewingUser: User = req.user;

    // Check if the playlist is a valid boxPlaylist
    const playlistInBox = await boxPlaylistService.getPlaylistInBox(boxPlaylistId);
    if (!playlistInBox) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    // Check if the playlist is already in the subsection
    const playlistInSubsection = await boxPlaylistService.checkPlaylistInSubsection(subsectionId, boxPlaylistId);
    if (playlistInSubsection) {
      return res.status(400).json({ error: "Playlist already in subsection" });
    }

    const boxPlaylist = await boxPlaylistService.getPlaylistInBox(boxPlaylistId);
    const maxPlaylistPosition = await boxPlaylistService.getMaxSubsectionPlaylistPosition(subsectionId);
    const newPlaylistPosition = (maxPlaylistPosition || 0) + 1;
    await boxPlaylistService.createBoxSubsectionPlaylist(subsectionId, boxPlaylist!.boxPlaylistId, newPlaylistPosition);

    const updatedBox = await boxService.getBoxById(boxId, viewingUser?.userId);

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

    const playlistInSubsection = await boxPlaylistService.checkPlaylistInSubsection(subsectionId, boxPlaylistId);
    const destinationPlaylist = await boxPlaylistService.getPlaylistInSubsection(subsectionId, destinationId);

    if (!playlistInSubsection || !destinationPlaylist) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    const newPosition = destinationPlaylist.position;
    await boxPlaylistService.updateSubsectionPlaylistPosition(subsectionId, boxPlaylistId, newPosition);

    return res.status(200).json({ message: "Playlist reordered successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Move a playlist to a different subsection
routes.put("/:boxId/subsections/:subsectionId/playlists/:boxPlaylistId/move", authenticate, async (req, res) => {
  try {
    const { boxId, boxPlaylistId, subsectionId } = req.params;
    const { destinationSubsectionId } = req.body;
    const viewingUser: User = req.user;

    // Check if the playlist is a valid boxPlaylist
    const playlistInBox = await boxPlaylistService.getPlaylistInBox(boxPlaylistId);
    if (!playlistInBox) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    // Check if the playlist is in the current subsection
    const playlistInSubsection = await boxPlaylistService.checkPlaylistInSubsection(subsectionId, boxPlaylistId);
    if (!playlistInSubsection) {
      return res.status(404).json({ error: "Playlist not found in the current subsection" });
    }

    // Check if the playlist is already in the destination subsection
    const playlistInDestinationSubsection = await boxPlaylistService.checkPlaylistInSubsection(destinationSubsectionId, boxPlaylistId);
    if (playlistInDestinationSubsection) {
      return res.status(400).json({ error: "Playlist already in the destination subsection" });
    }

    // Remove the playlist from the current subsection
    await boxPlaylistService.deleteBoxSubsectionPlaylist(subsectionId, boxPlaylistId);

    // Get the max position in the destination subsection
    const maxPlaylistPosition = await boxPlaylistService.getMaxSubsectionPlaylistPosition(destinationSubsectionId);
    const newPlaylistPosition = (maxPlaylistPosition || 0) + 1;

    // Add the playlist to the destination subsection
    await boxPlaylistService.createBoxSubsectionPlaylist(destinationSubsectionId, boxPlaylistId, newPlaylistPosition);

    const updatedBox = await boxService.getBoxById(boxId, viewingUser?.userId);

    return res.status(200).json(updatedBox);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Remove a playlist from a subsection
routes.delete("/:boxId/subsections/:subsectionId/playlists/:boxPlaylistId", authenticate, async (req, res) => {
  try {
    const { boxId, boxPlaylistId, subsectionId } = req.params;

    // Check if the playlist is in the subsection
    const playlistInSubsection = await boxPlaylistService.checkPlaylistInSubsection(subsectionId, boxPlaylistId);
    if (!playlistInSubsection) {
      return res.status(400).json({ error: "Playlist not in subsection" });
    }

    await boxPlaylistService.deleteBoxSubsectionPlaylist(subsectionId, boxPlaylistId);
    const updatedBox = await boxService.getBoxById(boxId, req.user?.userId);

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
    const updatedNote = await boxPlaylistService.updateBoxPlaylistNote(boxPlaylistId, note);

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
    const updatedNote = await boxPlaylistService.updateBoxSubsectionPlaylistNote(
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