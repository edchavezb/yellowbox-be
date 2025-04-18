import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const queueService = {
  async getQueueId(userId: string) {
    const userQueue = await prisma.userQueue.findUnique({
      where: { userId },
      select: { queueId: true },
    });
    if (!userQueue) {
      throw new Error("Queue not found for user");
    }
    return userQueue.queueId;
  },

  // QueueAlbum methods
  async createQueueAlbum(queueId: string, spotifyId: string, position: number) {
    const newQueueAlbum = await prisma.queueAlbum.create({
      data: {
        position,
        queue: { connect: { queueId } },
        album: { connect: { spotifyId } },
      },
    });
    return newQueueAlbum;
  },

  async deleteQueueAlbum(queueId: string, spotifyId: string) {
    await prisma.queueAlbum.deleteMany({
      where: { queueId, albumId: spotifyId },
    });
  },

  async getMaxQueueAlbumPosition(queueId: string) {
    const result = await prisma.queueAlbum.aggregate({
      where: { queueId },
      _max: { position: true },
    });
    return result._max.position;
  },

  async isAlbumInQueue(queueId: string, spotifyId: string) {
    const albumInQueue = await prisma.queueAlbum.findFirst({
      where: { queueId, albumId: spotifyId },
    });
    return !!albumInQueue;
  },

  // QueueArtist methods
  async createQueueArtist(queueId: string, spotifyId: string, position: number) {
    const newQueueArtist = await prisma.queueArtist.create({
      data: {
        position,
        queue: { connect: { queueId } },
        artist: { connect: { spotifyId } },
      },
    });
    return newQueueArtist;
  },

  async deleteQueueArtist(queueId: string, spotifyId: string) {
    await prisma.queueArtist.deleteMany({
      where: { queueId, artistId: spotifyId },
    });
  },

  async getMaxQueueArtistPosition(queueId: string) {
    const result = await prisma.queueArtist.aggregate({
      where: { queueId },
      _max: { position: true },
    });
    return result._max.position;
  },

  async isArtistInQueue(queueId: string, spotifyId: string) {
    const artistInQueue = await prisma.queueArtist.findFirst({
      where: { queueId, artistId: spotifyId },
    });
    return !!artistInQueue;
  },

  // QueuePlaylist methods
  async createQueuePlaylist(queueId: string, spotifyId: string, position: number) {
    const newQueuePlaylist = await prisma.queuePlaylist.create({
      data: {
        position,
        queue: { connect: { queueId } },
        playlist: { connect: { spotifyId } },
      },
    });
    return newQueuePlaylist;
  },

  async deleteQueuePlaylist(queueId: string, spotifyId: string) {
    await prisma.queuePlaylist.deleteMany({
      where: { queueId, playlistId: spotifyId },
    });
  },

  async getMaxQueuePlaylistPosition(queueId: string) {
    const result = await prisma.queuePlaylist.aggregate({
      where: { queueId },
      _max: { position: true },
    });
    return result._max.position;
  },

  async isPlaylistInQueue(queueId: string, spotifyId: string) {
    const playlistInQueue = await prisma.queuePlaylist.findFirst({
      where: { queueId, playlistId: spotifyId },
    });
    return !!playlistInQueue;
  },

  // QueueTrack methods
  async createQueueTrack(queueId: string, spotifyId: string, position: number) {
    const newQueueTrack = await prisma.queueTrack.create({
      data: {
        position,
        queue: { connect: { queueId } },
        track: { connect: { spotifyId } },
      },
    });
    return newQueueTrack;
  },

  async deleteQueueTrack(queueId: string, spotifyId: string) {
    await prisma.queueTrack.deleteMany({
      where: { queueId, trackId: spotifyId },
    });
  },

  async getMaxQueueTrackPosition(queueId: string) {
    const result = await prisma.queueTrack.aggregate({
      where: { queueId },
      _max: { position: true },
    });
    return result._max.position;
  },

  async isTrackInQueue(queueId: string, spotifyId: string) {
    const trackInQueue = await prisma.queueTrack.findFirst({
      where: { queueId, trackId: spotifyId },
    });
    return !!trackInQueue;
  },

  // Method to get the count of occurrences of an album across all queues
  async getAlbumQueueCount(spotifyId: string) {
    return await prisma.queueAlbum.count({
      where: { albumId: spotifyId },
    });
  },

  // Method to get the count of occurrences of an artist across all queues
  async getArtistQueueCount(spotifyId: string) {
    return await prisma.queueArtist.count({
      where: { artistId: spotifyId },
    });
  },

  // Method to get the count of occurrences of a playlist across all queues
  async getPlaylistQueueCount(spotifyId: string) {
    return await prisma.queuePlaylist.count({
      where: { playlistId: spotifyId },
    });
  },

  // Method to get the count of occurrences of a track across all queues
  async getTrackQueueCount(spotifyId: string) {
    return await prisma.queueTrack.count({
      where: { trackId: spotifyId },
    });
  },

  async updateQueueItemPosition(queueId: string, itemId: string, itemType: "album" | "artist" | "playlist" | "track", targetItemId: string) {
    // Find the target item's position across all tables
    const [targetAlbum, targetArtist, targetPlaylist, targetTrack] = await Promise.all([
      prisma.queueAlbum.findFirst({ where: { queueId, albumId: targetItemId } }),
      prisma.queueArtist.findFirst({ where: { queueId, artistId: targetItemId } }),
      prisma.queuePlaylist.findFirst({ where: { queueId, playlistId: targetItemId } }),
      prisma.queueTrack.findFirst({ where: { queueId, trackId: targetItemId } }),
    ]);
  
    // Determine the target position
    const targetItem = targetAlbum || targetArtist || targetPlaylist || targetTrack;
    if (!targetItem) {
      throw new Error(`Target item not found in the queue`);
    }
    const newPosition = targetItem.position;
  
    // Find the current item in the queue
    let currentItem;
    if (itemType === "album") {
      currentItem = await prisma.queueAlbum.findFirst({
        where: { queueId, albumId: itemId },
      });
    } else if (itemType === "artist") {
      currentItem = await prisma.queueArtist.findFirst({
        where: { queueId, artistId: itemId },
      });
    } else if (itemType === "playlist") {
      currentItem = await prisma.queuePlaylist.findFirst({
        where: { queueId, playlistId: itemId },
      });
    } else if (itemType === "track") {
      currentItem = await prisma.queueTrack.findFirst({
        where: { queueId, trackId: itemId },
      });
    }
  
    if (!currentItem) {
      throw new Error(`${itemType} not found in the queue`);
    }
  
    const currentPosition = currentItem.position;
  
    if (newPosition === currentPosition) {
      return;
    }
  
    // Adjust positions for all items in the queue
    if (newPosition < currentPosition) {
      // Moving to a lower position
      await Promise.all([
        prisma.queueAlbum.updateMany({
          where: {
            queueId,
            position: { gte: newPosition, lt: currentPosition },
          },
          data: { position: { increment: 1 } },
        }),
        prisma.queueArtist.updateMany({
          where: {
            queueId,
            position: { gte: newPosition, lt: currentPosition },
          },
          data: { position: { increment: 1 } },
        }),
        prisma.queuePlaylist.updateMany({
          where: {
            queueId,
            position: { gte: newPosition, lt: currentPosition },
          },
          data: { position: { increment: 1 } },
        }),
        prisma.queueTrack.updateMany({
          where: {
            queueId,
            position: { gte: newPosition, lt: currentPosition },
          },
          data: { position: { increment: 1 } },
        }),
      ]);
    } else if (newPosition > currentPosition) {
      // Moving to a higher position
      await Promise.all([
        prisma.queueAlbum.updateMany({
          where: {
            queueId,
            position: { gt: currentPosition, lte: newPosition },
          },
          data: { position: { decrement: 1 } },
        }),
        prisma.queueArtist.updateMany({
          where: {
            queueId,
            position: { gt: currentPosition, lte: newPosition },
          },
          data: { position: { decrement: 1 } },
        }),
        prisma.queuePlaylist.updateMany({
          where: {
            queueId,
            position: { gt: currentPosition, lte: newPosition },
          },
          data: { position: { decrement: 1 } },
        }),
        prisma.queueTrack.updateMany({
          where: {
            queueId,
            position: { gt: currentPosition, lte: newPosition },
          },
          data: { position: { decrement: 1 } },
        }),
      ]);
    }
  
    // Update the item's position
    if (itemType === "album") {
      await prisma.queueAlbum.update({
        where: { albumId_queueId: { albumId: itemId, queueId } },
        data: { position: newPosition },
      });
    } else if (itemType === "artist") {
      await prisma.queueArtist.update({
        where: { artistId_queueId: { artistId: itemId, queueId } },
        data: { position: newPosition },
      });
    } else if (itemType === "playlist") {
      await prisma.queuePlaylist.update({
        where: { playlistId_queueId: { playlistId: itemId, queueId } },
        data: { position: newPosition },
      });
    } else if (itemType === "track") {
      await prisma.queueTrack.update({
        where: { trackId_queueId: { trackId: itemId, queueId } },
        data: { position: newPosition },
      });
    }
  },

  // Get total count of items in a user's queue
  async getTotalQueueItemCount(queueId: string) {
    const [albumCount, artistCount, playlistCount, trackCount] = await Promise.all([
      prisma.queueAlbum.count({ where: { queueId } }),
      prisma.queueArtist.count({ where: { queueId } }),
      prisma.queuePlaylist.count({ where: { queueId } }),
      prisma.queueTrack.count({ where: { queueId } }),
    ]);

    return albumCount + artistCount + playlistCount + trackCount;
  },
};

export default queueService;