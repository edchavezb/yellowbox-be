import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const artistService = {
  async createArtist(artistData: any) {
    const { spotifyId, name, images, popularity, genres, type } = artistData;
    const newArtist = await prisma.artist.upsert({
      where: { spotifyId },
      update: {},
      create: { spotifyId, name, images, popularity, genres, type },
    });

    return newArtist;
  },
  async deleteArtist(artistItemId: string) {
    await prisma.artist.delete({
      where: { itemId: artistItemId },
    });
  },
  async updateArtistImages(artistItemId: string, images: any) {
    return await prisma.artist.update({
      where: {
        itemId: artistItemId,
      },
      data: {
        images: images
      },
    });
  },
  async createBoxArtist(boxId: string, itemId: string, position: number) {
    const newBoxArtist = await prisma.boxArtist.create({
      data: {
        position,
        note: "",
        box: { connect: { boxId } },
        artist: { connect: { itemId } },
      },
    });

    return newBoxArtist;
  },
  async deleteBoxArtist(boxId: string, artistId: string) {
    await prisma.boxArtist.deleteMany({
      where: { boxId, artistId },
    });
  },
  async createBoxSubsectionArtist(subsectionId: string, boxArtistId: string, position: number) {
    await prisma.boxSubsectionArtist.create({
      data: {
        position,
        note: "",
        boxArtist: { connect: { boxArtistId } },
        subsection: { connect: { subsectionId } },
      },
    });
  },
  async deleteBoxSubsectionArtist(subsectionId: string, boxArtistId: string) {
    await prisma.boxSubsectionArtist.delete({
      where: { boxArtistId_subsectionId: { subsectionId, boxArtistId } },
    });
  },
  async getArtistBoxCount(artistSpotifyId: string) {
    return await prisma.boxArtist.count({
      where: { artistId: artistSpotifyId },
    });
  },
  async checkArtistInBox(boxId: string, artistSpotifyId: string) {
    const boxArtist = await prisma.boxArtist.findFirst({
      where: {
        boxId,
        artist: {
          spotifyId: artistSpotifyId,
        },
      },
    });

    return !!boxArtist;
  },
  async checkArtistInSubsection(subsectionId: string, boxArtistId: string) {
    const subsectionArtist = await prisma.boxSubsectionArtist.findUnique({
      where: { boxArtistId_subsectionId: { subsectionId, boxArtistId } },
    });

    return !!subsectionArtist;
  },
  async getArtistInBox(boxId: string, artistId: string) {
    const boxArtist = await prisma.boxArtist.findFirst({
      where: { boxId, artistId },
      select: { position: true, boxArtistId: true },
    });

    return boxArtist;
  },
  async getMaxBoxArtistPosition(boxId: string) {
    const result = await prisma.boxArtist.aggregate({
      where: {
        boxId,
      },
      _max: {
        position: true,
      },
    });

    return result._max.position;
  },
  async getMaxSubsectionArtistPosition(subsectionId: string) {
    const result = await prisma.boxSubsectionArtist.aggregate({
      where: {
        subsectionId,
      },
      _max: {
        position: true,
      },
    });

    return result._max.position;
  },
  async updateBoxArtistPosition(boxArtistId: string, newPosition: number) {
    await prisma.boxArtist.update({
      where: { boxArtistId },
      data: { position: newPosition },
    });
  },
  async updateSubsequentBoxArtistPositions(boxId: string, artistId: string, position: number) {
    await prisma.boxArtist.updateMany({
      where: {
        boxId,
        artistId: { not: artistId },
        position: { gte: position },
      },
      data: { position: { increment: 1 } },
    });
  },
  async updateSubsectionArtistPosition(subsectionId: string, boxArtistId: string, newPosition: number) {
    await prisma.boxSubsectionArtist.update({
      where: { boxArtistId_subsectionId: { subsectionId, boxArtistId } },
      data: { position: newPosition },
    });
  },
  async updateSubsequentSubsectionArtistPositions(subsectionId: string, boxArtistId: string, position: number) {
    await prisma.boxSubsectionArtist.updateMany({
      where: {
        subsectionId,
        boxArtistId: { not: boxArtistId },
        position: { gte: position },
      },
      data: { position: { increment: 1 } },
    });
  },
  async getBoxWithArtists(boxId: string) {
    return await prisma.box.findUnique({
      where: { boxId },
      include: {
        artists: {
          include: {
            artist: true,
            subsections: {
              select: {
                subsectionId: true,
                note: true,
              },
            },
          },
        },
      },
    });
  },
};

export default artistService;