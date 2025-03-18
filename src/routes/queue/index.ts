import { Router } from "express";
import queueService from "../../services/queue/queueService";
import albumService from "../../services/boxItem/albumService";
import artistService from "../../services/boxItem/artistService";
import playlistService from "../../services/boxItem/playlistService";
import trackService from "../../services/boxItem/trackService";
import { PrismaClient } from "@prisma/client";

const routes = Router();
const prisma = new PrismaClient();

// Create a queue for a user if it doesn't exist
routes.post("/:userId/queue/create", async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if the queue already exists
    const existingQueue = await prisma.userQueue.findUnique({
      where: { userId },
    });

    if (existingQueue) {
      return res.status(400).json({ error: "Queue already exists for this user." });
    }

    // Create a new queue for the user
    const newQueue = await prisma.userQueue.create({
      data: {
        userId,
      },
    });

    return res.status(201).json(newQueue);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Add an album to the queue
routes.post("/:userId/queue/albums", async (req, res) => {
  try {
    const { userId } = req.params;
    const { newAlbum: albumData } = req.body;

    const queueId = await queueService.getQueueId(userId);

    // Check if the album is already in the queue
    const albumInQueue = await queueService.isAlbumInQueue(queueId, albumData.spotifyId);
    if (albumInQueue) {
      return res.status(400).json({ error: "Item already in queue" });
    }

    // Check the total count of items in the queue
    const totalItemCount = await queueService.getTotalQueueItemCount(queueId);
    if (totalItemCount >= 50) {
      return res.status(400).json({ error: "Queue is full. Maximum 50 items allowed." });
    }
    const newAlbum = await albumService.createAlbum(albumData);

    // Get the maximum position from all queue item types
    const [maxAlbumPosition, maxArtistPosition, maxPlaylistPosition, maxTrackPosition] = await Promise.all([
      queueService.getMaxQueueAlbumPosition(queueId),
      queueService.getMaxQueueArtistPosition(queueId),
      queueService.getMaxQueuePlaylistPosition(queueId),
      queueService.getMaxQueueTrackPosition(queueId),
    ]);
    const maxQueuePosition = Math.max(maxAlbumPosition || 0, maxArtistPosition || 0, maxPlaylistPosition || 0, maxTrackPosition || 0);
    const newAlbumPosition = (maxQueuePosition || 0) + 1;
    const newQueueAlbum = await queueService.createQueueAlbum(queueId, newAlbum.spotifyId, newAlbumPosition);

    return res.status(201).json(newQueueAlbum);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Add an artist to the queue
routes.post("/:userId/queue/artists", async (req, res) => {
  try {
    const { userId } = req.params;
    const { newArtist: artistData } = req.body;

    const queueId = await queueService.getQueueId(userId);

    // Check if the artist is already in the queue
    const artistInQueue = await queueService.isArtistInQueue(queueId, artistData.spotifyId);
    if (artistInQueue) {
      return res.status(400).json({ error: "Item already in queue" });
    }

    // Check the total count of items in the queue
    const totalItemCount = await queueService.getTotalQueueItemCount(queueId);
    if (totalItemCount >= 50) {
      return res.status(400).json({ error: "Queue is full. Maximum 50 items allowed." });
    }
    const newArtist = await artistService.createArtist(artistData);

    // Get the maximum position from all queue item types
    const [maxAlbumPosition, maxArtistPosition, maxPlaylistPosition, maxTrackPosition] = await Promise.all([
      queueService.getMaxQueueAlbumPosition(queueId),
      queueService.getMaxQueueArtistPosition(queueId),
      queueService.getMaxQueuePlaylistPosition(queueId),
      queueService.getMaxQueueTrackPosition(queueId),
    ]);
    const maxQueuePosition = Math.max(maxAlbumPosition || 0, maxArtistPosition || 0, maxPlaylistPosition || 0, maxTrackPosition || 0);
    const newArtistPosition = (maxQueuePosition || 0) + 1;
    const newQueueArtist = await queueService.createQueueArtist(queueId, newArtist.spotifyId, newArtistPosition);

    return res.status(201).json(newQueueArtist);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Add a playlist to the queue
routes.post("/:userId/queue/playlists", async (req, res) => {
  try {
    const { userId } = req.params;
    const { newPlaylist: playlistData } = req.body;

    const queueId = await queueService.getQueueId(userId);

    // Check if the playlist is already in the queue
    const playlistInQueue = await queueService.isPlaylistInQueue(queueId, playlistData.spotifyId);
    if (playlistInQueue) {
      return res.status(400).json({ error: "Item already in queue" });
    }

    // Check the total count of items in the queue
    const totalItemCount = await queueService.getTotalQueueItemCount(queueId);
    if (totalItemCount >= 50) {
      return res.status(400).json({ error: "Queue is full. Maximum 50 items allowed." });
    }
    const newPlaylist = await playlistService.createPlaylist(playlistData);

    // Get the maximum position from all queue item types
    const [maxAlbumPosition, maxArtistPosition, maxPlaylistPosition, maxTrackPosition] = await Promise.all([
      queueService.getMaxQueueAlbumPosition(queueId),
      queueService.getMaxQueueArtistPosition(queueId),
      queueService.getMaxQueuePlaylistPosition(queueId),
      queueService.getMaxQueueTrackPosition(queueId),
    ]);
    const maxQueuePosition = Math.max(maxAlbumPosition || 0, maxArtistPosition || 0, maxPlaylistPosition || 0, maxTrackPosition || 0);

    const newPlaylistPosition = (maxQueuePosition || 0) + 1;
    const newQueuePlaylist = await queueService.createQueuePlaylist(queueId, newPlaylist.spotifyId, newPlaylistPosition);

    return res.status(201).json(newQueuePlaylist);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Add a track to the queue
routes.post("/:userId/queue/tracks", async (req, res) => {
  try {
    const { userId } = req.params;
    const { newTrack: trackData } = req.body;

    const queueId = await queueService.getQueueId(userId);

    // Check if the track is already in the queue
    const trackInQueue = await queueService.isTrackInQueue(queueId, trackData.spotifyId);
    if (trackInQueue) {
      return res.status(400).json({ error: "Item already in queue" });
    }

    // Check the total count of items in the queue
    const totalItemCount = await queueService.getTotalQueueItemCount(queueId);
    if (totalItemCount >= 50) {
      return res.status(400).json({ error: "Queue is full. Maximum 50 items allowed." });
    }
    const newTrack = await trackService.createTrack(trackData);

    // Get the maximum position from all queue item types
    const [maxAlbumPosition, maxArtistPosition, maxPlaylistPosition, maxTrackPosition] = await Promise.all([
      queueService.getMaxQueueAlbumPosition(queueId),
      queueService.getMaxQueueArtistPosition(queueId),
      queueService.getMaxQueuePlaylistPosition(queueId),
      queueService.getMaxQueueTrackPosition(queueId),
    ]);
    const maxQueuePosition = Math.max(maxAlbumPosition || 0, maxArtistPosition || 0, maxPlaylistPosition || 0, maxTrackPosition || 0);
    const newTrackPosition = (maxQueuePosition || 0) + 1;
    const newQueueTrack = await queueService.createQueueTrack(queueId, newTrack.spotifyId, newTrackPosition);

    return res.status(201).json(newQueueTrack);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Remove an album from the queue
routes.delete("/:userId/queue/albums/:spotifyId", async (req, res) => {
  try {
    const { userId, spotifyId } = req.params;

    const queueId = await queueService.getQueueId(userId);

    await queueService.deleteQueueAlbum(queueId, spotifyId);

    return res.status(200).json({ message: "Album removed from queue successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Remove an artist from the queue
routes.delete("/:userId/queue/artists/:spotifyId", async (req, res) => {
  try {
    const { userId, spotifyId } = req.params;

    const queueId = await queueService.getQueueId(userId);

    await queueService.deleteQueueArtist(queueId, spotifyId);

    return res.status(200).json({ message: "Artist removed from queue successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Remove a playlist from the queue
routes.delete("/:userId/queue/playlists/:spotifyId", async (req, res) => {
  try {
    const { userId, spotifyId } = req.params;

    const queueId = await queueService.getQueueId(userId);

    await queueService.deleteQueuePlaylist(queueId, spotifyId);

    return res.status(200).json({ message: "Playlist removed from queue successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Remove a track from the queue
routes.delete("/:userId/queue/tracks/:spotifyId", async (req, res) => {
  try {
    const { userId, spotifyId } = req.params;

    const queueId = await queueService.getQueueId(userId);

    await queueService.deleteQueueTrack(queueId, spotifyId);

    return res.status(200).json({ message: "Track removed from queue successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Mark an album as played
routes.put("/:userId/queue/albums/:spotifyId/played", async (req, res) => {
  try {
    const { userId, spotifyId } = req.params;

    const queueId = await queueService.getQueueId(userId);

    await queueService.markQueueAlbumAsPlayed(queueId, spotifyId);

    return res.status(200).json({ message: "Album marked as played successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Mark an artist as played
routes.put("/:userId/queue/artists/:spotifyId/played", async (req, res) => {
  try {
    const { userId, spotifyId } = req.params;

    const queueId = await queueService.getQueueId(userId);

    await queueService.markQueueArtistAsPlayed(queueId, spotifyId);

    return res.status(200).json({ message: "Artist marked as played successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Mark a playlist as played
routes.put("/:userId/queue/playlists/:spotifyId/played", async (req, res) => {
  try {
    const { userId, spotifyId } = req.params;

    const queueId = await queueService.getQueueId(userId);

    await queueService.markQueuePlaylistAsPlayed(queueId, spotifyId);

    return res.status(200).json({ message: "Playlist marked as played successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Mark a track as played
routes.put("/:userId/queue/tracks/:spotifyId/played", async (req, res) => {
  try {
    const { userId, spotifyId } = req.params;

    const queueId = await queueService.getQueueId(userId);

    await queueService.markQueueTrackAsPlayed(queueId, spotifyId);

    return res.status(200).json({ message: "Track marked as played successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Retrieve a user's queue
routes.get("/:userId/queue", async (req, res) => {
  try {
    const { userId } = req.params;

    const queueId = await queueService.getQueueId(userId);

    // Retrieve the queue items from all four tables
    const [queueAlbums, queueArtists, queuePlaylists, queueTracks] = await Promise.all([
      prisma.queueAlbum.findMany({
        where: { queueId },
        include: { album: true },
      }),
      prisma.queueArtist.findMany({
        where: { queueId },
        include: { artist: true },
      }),
      prisma.queuePlaylist.findMany({
        where: { queueId },
        include: { playlist: true },
      }),
      prisma.queueTrack.findMany({
        where: { queueId },
        include: { track: true },
      }),
    ]);

    // Transform the results into a consistent format
    const transformedQueueAlbums = queueAlbums.map(queueAlbum => ({
      queueItemId: queueAlbum.queueAlbumId,
      position: queueAlbum.position,
      isPlayed: queueAlbum.isPlayed,
      itemData: queueAlbum.album,
    }));

    const transformedQueueArtists = queueArtists.map(queueArtist => ({
      queueItemId: queueArtist.queueArtistId,
      position: queueArtist.position,
      isPlayed: queueArtist.isPlayed,
      itemData: queueArtist.artist,
    }));

    const transformedQueuePlaylists = queuePlaylists.map(queuePlaylist => ({
      queueItemId: queuePlaylist.queuePlaylistId,
      position: queuePlaylist.position,
      isPlayed: queuePlaylist.isPlayed,
      itemData: queuePlaylist.playlist,
    }));

    const transformedQueueTracks = queueTracks.map(queueTrack => ({
      queueItemId: queueTrack.queueTrackId,
      position: queueTrack.position,
      isPlayed: queueTrack.isPlayed,
      itemData: queueTrack.track,
    }));

    // Combine and sort the results by position
    const combinedQueue = [
      ...transformedQueueAlbums,
      ...transformedQueueArtists,
      ...transformedQueuePlaylists,
      ...transformedQueueTracks,
    ].sort((a, b) => a.position - b.position);

    return res.status(200).json(combinedQueue);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

export default routes;