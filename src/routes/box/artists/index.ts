import { Router } from "express";
import boxService from "../../../services/box/boxService";
import artistService from "../../../services/boxItem/artistService";

const routes = Router();

// Add an artist to a box
routes.post("/:boxId/artists", async (req, res) => {
  try {
    const { boxId } = req.params;
    const artistData = req.body.newArtist;

    const artistInBox = await artistService.checkArtistInBox(boxId, artistData.spotifyId);
    if (artistInBox) {
      return res.status(400).json({ error: "Item already in box" });
    }

    const newArtist = await artistService.createArtist(artistData);
    const maxArtistPosition = await artistService.getMaxBoxArtistPosition(boxId);
    const newArtistPosition = (maxArtistPosition || 0) + 1;
    const newBoxArtist = await artistService.createBoxArtist(boxId, newArtist.spotifyId, newArtistPosition);

    return res.status(201).json(newBoxArtist);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Reorder an artist in a box
routes.put("/:boxId/artists/:boxArtistId/reorder", async (req, res) => {
  try {
    const { boxId, boxArtistId } = req.params;
    const { destinationId } = req.body;

    const targetArtist = await artistService.getArtistInBox(boxArtistId);
    const destinationArtist = await artistService.getArtistInBox(destinationId);

    if (!targetArtist || !destinationArtist) {
      return res.status(404).json({ error: "Artist not found" });
    }

    const newPosition = destinationArtist.position;
    await artistService.updateBoxArtistPosition(targetArtist.boxArtistId, newPosition);

    return res.status(200).json({ message: "Artist reordered successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Delete an artist from a box
routes.delete("/:boxId/artists/:boxArtistId", async (req, res) => {
  try {
    const { boxId, boxArtistId } = req.params;

    const artist = await artistService.getArtistInBox(boxArtistId);

    const boxArtistCount = await artistService.getArtistBoxCount(artist!.artistId);
    await artistService.deleteBoxArtist(boxArtistId);

    if (boxArtistCount === 1) {
      await artistService.deleteArtist(artist!.artistId);
    }

    const updatedBox = await boxService.getBoxById(boxId);

    return res.status(201).json(updatedBox);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Add an artist to a subsection
routes.post("/:boxId/subsections/:subsectionId/artists", async (req, res) => {
  try {
    const { boxId, subsectionId } = req.params;
    const { boxArtistId } = req.body;

    // Check if the artist is a valid boxArtist
    const artistInBox = await artistService.getArtistInBox(boxArtistId);
    if (!artistInBox) {
      return res.status(404).json({ error: "Artist not found" });
    }

    // Check if the artist is already in the subsection
    const artistInSubsection = await artistService.checkArtistInSubsection(subsectionId, boxArtistId);
    if (artistInSubsection) {
      return res.status(400).json({ error: "Artist already in subsection" });
    }

    const boxArtist = await artistService.getArtistInBox(boxArtistId);
    const maxArtistPosition = await artistService.getMaxSubsectionArtistPosition(subsectionId);
    const newArtistPosition = (maxArtistPosition || 0) + 1;
    await artistService.createBoxSubsectionArtist(subsectionId, boxArtist!.boxArtistId, newArtistPosition);

    const updatedBox = await boxService.getBoxById(boxId);

    return res.status(201).json(updatedBox);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Reorder an artist in a subsection
routes.put("/:boxId/subsections/:subsectionId/artists/:boxArtistId/reorder", async (req, res) => {
  try {
    const { subsectionId, boxArtistId } = req.params;
    const { destinationId } = req.body;

    const artistInSubsection = await artistService.checkArtistInSubsection(subsectionId, boxArtistId);
    const destinationArtist = await artistService.getArtistInSubsection(subsectionId, destinationId);

    if (!artistInSubsection || !destinationArtist) {
      return res.status(404).json({ error: "Artist not found" });
    }

    const newPosition = destinationArtist.position;
    await artistService.updateSubsectionArtistPosition(subsectionId, boxArtistId, newPosition);

    return res.status(200).json({ message: "Artist reordered successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Move an artist to a different subsection
routes.put("/:boxId/subsections/:subsectionId/artists/:boxArtistId/move", async (req, res) => {
  try {
    const { boxId, boxArtistId, subsectionId } = req.params;
    const { destinationSubsectionId } = req.body;

    // Check if the artist is a valid boxArtist
    const artistInBox = await artistService.getArtistInBox(boxArtistId);
    if (!artistInBox) {
      return res.status(404).json({ error: "Artist not found" });
    }

    // Check if the artist is in the current subsection
    const artistInSubsection = await artistService.checkArtistInSubsection(subsectionId, boxArtistId);
    if (!artistInSubsection) {
      return res.status(404).json({ error: "Artist not found in the current subsection" });
    }

    // Check if the artist is already in the destination subsection
    const artistInDestinationSubsection = await artistService.checkArtistInSubsection(destinationSubsectionId, boxArtistId);
    if (artistInDestinationSubsection) {
      return res.status(400).json({ error: "Artist already in the destination subsection" });
    }

    // Remove the artist from the current subsection
    await artistService.deleteBoxSubsectionArtist(subsectionId, boxArtistId);

    // Get the max position in the destination subsection
    const maxArtistPosition = await artistService.getMaxSubsectionArtistPosition(destinationSubsectionId);
    const newArtistPosition = (maxArtistPosition || 0) + 1;

    // Add the artist to the destination subsection
    await artistService.createBoxSubsectionArtist(destinationSubsectionId, boxArtistId, newArtistPosition);

    const updatedBox = await boxService.getBoxById(boxId);

    return res.status(200).json(updatedBox);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Remove an artist from a subsection
routes.delete("/:boxId/subsections/:subsectionId/artists/:boxArtistId", async (req, res) => {
  try {
    const { boxId, boxArtistId, subsectionId } = req.params;
    await artistService.deleteBoxSubsectionArtist(subsectionId, boxArtistId);
    const updatedBox = await boxService.getBoxById(boxId);

    return res.status(200).json(updatedBox);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Update an artist note
routes.put("/:boxId/artists/:boxArtistId/note", async (req, res) => {
  try {
    const { boxArtistId } = req.params;
    const { note } = req.body;
    const updatedNote = await artistService.updateBoxArtistNote(boxArtistId, note);

    return res.status(200).json({ updatedNote });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Update an artist note in a subsection
routes.put("/:boxId/subsections/:subsectionId/artists/:boxArtistId/note", async (req, res) => {
  try {
    const { boxArtistId, subsectionId } = req.params;
    const { note } = req.body;
    const updatedNote = await artistService.updateBoxSubsectionArtistNote(
      boxArtistId,
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