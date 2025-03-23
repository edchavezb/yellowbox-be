import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const playlistService = {
  async createPlaylist(playlistData: any) {
    const {
      spotifyId,
      name,
      description,
      ownerDisplayName,
      ownerId,
      images,
      type,
      totalTracks,
    } = playlistData;
    const newPlaylist = await prisma.playlist.upsert({
      where: { spotifyId },
      update: {},
      create: {
        spotifyId,
        name,
        description,
        ownerDisplayName,
        ownerId,
        images,
        type,
        totalTracks,
      },
    });

    return newPlaylist;
  },
  async updatePlaylistImages(spotifyId: string, images: any) {
    return await prisma.playlist.update({
      where: {
        spotifyId,
      },
      data: {
        images: images,
      },
    });
  },
  async markPlaylistAsPlayed(userId: string, playlistId: string) {
    return await prisma.playedPlaylist.upsert({
      where: { userId_playlistId: { userId, playlistId } },
      update: { lastPlayedAt: new Date() },
      create: { userId, playlistId, lastPlayedAt: new Date() },
    });
  },
  async removePlaylistPlay(userId: string, playlistId: string) {
    return await prisma.playedPlaylist.deleteMany({
      where: { userId, playlistId },
    });
  },
  async checkPlaylistPlayedByUser(userId: string, playlistId: string) {
    const playRecord = await prisma.playedPlaylist.findFirst({
      where: {
        userId,
        playlistId,
      },
    });

    return !!playRecord;
  },
  async deletePlaylist(spotifyId: string) {
    await prisma.playlist.delete({
      where: { spotifyId },
    });
  },
};

export default playlistService;