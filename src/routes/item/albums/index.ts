import { Router } from "express";
import albumService from "../../../services/item/albumService";

const routes = Router();

// Create an album
routes.post("/albums", async (req, res) => {
  try {
    const albumData = req.body;
    const newAlbum = await albumService.createAlbum(albumData);
    return res.status(201).json(newAlbum);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Update an album's images
routes.put("/albums/:albumId/images", async (req, res) => {
  try {
    const { albumId } = req.params;
    const { updatedImages } = req.body;

    const updatedAlbum = await albumService.updateAlbumImages(albumId, updatedImages);

    return res.status(200).json({ updatedAlbum });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Mark an album as played
routes.post("/albums/:albumId/played-by-user/:userId", async (req, res) => {
  try {
    const { albumId, userId } = req.params;
    const { itemData } = req.body;
    await albumService.createAlbum(itemData);

    const result = await albumService.markAlbumAsPlayed(userId, albumId);
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Remove an album play
routes.delete("/albums/:albumId/played-by-user/:userId", async (req, res) => {
  try {
    const { albumId, userId } = req.params;

    await albumService.removeAlbumPlay(userId, albumId);
    return res.status(200).json({ message: "Album play removed successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Check if an album has been played by a user
routes.get("/albums/:albumId/played-by-user/:userId", async (req, res) => {
  try {
    const { albumId, userId } = req.params;

    const played = await albumService.checkAlbumPlayedByUser(userId, albumId);
    return res.status(200).json({ played });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Delete an album
routes.delete("/albums/:albumId", async (req, res) => {
  try {
    const { albumId } = req.params;

    await albumService.deleteAlbum(albumId);
    return res.status(200).json({ message: "Album deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

export default routes;