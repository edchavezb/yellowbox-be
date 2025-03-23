import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const artistService = {
  async createArtist(artistData: any) {
    const { spotifyId, name, images, genres, type } = artistData;
    const newArtist = await prisma.artist.upsert({
      where: { spotifyId },
      update: {},
      create: { spotifyId, name, images, genres, type },
    });

    return newArtist;
  },
  async updateArtistImages(spotifyId: string, images: any) {
    return await prisma.artist.update({
      where: {
        spotifyId,
      },
      data: {
        images: images,
      },
    });
  },
  async markArtistAsPlayed(userId: string, artistId: string) {
    return await prisma.playedArtist.upsert({
      where: { userId_artistId: { userId, artistId } },
      update: { lastPlayedAt: new Date() },
      create: { userId, artistId, lastPlayedAt: new Date() },
    });
  },
  async removeArtistPlay(userId: string, artistId: string) {
    return await prisma.playedArtist.deleteMany({
      where: { userId, artistId },
    });
  },
  async checkArtisPlayedByUser(userId: string, artistId: string) {
    const playRecord = await prisma.playedArtist.findFirst({
      where: {
        userId,
        artistId,
      },
    });

    return !!playRecord;
  },
  async deleteArtist(spotifyId: string) {
    await prisma.artist.delete({
      where: { spotifyId },
    });
  },
};

export default artistService;