import { Router } from "express";
import boxService from "../../../services/box/boxService";
import boxArtistService from "../../../services/boxItem/boxArtistService";
import queueService from "../../../services/queue/queueService";
import artistService from "../../../services/item/artistService";
import authenticate from "../../../middleware/autenticate";
import { User } from "@prisma/client";

const routes = Router();

// Add an artist to a box
routes.post("/:boxId/artists", async (req, res) => {
  try {
    const { boxId } = req.params;
    const artistData = req.body.newArtist;

    const artistInBox = await boxArtistService.checkArtistInBox(boxId, artistData.spotifyId);
    if (artistInBox) {
      return res.status(400).json({ error: "Item already in box" });
    }

    const newArtist = await artistService.createArtist(artistData);
    const maxArtistPosition = await boxArtistService.getMaxBoxArtistPosition(boxId);
    const newArtistPosition = (maxArtistPosition || 0) + 1;
    const newBoxArtist = await boxArtistService.createBoxArtist(boxId, newArtist.spotifyId, newArtistPosition);

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

    const targetArtist = await boxArtistService.getArtistInBox(boxArtistId);
    const destinationArtist = await boxArtistService.getArtistInBox(destinationId);

    if (!targetArtist || !destinationArtist) {
      return res.status(404).json({ error: "Artist not found" });
    }

    const newPosition = destinationArtist.position;
    await boxArtistService.updateBoxArtistPosition(targetArtist.boxArtistId, newPosition);

    return res.status(200).json({ message: "Artist reordered successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Delete an artist from a box
routes.delete("/:boxId/artists/:boxArtistId", authenticate, async (req, res) => {
  try {
    const { boxId, boxArtistId } = req.params;
    const viewingUser: User = req.user;

    const artist = await boxArtistService.getArtistInBox(boxArtistId);

    const boxArtistCount = await boxArtistService.getArtistBoxCount(artist!.artistId);
    const queueArtistCount = await queueService.getArtistQueueCount(artist!.artistId);
    await boxArtistService.deleteBoxArtist(boxArtistId);

    if (boxArtistCount === 1 && queueArtistCount === 0) {
      await artistService.deleteArtist(artist!.artistId);
    }

    const updatedBox = await boxService.getBoxById(boxId, viewingUser?.userId);

    return res.status(201).json(updatedBox);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Add an artist to a subsection
routes.post("/:boxId/subsections/:subsectionId/artists", authenticate, async (req, res) => {
  try {
    const { boxId, subsectionId } = req.params;
    const { boxArtistId } = req.body;
    const viewingUser: User = req.user;

    // Check if the artist is a valid boxArtist
    const artistInBox = await boxArtistService.getArtistInBox(boxArtistId);
    if (!artistInBox) {
      return res.status(404).json({ error: "Artist not found" });
    }

    // Check if the artist is already in the subsection
    const artistInSubsection = await boxArtistService.checkArtistInSubsection(subsectionId, boxArtistId);
    if (artistInSubsection) {
      return res.status(400).json({ error: "Artist already in subsection" });
    }

    const boxArtist = await boxArtistService.getArtistInBox(boxArtistId);
    const maxArtistPosition = await boxArtistService.getMaxSubsectionArtistPosition(subsectionId);
    const newArtistPosition = (maxArtistPosition || 0) + 1;
    await boxArtistService.createBoxSubsectionArtist(subsectionId, boxArtist!.boxArtistId, newArtistPosition);

    const updatedBox = await boxService.getBoxById(boxId, viewingUser?.userId);

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

    const artistInSubsection = await boxArtistService.checkArtistInSubsection(subsectionId, boxArtistId);
    const destinationArtist = await boxArtistService.getArtistInSubsection(subsectionId, destinationId);

    if (!artistInSubsection || !destinationArtist) {
      return res.status(404).json({ error: "Artist not found" });
    }

    const newPosition = destinationArtist.position;
    await boxArtistService.updateSubsectionArtistPosition(subsectionId, boxArtistId, newPosition);

    return res.status(200).json({ message: "Artist reordered successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Move an artist to a different subsection
routes.put("/:boxId/subsections/:subsectionId/artists/:boxArtistId/move", authenticate, async (req, res) => {
  try {
    const { boxId, boxArtistId, subsectionId } = req.params;
    const { destinationSubsectionId } = req.body;
    const viewingUser: User = req.user;

    // Check if the artist is a valid boxArtist
    const artistInBox = await boxArtistService.getArtistInBox(boxArtistId);
    if (!artistInBox) {
      return res.status(404).json({ error: "Artist not found" });
    }

    // Check if the artist is in the current subsection
    const artistInSubsection = await boxArtistService.checkArtistInSubsection(subsectionId, boxArtistId);
    if (!artistInSubsection) {
      return res.status(404).json({ error: "Artist not found in the current subsection" });
    }

    // Check if the artist is already in the destination subsection
    const artistInDestinationSubsection = await boxArtistService.checkArtistInSubsection(destinationSubsectionId, boxArtistId);
    if (artistInDestinationSubsection) {
      return res.status(400).json({ error: "Artist already in the destination subsection" });
    }

    // Remove the artist from the current subsection
    await boxArtistService.deleteBoxSubsectionArtist(subsectionId, boxArtistId);

    // Get the max position in the destination subsection
    const maxArtistPosition = await boxArtistService.getMaxSubsectionArtistPosition(destinationSubsectionId);
    const newArtistPosition = (maxArtistPosition || 0) + 1;

    // Add the artist to the destination subsection
    await boxArtistService.createBoxSubsectionArtist(destinationSubsectionId, boxArtistId, newArtistPosition);

    const updatedBox = await boxService.getBoxById(boxId, viewingUser?.userId);

    return res.status(200).json(updatedBox);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Remove an artist from a subsection
routes.delete("/:boxId/subsections/:subsectionId/artists/:boxArtistId", authenticate, async (req, res) => {
  try {
    const { boxId, boxArtistId, subsectionId } = req.params;
    const viewingUser: User = req.user;

    // Check if the artist is in the subsection
    const artistInSubsection = await boxArtistService.checkArtistInSubsection(subsectionId, boxArtistId);
    if (!artistInSubsection) {
      return res.status(400).json({ error: "Artist not in subsection" });
    }

    await boxArtistService.deleteBoxSubsectionArtist(subsectionId, boxArtistId);
    const updatedBox = await boxService.getBoxById(boxId, viewingUser?.userId);

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
    const updatedNote = await boxArtistService.updateBoxArtistNote(boxArtistId, note);

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
    const updatedNote = await boxArtistService.updateBoxSubsectionArtistNote(
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