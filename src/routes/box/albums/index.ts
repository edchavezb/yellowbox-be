import { Router } from "express";
import boxService from "../../../services/box/boxService";
import albumService from "../../../services/boxItem/albumService";

const routes = Router();

// Add an album to a box
routes.post("/:boxId/albums", async (req, res) => {
  try {
    const { boxId } = req.params;
    const albumData = req.body.newAlbum;

    const albumInBox = await albumService.checkAlbumInBox(boxId, albumData.spotifyId);
    if (albumInBox) {
      return res.status(400).json({ error: "Item already in box" });
    }

    const newAlbum = await albumService.createAlbum(albumData);
    const maxAlbumPosition = await albumService.getMaxBoxAlbumPosition(boxId);
    const newAlbumPosition = (maxAlbumPosition || 0) + 1;
    const newBoxAlbum = await albumService.createBoxAlbum(boxId, newAlbum.spotifyId, newAlbumPosition);

    return res.status(201).json(newBoxAlbum);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Reorder an album in a box
routes.put("/:boxId/albums/:boxAlbumId/reorder", async (req, res) => {
  try {
    const { boxId, boxAlbumId } = req.params;
    const { destinationId } = req.body;

    const targetAlbum = await albumService.getAlbumInBox(boxAlbumId);
    const destinationAlbum = await albumService.getAlbumInBox(destinationId);

    if (!targetAlbum || !destinationAlbum) {
      return res.status(404).json({ error: "Album not found" });
    }

    const newPosition = destinationAlbum.position;
    await albumService.updateBoxAlbumPosition(targetAlbum.boxAlbumId, newPosition);

    return res.status(200).json({ message: "Album reordered successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Delete an album from a box
routes.delete("/:boxId/albums/:boxAlbumId", async (req, res) => {
  try {
    const { boxId, boxAlbumId } = req.params;

    const album = await albumService.getAlbumInBox(boxAlbumId);

    const boxAlbumCount = await albumService.getAlbumBoxCount(album!.albumId);
    await albumService.deleteBoxAlbum(boxAlbumId);

    if (boxAlbumCount === 1) {
      await albumService.deleteAlbum(album!.albumId);
    }

    const updatedBox = await boxService.getBoxById(boxId);

    return res.status(201).json(updatedBox);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Add an album to a subsection
routes.post("/:boxId/subsections/:subsectionId/albums", async (req, res) => {
  try {
    const { boxId, subsectionId } = req.params;
    const { boxAlbumId } = req.body;

    // Check if the album is a valid boxAlbum
    const albumInBox = await albumService.getAlbumInBox(boxAlbumId);
    if (!albumInBox) {
      return res.status(404).json({ error: "Album not found" });
    }

    // Check if the album is already in the subsection
    const albumInSubsection = await albumService.checkAlbumInSubsection(subsectionId, boxAlbumId);
    if (albumInSubsection) {
      return res.status(400).json({ error: "Album already in subsection" });
    }

    const boxAlbum = await albumService.getAlbumInBox(boxAlbumId);
    const maxAlbumPosition = await albumService.getMaxSubsectionAlbumPosition(subsectionId);
    const newAlbumPosition = (maxAlbumPosition || 0) + 1;
    await albumService.createBoxSubsectionAlbum(subsectionId, boxAlbum!.boxAlbumId, newAlbumPosition);

    const updatedBox = await boxService.getBoxById(boxId);

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

    const albumInSubsection = await albumService.checkAlbumInSubsection(subsectionId, boxAlbumId);
    const destinationAlbum = await albumService.getAlbumInSubsection(subsectionId, destinationId);

    if (!albumInSubsection || !destinationAlbum) {
      return res.status(404).json({ error: "Album not found" });
    }

    const newPosition = destinationAlbum.position
    await albumService.updateSubsectionAlbumPosition(subsectionId, boxAlbumId, newPosition);

    return res.status(200).json({ message: "Album reordered successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Move an album to a different subsection
routes.put("/:boxId/subsections/:subsectionId/albums/:boxAlbumId/move", async (req, res) => {
  try {
    const { boxId, boxAlbumId, subsectionId } = req.params;
    const { destinationSubsectionId } = req.body;

    // Check if the album is a valid boxAlbum
    const albumInBox = await albumService.getAlbumInBox(boxAlbumId);
    if (!albumInBox) {
      return res.status(404).json({ error: "Album not found" });
    }

    // Check if the album is in the current subsection
    const albumInSubsection = await albumService.checkAlbumInSubsection(subsectionId, boxAlbumId);
    if (!albumInSubsection) {
      return res.status(404).json({ error: "Album not found in the current subsection" });
    }

    // Check if the album is already in the destination subsection
    const albumInDestinationSubsection = await albumService.checkAlbumInSubsection(destinationSubsectionId, boxAlbumId);
    if (albumInDestinationSubsection) {
      return res.status(400).json({ error: "Album already in the destination subsection" });
    }

    // Remove the album from the current subsection
    await albumService.deleteBoxSubsectionAlbum(subsectionId, boxAlbumId);

    // Get the max position in the destination subsection
    const maxAlbumPosition = await albumService.getMaxSubsectionAlbumPosition(destinationSubsectionId);
    const newAlbumPosition = (maxAlbumPosition || 0) + 1;

    // Add the album to the destination subsection
    await albumService.createBoxSubsectionAlbum(destinationSubsectionId, boxAlbumId, newAlbumPosition);

    const updatedBox = await boxService.getBoxById(boxId);

    return res.status(200).json(updatedBox);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Remove an album from a subsection
routes.delete("/:boxId/subsections/:subsectionId/albums/:boxAlbumId", async (req, res) => {
  try {
    const { boxId, boxAlbumId, subsectionId } = req.params;
    await albumService.deleteBoxSubsectionAlbum(subsectionId, boxAlbumId);
    const updatedBox = await boxService.getBoxById(boxId);

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
    const updatedNote = await albumService.updateBoxAlbumNote(boxAlbumId, note);

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
    const updatedNote = await albumService.updateBoxSubsectionAlbumNote(
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