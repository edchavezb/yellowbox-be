import { Router } from "express";
import playlistService from "../../../services/item/playlistService";

const routes = Router();

// Create a playlist
routes.post("/playlists", async (req, res) => {
  try {
    const playlistData = req.body;
    const newPlaylist = await playlistService.createPlaylist(playlistData);
    return res.status(201).json(newPlaylist);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Update a playlist's images
routes.put("/playlists/:playlistId/images", async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { updatedImages } = req.body;

    const updatedPlaylist = await playlistService.updatePlaylistImages(playlistId, updatedImages);

    return res.status(200).json({ updatedPlaylist });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Mark a playlist as played
routes.post("/playlists/:playlistId/played-by-user/:userId", async (req, res) => {
  try {
    const { userId, playlistId } = req.params;
    const { itemData } = req.body;
    await playlistService.createPlaylist(itemData);

    const result = await playlistService.markPlaylistAsPlayed(userId, playlistId);
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Remove a playlist play
routes.delete("/playlists/:playlistId/played-by-user/:userId", async (req, res) => {
  try {
    const { userId, playlistId } = req.params;

    await playlistService.removePlaylistPlay(userId, playlistId);
    return res.status(200).json({ message: "Playlist play removed successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Check if a playlist has been played by a user
routes.get("/playlists/:playlistId/played-by-user/:userId", async (req, res) => {
  try {
    const { userId, playlistId } = req.params;
    const played = await playlistService.checkPlaylistPlayedByUser(userId, playlistId);
    return res.status(200).json({ played });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Delete a playlist
routes.delete("/playlists/:playlistId", async (req, res) => {
  try {
    const { playlistId } = req.params;

    await playlistService.deletePlaylist(playlistId);
    return res.status(200).json({ message: "Playlist deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

export default routes;