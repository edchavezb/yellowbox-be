import { Router } from "express";
import boxService from "../../../services/box/boxService";
import boxAlbumService from "../../../services/boxItem/boxAlbumService";
import queueService from "../../../services/queue/queueService";
import albumService from "../../../services/item/albumService";
import authenticate from "../../../middleware/autenticate";
import { User } from "@prisma/client";

const routes = Router();

// Add an album to a box
routes.post("/:boxId/albums", async (req, res) => {
  try {
    const { boxId } = req.params;
    const albumData = req.body.newAlbum;

    const albumInBox = await boxAlbumService.checkAlbumInBox(boxId, albumData.spotifyId);
    if (albumInBox) {
      return res.status(400).json({ error: "Item already in box" });
    }

    const newAlbum = await albumService.createAlbum(albumData);
    const maxAlbumPosition = await boxAlbumService.getMaxBoxAlbumPosition(boxId);
    const newAlbumPosition = (maxAlbumPosition || 0) + 1;
    const newBoxAlbum = await boxAlbumService.createBoxAlbum(boxId, newAlbum.spotifyId, newAlbumPosition);

    return res.status(201).json(newBoxAlbum);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Reorder an album in a box
routes.put("/:boxId/albums/:boxAlbumId/reorder", async (req, res) => {
  try {
    const { boxAlbumId } = req.params;
    const { destinationId } = req.body;

    const targetAlbum = await boxAlbumService.getAlbumInBox(boxAlbumId);
    const destinationAlbum = await boxAlbumService.getAlbumInBox(destinationId);

    if (!targetAlbum || !destinationAlbum) {
      return res.status(404).json({ error: "Album not found" });
    }

    const newPosition = destinationAlbum.position;
    await boxAlbumService.updateBoxAlbumPosition(targetAlbum.boxAlbumId, newPosition);

    return res.status(200).json({ message: "Album reordered successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Delete an album from a box
routes.delete("/:boxId/albums/:boxAlbumId", authenticate, async (req, res) => {
  try {
    const { boxId, boxAlbumId } = req.params;
    const viewingUser: User = req.user;

    const album = await boxAlbumService.getAlbumInBox(boxAlbumId);

    const boxAlbumCount = await boxAlbumService.getAlbumBoxCount(album!.albumId);
    const queueAlbumCount = await queueService.getAlbumQueueCount(album!.albumId);
    await boxAlbumService.deleteBoxAlbum(boxAlbumId);

    if (boxAlbumCount === 1 && queueAlbumCount === 0) {
      await albumService.deleteAlbum(album!.albumId);
    }

    const updatedBox = await boxService.getBoxById(boxId, viewingUser?.userId);

    return res.status(201).json(updatedBox);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Add an album to a subsection
routes.post("/:boxId/subsections/:subsectionId/albums", authenticate, async (req, res) => {
  try {
    const { boxId, subsectionId } = req.params;
    const { boxAlbumId } = req.body;
    const viewingUser: User = req.user;

    // Check if the album is a valid boxAlbum
    const albumInBox = await boxAlbumService.getAlbumInBox(boxAlbumId);
    if (!albumInBox) {
      return res.status(404).json({ error: "Album not found" });
    }

    // Check if the album is already in the subsection
    const albumInSubsection = await boxAlbumService.checkAlbumInSubsection(subsectionId, boxAlbumId);
    if (albumInSubsection) {
      return res.status(400).json({ error: "Album already in subsection" });
    }

    const boxAlbum = await boxAlbumService.getAlbumInBox(boxAlbumId);
    const maxAlbumPosition = await boxAlbumService.getMaxSubsectionAlbumPosition(subsectionId);
    const newAlbumPosition = (maxAlbumPosition || 0) + 1;
    await boxAlbumService.createBoxSubsectionAlbum(subsectionId, boxAlbum!.boxAlbumId, newAlbumPosition);

    const updatedBox = await boxService.getBoxById(boxId, viewingUser?.userId);

    return res.status(201).json(updatedBox);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Reorder an album in a subsection
routes.put("/:boxId/subsections/:subsectionId/albums/:boxAlbumId/reorder", async (req, res) => {
  try {
    const { subsectionId, boxAlbumId } = req.params;
    const { destinationId } = req.body;

    const albumInSubsection = await boxAlbumService.checkAlbumInSubsection(subsectionId, boxAlbumId);
    const destinationAlbum = await boxAlbumService.getAlbumInSubsection(subsectionId, destinationId);

    if (!albumInSubsection || !destinationAlbum) {
      return res.status(404).json({ error: "Album not found" });
    }

    const newPosition = destinationAlbum.position
    await boxAlbumService.updateSubsectionAlbumPosition(subsectionId, boxAlbumId, newPosition);

    return res.status(200).json({ message: "Album reordered successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Move an album to a different subsection
routes.put("/:boxId/subsections/:subsectionId/albums/:boxAlbumId/move", authenticate, async (req, res) => {
  try {
    const { boxId, boxAlbumId, subsectionId } = req.params;
    const { destinationSubsectionId } = req.body;
    const viewingUser: User = req.user;

    // Check if the album is a valid boxAlbum
    const albumInBox = await boxAlbumService.getAlbumInBox(boxAlbumId);
    if (!albumInBox) {
      return res.status(404).json({ error: "Album not found" });
    }

    // Check if the album is in the current subsection
    const albumInSubsection = await boxAlbumService.checkAlbumInSubsection(subsectionId, boxAlbumId);
    if (!albumInSubsection) {
      return res.status(404).json({ error: "Album not found in the current subsection" });
    }

    // Check if the album is already in the destination subsection
    const albumInDestinationSubsection = await boxAlbumService.checkAlbumInSubsection(destinationSubsectionId, boxAlbumId);
    if (albumInDestinationSubsection) {
      return res.status(400).json({ error: "Album already in the destination subsection" });
    }

    // Remove the album from the current subsection
    await boxAlbumService.deleteBoxSubsectionAlbum(subsectionId, boxAlbumId);

    // Get the max position in the destination subsection
    const maxAlbumPosition = await boxAlbumService.getMaxSubsectionAlbumPosition(destinationSubsectionId);
    const newAlbumPosition = (maxAlbumPosition || 0) + 1;

    // Add the album to the destination subsection
    await boxAlbumService.createBoxSubsectionAlbum(destinationSubsectionId, boxAlbumId, newAlbumPosition);

    const updatedBox = await boxService.getBoxById(boxId, viewingUser?.userId);

    return res.status(200).json(updatedBox);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Remove an album from a subsection
routes.delete("/:boxId/subsections/:subsectionId/albums/:boxAlbumId", authenticate, async (req, res) => {
  try {
    const { boxId, boxAlbumId, subsectionId } = req.params;
    const viewingUser: User = req.user;

    // Check if the album is in the subsection
    const albumInSubsection = await boxAlbumService.checkAlbumInSubsection(subsectionId, boxAlbumId);
    if (!albumInSubsection) {
      return res.status(404).json({ error: "Album not in subsection" });
    }

    await boxAlbumService.deleteBoxSubsectionAlbum(subsectionId, boxAlbumId);
    const updatedBox = await boxService.getBoxById(boxId, viewingUser?.userId);

    return res.status(200).json(updatedBox);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Update an album note
routes.put("/:boxId/albums/:boxAlbumId/note", async (req, res) => {
  try {
    const { boxAlbumId } = req.params;
    const { note } = req.body;
    const updatedNote = await boxAlbumService.updateBoxAlbumNote(boxAlbumId, note);

    return res.status(200).json({ updatedNote });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Update an album note in a subsection
routes.put("/:boxId/subsections/:subsectionId/albums/:boxAlbumId/note", async (req, res) => {
  try {
    const { boxAlbumId, subsectionId } = req.params;
    const { note } = req.body;
    const updatedNote = await boxAlbumService.updateBoxSubsectionAlbumNote(
      boxAlbumId,
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