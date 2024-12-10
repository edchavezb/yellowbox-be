import { Router } from "express";
import boxService from "../../../services/box/boxService";
import albumService from "../../../services/boxItem/albumService";

const routes = Router();

// TESTED
// Add an album to a box
routes.post("/:boxId/albums", async (req, res) => {
  try {
    const { boxId } = req.params;
    const albumData = req.body.newAlbum;

    // Check if the artist already exists in the box
    const albumInBox = await albumService.checkAlbumInBox(boxId, albumData.spotifyId);

    if (albumInBox) {
      return res.status(400).json({ error: "Item already in box" });
    }

    // Check if the album already exists. If not create it.
    const newAlbum = await albumService.createAlbum(albumData);
    const maxAlbumPosition = await albumService.getMaxBoxAlbumPosition(boxId);
    // Determine the new album position
    const newAlbumPosition = (maxAlbumPosition || 0) + 1;
    const newBoxAlbum = await albumService.createBoxAlbum(boxId, newAlbum.itemId, newAlbumPosition);

    return res.status(201).json(newBoxAlbum);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// TESTED
// Reorder an album in a box
routes.put("/:boxId/albums/:albumId/reorder", async (req, res) => {
  try {
    const { boxId, albumId } = req.params;
    const newPosition = parseInt(req.body.newPosition);

    const targetAlbum = await albumService.getAlbumInBox(boxId, albumId);

    if (!targetAlbum) {
      return res.status(404).json({ error: "Album not found" });
    }

    await albumService.updateBoxAlbumPosition(targetAlbum.boxAlbumId, newPosition);
    await albumService.updateSubsequentBoxAlbumPositions(boxId, albumId, newPosition);

    return res.status(200).json({ message: "Album reordered successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// TESTED
// Delete an album from a box
routes.delete("/:boxId/albums/:albumId", async (req, res) => {
  try {
    const { boxId, albumId } = req.params;

    const boxAlbumCount = await albumService.getAlbumBoxCount(albumId);
    await albumService.deleteBoxAlbum(boxId, albumId);

    if (boxAlbumCount === 1) {
      await albumService.deleteAlbum(albumId);
    }

    const updatedBox = await albumService.getBoxWithAlbums(boxId);
    const updatedAlbums = updatedBox!.albums.map(item => ({ note: item.note, position: item.position, subsections: item.subsections, ...item.album }))

    return res.status(201).json(updatedAlbums);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// TESTED
// Add an album to a subsection
routes.post("/:boxId/subsections/:subsectionId/albums", async (req, res) => {
  try {
    const { boxId, subsectionId } = req.params;
    const { itemId } = req.body;

    const boxAlbum = await albumService.getAlbumInBox(boxId, itemId);

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
    const newPosition = parseInt(req.body.newPosition);

    const albumInSubsection = await albumService.checkAlbumInSubsection(subsectionId, boxAlbumId);

    if (!albumInSubsection) {
      return res.status(404).json({ error: "Album not found" });
    }

    await albumService.updateSubsectionAlbumPosition(subsectionId, boxAlbumId, newPosition);
    await albumService.updateSubsequentSubsectionAlbumPositions(subsectionId, boxAlbumId, newPosition);

    return res.status(200).json({ message: "Album reordered successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Remove an album from a subsection
routes.delete("/:boxId/subsections/:subsectionId/albums/:boxAlbumId", async (req, res) => {
  try {
    const { boxAlbumId, subsectionId } = req.params;
    await albumService.deleteBoxSubsectionAlbum(subsectionId, boxAlbumId);

    return res.status(200).json({ message: "Album removed from subsection successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

export default routes;