import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import trackService from "../../services/boxItem/trackService";
import artistService from "../../services/boxItem/artistService";
import albumService from "../../services/boxItem/albumService";
import playlistService from "../../services/boxItem/playlistService";

const prisma = new PrismaClient();
const routes = Router();

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

export default routes;