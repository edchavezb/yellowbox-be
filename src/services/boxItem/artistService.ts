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
        spotifyId
      },
      data: {
        images: images
      },
    });
  },
  async deleteArtist(spotifyId: string) {
    await prisma.artist.delete({
      where: { spotifyId },
    });
  },
  async createBoxArtist(boxId: string, spotifyId: string, position: number) {
    const newBoxArtist = await prisma.boxArtist.create({
      data: {
        position,
        note: "",
        box: { connect: { boxId } },
        artist: { connect: { spotifyId } },
      },
    });
  
    return newBoxArtist;
  },
  async deleteBoxArtist(boxArtistId: string) {
    await prisma.boxArtist.deleteMany({
      where: { boxArtistId },
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
  async getArtistBoxCount(spotifyId: string) {
    return await prisma.boxArtist.count({
      where: { artistId: spotifyId },
    });
  },
  async checkArtistInBox(boxId: string, spotifyId: string) {
    const boxArtist = await prisma.boxArtist.findFirst({
      where: {
        boxId,
        artist: {
          spotifyId: spotifyId,
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
  async getArtistInBox(boxArtistId: string) {
    const boxArtist = await prisma.boxArtist.findFirst({
      where: { boxArtistId }
    });
  
    return boxArtist;
  },
  async getArtistInSubsection(subsectionId: string, boxArtistId: string) {
    const subsectionArtist = await prisma.boxSubsectionArtist.findUnique({
      where: { boxArtistId_subsectionId: { subsectionId, boxArtistId } },
    });
  
    return subsectionArtist;
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
  async updateSubsequentBoxArtistPositions(boxId: string, boxArtistId: string, position: number) {
    await prisma.boxArtist.updateMany({
      where: {
        boxId,
        boxArtistId: { not: boxArtistId },
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
  async updateBoxArtistNote(boxArtistId: string, note: string) {
    const updatedBoxArtist = await prisma.boxArtist.update({
      where: { boxArtistId },
      data: { note },
    });
  
    return updatedBoxArtist.note;
  },
  async updateBoxSubsectionArtistNote(boxArtistId: string, subsectionId: string, note: string) {
    const updatedSubsectionArtist = await prisma.boxSubsectionArtist.update({
      where: { boxArtistId_subsectionId: { boxArtistId, subsectionId } },
      data: { note },
    });
  
    return updatedSubsectionArtist.note;
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