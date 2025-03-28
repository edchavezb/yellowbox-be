import { Router } from "express";
import queueService from "../../services/queue/queueService";
import { PrismaClient } from "@prisma/client";
import albumService from "../../services/item/albumService";
import artistService from "../../services/item/artistService";
import playlistService from "../../services/item/playlistService";
import trackService from "../../services/item/trackService";

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
    const newQueueItem = await queueService.createQueueAlbum(queueId, newAlbum.spotifyId, newAlbumPosition);

    return res.status(201).json({newQueueItem: {queueItemId: newQueueItem.queueAlbumId, ...newQueueItem}});
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
    const newQueueItem = await queueService.createQueueArtist(queueId, newArtist.spotifyId, newArtistPosition);

    return res.status(201).json({newQueueItem: {queueItemId: newQueueItem.queueArtistId, ...newQueueItem}});
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
    const newQueueItem = await queueService.createQueuePlaylist(queueId, newPlaylist.spotifyId, newPlaylistPosition);

    return res.status(201).json({newQueueItem: {queueItemId: newQueueItem.queuePlaylistId, ...newQueueItem}});
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
    const newQueueItem = await queueService.createQueueTrack(queueId, newTrack.spotifyId, newTrackPosition);

    return res.status(201).json({newQueueItem: {queueItemId: newQueueItem.queueTrackId, ...newQueueItem}});
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

// Reorder an item in the queue
routes.put("/:userId/queue/reorder", async (req, res) => {
  try {
    const { userId } = req.params;
    const { itemId, itemType, targetItemId } = req.body;

    if (!["album", "artist", "playlist", "track"].includes(itemType)) {
      return res.status(400).json({ error: "Invalid item type" });
    }

    const queueId = await queueService.getQueueId(userId);

    await queueService.updateQueueItemPosition(queueId, itemId, itemType as "album" | "artist" | "playlist" | "track", targetItemId);

    return res.status(200).json({ message: "Queue item position updated successfully" });
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
        include: {
          album: {
            include: {
              userPlays: {
                where: { userId },
              },
            },
          },
        },
      }),
      prisma.queueArtist.findMany({
        where: { queueId },
        include: {
          artist: {
            include: {
              userPlays: {
                where: { userId },
              },
            },
          },
        },
      }),
      prisma.queuePlaylist.findMany({
        where: { queueId },
        include: {
          playlist: {
            include: {
              userPlays: {
                where: { userId },
              },
            },
          },
        },
      }),
      prisma.queueTrack.findMany({
        where: { queueId },
        include: {
          track: {
            include: {
              userPlays: {
                where: { userId },
              },
            },
          },
        },
      }),
    ]);

    // Transform the results into a consistent format
    const transformedQueueAlbums = queueAlbums.map(queueAlbum => ({
      queueItemId: queueAlbum.queueAlbumId,
      position: queueAlbum.position,
      queuedAt: queueAlbum.createdAt,
      itemData: {
        ...queueAlbum.album,
        userPlays: undefined,
      },
      playedByUser: !!queueAlbum.album.userPlays.length,
    }));

    const transformedQueueArtists = queueArtists.map(queueArtist => ({
      queueItemId: queueArtist.queueArtistId,
      position: queueArtist.position,
      queuedAt: queueArtist.createdAt,
      itemData: {
        ...queueArtist.artist,
        userPlays: undefined,
      },
      playedByUser: !!queueArtist.artist.userPlays.length,
    }));

    const transformedQueuePlaylists = queuePlaylists.map(queuePlaylist => ({
      queueItemId: queuePlaylist.queuePlaylistId,
      position: queuePlaylist.position,
      queuedAt: queuePlaylist.createdAt,
      itemData: {
        ...queuePlaylist.playlist,
        userPlays: undefined,
      },
      playedByUser: !!queuePlaylist.playlist.userPlays.length,
    }));

    const transformedQueueTracks = queueTracks.map(queueTrack => ({
      queueItemId: queueTrack.queueTrackId,
      position: queueTrack.position,
      queuedAt: queueTrack.createdAt,
      itemData: {
        ...queueTrack.track,
        userPlays: undefined,
      },
      playedByUser: !!queueTrack.track.userPlays.length,
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