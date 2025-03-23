import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const albumService = {
  async createAlbum(albumData: any) {
    const {
      spotifyId,
      name,
      images,
      type,
      albumType,
      artists,
      releaseDate,
      totalTracks
    } = albumData;
    const newAlbum = await prisma.album.upsert({
      where: { spotifyId },
      update: {},
      create: {
        spotifyId,
        name,
        images,
        type,
        albumType,
        artists,
        releaseDate,
        totalTracks
      }
    });

    return newAlbum;
  },
  async updateAlbumImages(spotifyId: string, images: any) {
    return await prisma.album.update({
      where: {
        spotifyId
      },
      data: {
        images: images
      },
    });
  },
  async markAlbumAsPlayed(userId: string, albumId: string) {
    return await prisma.playedAlbum.upsert({
      where: { userId_albumId: { userId, albumId } },
      update: { lastPlayedAt: new Date() },
      create: { userId, albumId, lastPlayedAt: new Date() },
    });
  },
  async removeAlbumPlay(userId: string, albumId: string) {
    return await prisma.playedAlbum.deleteMany({
      where: { userId, albumId },
    });
  },
  async checkAlbumPlayedByUser(userId: string, albumId: string) {
    const playRecord = await prisma.playedAlbum.findFirst({
      where: {
        userId,
        albumId,
      },
    });
    return !!playRecord;
  },
  async deleteAlbum(spotifyId: string) {
    await prisma.album.delete({
      where: { spotifyId },
    });
  },
}

export default albumService;