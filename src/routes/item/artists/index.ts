import { Router } from "express";
import artistService from "../../../services/item/artistService";

const routes = Router();

// Create an artist
routes.post("/artists", async (req, res) => {
  try {
    const artistData = req.body;
    const newArtist = await artistService.createArtist(artistData);
    return res.status(201).json(newArtist);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Update an artist's images
routes.put("/artists/:artistId/images", async (req, res) => {
  try {
    const { artistId } = req.params;
    const { updatedImages } = req.body;

    const updatedArtist = await artistService.updateArtistImages(artistId, updatedImages);

    return res.status(200).json({ updatedArtist });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Mark an artist as played
routes.post("/artists/:artistId/played-by-user/:userId", async (req, res) => {
  try {
    const { artistId, userId } = req.params;
    const { itemData } = req.body;
    await artistService.createArtist(itemData);

    const result = await artistService.markArtistAsPlayed(userId, artistId);
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Remove an artist play
routes.delete("/artists/:artistId/played-by-user/:userId", async (req, res) => {
  try {
    const { artistId, userId } = req.params;

    await artistService.removeArtistPlay(userId, artistId);
    return res.status(200).json({ message: "Artist play removed successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Check if an artist has been played by a user
routes.get("/artists/:artistId/played-by-user/:userId", async (req, res) => {
  try {
    const { artistId, userId } = req.params;

    const played = await artistService.checkArtisPlayedByUser(userId, artistId);
    return res.status(200).json({ played });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Delete an artist
routes.delete("/artists/:artistId", async (req, res) => {
  try {
    const { artistId } = req.params;

    await artistService.deleteArtist(artistId);
    return res.status(200).json({ message: "Artist deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

export default routes;