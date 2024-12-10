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
    const newBoxArtist = await artistService.createBoxArtist(boxId, newArtist.itemId, newArtistPosition);

    return res.status(201).json(newBoxArtist);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Reorder an artist in a box
routes.put("/:boxId/artists/:artistId/reorder", async (req, res) => {
  try {
    const { boxId, artistId } = req.params;
    const newPosition = parseInt(req.body.newPosition);

    const targetArtist = await artistService.getArtistInBox(boxId, artistId);

    if (!targetArtist) {
      return res.status(404).json({ error: "Artist not found" });
    }

    await artistService.updateBoxArtistPosition(targetArtist.boxArtistId, newPosition);
    await artistService.updateSubsequentBoxArtistPositions(boxId, artistId, newPosition);

    return res.status(200).json({ message: "Artist reordered successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Delete an artist from a box
routes.delete("/:boxId/artists/:artistId", async (req, res) => {
  try {
    const { boxId, artistId } = req.params;

    const boxArtistCount = await artistService.getArtistBoxCount(artistId);
    await artistService.deleteBoxArtist(boxId, artistId);

    if (boxArtistCount === 1) {
      await artistService.deleteArtist(artistId);
    }

    const updatedBox = await artistService.getBoxWithArtists(boxId);
    const updatedArtists = updatedBox!.artists.map(item => ({ note: item.note, position: item.position, subsections: item.subsections, ...item.artist }));

    return res.status(201).json(updatedArtists);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Add an artist to a subsection
routes.post("/:boxId/subsections/:subsectionId/artists", async (req, res) => {
  try {
    const { boxId, subsectionId } = req.params;
    const { itemId } = req.body;

    const boxArtist = await artistService.getArtistInBox(boxId, itemId);
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
    const newPosition = parseInt(req.body.newPosition);

    const artistInSubsection = await artistService.checkArtistInSubsection(subsectionId, boxArtistId);

    if (!artistInSubsection) {
      return res.status(404).json({ error: "Artist not found" });
    }

    await artistService.updateSubsectionArtistPosition(subsectionId, boxArtistId, newPosition);
    await artistService.updateSubsequentSubsectionArtistPositions(subsectionId, boxArtistId, newPosition);

    return res.status(200).json({ message: "Artist reordered successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Remove an artist from a subsection
routes.delete("/:boxId/subsections/:subsectionId/artists/:boxArtistId", async (req, res) => {
  try {
    const { boxArtistId, subsectionId } = req.params;
    await artistService.deleteBoxSubsectionArtist(subsectionId, boxArtistId);

    return res.status(200).json({ message: "Artist removed from subsection successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

export default routes;