import { Router } from "express";
import trackService from "../../../services/item/trackService";

const routes = Router();

// Create a track
routes.post("/tracks", async (req, res) => {
  try {
    const trackData = req.body;
    const newTrack = await trackService.createTrack(trackData);
    return res.status(201).json(newTrack);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Update a track's images
routes.put("/tracks/:trackId/images", async (req, res) => {
  try {
    const { trackId } = req.params;
    const { updatedImages } = req.body;

    const updatedTrack = await trackService.updateTrackImages(trackId, updatedImages);

    return res.status(200).json({ updatedTrack });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Mark a track as played
routes.post("/tracks/:trackId/played-by-user/:userId", async (req, res) => {
  try {
    const { userId, trackId } = req.params;
    const { itemData } = req.body;
    await trackService.createTrack(itemData);

    const result = await trackService.markTrackAsPlayed(userId, trackId);
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Remove a track play
routes.delete("/tracks/:trackId/played-by-user/:userId", async (req, res) => {
  try {
    const { userId, trackId } = req.params;

    await trackService.removeTrackPlay(userId, trackId);
    return res.status(200).json({ message: "Track play removed successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Check if a track has been played by a user
routes.get("/tracks/:trackId/played-by-user/:userId", async (req, res) => {
  try {
    const { userId, trackId } = req.params;

    const played = await trackService.checkTrackPlayedByUser(userId, trackId);
    return res.status(200).json({ played });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Delete a track
routes.delete("/tracks/:trackId", async (req, res) => {
  try {
    const { trackId } = req.params;

    await trackService.deleteTrack(trackId);
    return res.status(200).json({ message: "Track deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

export default routes;