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
  async deleteAlbum(spotifyId: string) {
    await prisma.album.delete({
      where: { spotifyId },
    });
  },
  async createBoxAlbum(boxId: string, spotifyId: string, position: number) {
    const newBoxAlbum = await prisma.boxAlbum.create({
      data: {
        position,
        note: "",
        box: { connect: { boxId } },
        album: { connect: { spotifyId } },
      },
    });
  
    return newBoxAlbum;
  },
  async deleteBoxAlbum(boxAlbumId: string) {
    await prisma.boxAlbum.deleteMany({
      where: { boxAlbumId },
    });
  },
  async createBoxSubsectionAlbum(subsectionId: string, boxAlbumId: string, position: number) {
    await prisma.boxSubsectionAlbum.create({
      data: {
        position,
        note: "",
        boxAlbum: { connect: { boxAlbumId } },
        subsection: { connect: { subsectionId } },
      },
    });
  },
  async deleteBoxSubsectionAlbum(subsectionId: string, boxAlbumId: string) {
    await prisma.boxSubsectionAlbum.delete({
      where: { boxAlbumId_subsectionId: { subsectionId, boxAlbumId } },
    });
  },
  async getAlbumBoxCount(spotifyId: string) {
    return await prisma.boxAlbum.count({
      where: { albumId: spotifyId },
    });
  },
  async checkAlbumInBox(boxId: string, spotifyId: string) {
    const boxAlbum = await prisma.boxAlbum.findFirst({
      where: {
        boxId,
        album: {
          spotifyId: spotifyId,
        },
      },
    });
  
    return !!boxAlbum;
  },
  async checkAlbumInSubsection(subsectionId: string, boxAlbumId: string) {
    const subsectionAlbum = await prisma.boxSubsectionAlbum.findUnique({
      where: { boxAlbumId_subsectionId: { subsectionId, boxAlbumId } },
    });
  
    return !!subsectionAlbum;
  },
  async getAlbumInBox(boxAlbumId: string) {
    const boxAlbum = await prisma.boxAlbum.findFirst({
      where: { boxAlbumId }
    });
  
    return boxAlbum;
  },
  async getAlbumInSubsection(subsectionId: string, boxAlbumId: string) {
    const subsectionAlbum = await prisma.boxSubsectionAlbum.findUnique({
      where: { boxAlbumId_subsectionId: { subsectionId, boxAlbumId } },
    });
  
    return subsectionAlbum;
  },
  async getMaxBoxAlbumPosition(boxId: string) {
    const result = await prisma.boxAlbum.aggregate({
      where: {
        boxId,
      },
      _max: {
        position: true,
      },
    });
  
    return result._max.position;
  },
  async getMaxSubsectionAlbumPosition(subsectionId: string) {
    const result = await prisma.boxSubsectionAlbum.aggregate({
      where: {
        subsectionId,
      },
      _max: {
        position: true,
      },
    });
  
    return result._max.position;
  },
  async updateBoxAlbumPosition(boxAlbumId: string, newPosition: number) {
    await prisma.boxAlbum.update({
      where: { boxAlbumId },
      data: { position: newPosition },
    });
  },
  async updateSubsequentBoxAlbumPositions(boxId: string, boxAlbumId: string, position: number) {
    await prisma.boxAlbum.updateMany({
      where: {
        boxId,
        boxAlbumId: { not: boxAlbumId },
        position: { gte: position },
      },
      data: { position: { increment: 1 } },
    });
  },
  async updateSubsectionAlbumPosition(subsectionId: string, boxAlbumId: string, newPosition: number) {
    await prisma.boxSubsectionAlbum.update({
      where: { boxAlbumId_subsectionId: { subsectionId, boxAlbumId } },
      data: { position: newPosition },
    });
  },
  async updateSubsequentSubsectionAlbumPositions(subsectionId: string, boxAlbumId: string, position: number) {
    await prisma.boxSubsectionAlbum.updateMany({
      where: {
        subsectionId,
        boxAlbumId: { not: boxAlbumId },
        position: { gte: position },
      },
      data: { position: { increment: 1 } },
    });
  },
  async updateBoxAlbumNote(boxAlbumId: string, note: string) {
    const updatedBoxAlbum = await prisma.boxAlbum.update({
      where: { boxAlbumId },
      data: { note },
    });
  
    return updatedBoxAlbum.note;
  },
  async updateBoxSubsectionAlbumNote(boxAlbumId: string, subsectionId: string, note: string) {
    const updatedSubsectionAlbum = await prisma.boxSubsectionAlbum.update({
      where: { boxAlbumId_subsectionId: { boxAlbumId, subsectionId } },
      data: { note },
    });
  
    return updatedSubsectionAlbum.note;
  },
  async getBoxWithAlbums(boxId: string) {
    return await prisma.box.findUnique({
      where: { boxId },
      include: {
        albums: {
          include: {
            album: true,
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

export default albumService;
