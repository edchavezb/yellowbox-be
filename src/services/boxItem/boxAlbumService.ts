import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const boxAlbumService = {
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
      const currentBoxAlbum = await prisma.boxAlbum.findUnique({
          where: { boxAlbumId },
      });
  
      if (!currentBoxAlbum) {
          throw new Error("Box album not found");
      }
  
      const currentPosition = currentBoxAlbum.position;
  
      if (newPosition < currentPosition) {
          // Moving to a lower position
          await prisma.boxAlbum.updateMany({
              where: {
                  boxId: currentBoxAlbum.boxId,
                  boxAlbumId: { not: boxAlbumId },
                  position: { gte: newPosition, lt: currentPosition },
              },
              data: { position: { increment: 1 } },
          });
      } else if (newPosition > currentPosition) {
          // Moving to a higher position
          await prisma.boxAlbum.updateMany({
              where: {
                  boxId: currentBoxAlbum.boxId,
                  boxAlbumId: { not: boxAlbumId },
                  position: { gt: currentPosition, lte: newPosition },
              },
              data: { position: { decrement: 1 } },
          });
      }
  
      await prisma.boxAlbum.update({
          where: { boxAlbumId },
          data: { position: newPosition },
      });
  },
  async updateSubsectionAlbumPosition(subsectionId: string, boxAlbumId: string, newPosition: number) {
      const currentSubsectionAlbum = await prisma.boxSubsectionAlbum.findUnique({
          where: { boxAlbumId_subsectionId: { subsectionId, boxAlbumId } },
      });
  
      if (!currentSubsectionAlbum) {
          throw new Error("Subsection album not found");
      }
  
      const currentPosition = currentSubsectionAlbum.position;
  
      if (newPosition < currentPosition) {
          // Moving to a lower position
          await prisma.boxSubsectionAlbum.updateMany({
              where: {
                  subsectionId,
                  boxAlbumId: { not: boxAlbumId },
                  position: { gte: newPosition, lt: currentPosition },
              },
              data: { position: { increment: 1 } },
          });
      } else if (newPosition > currentPosition) {
          // Moving to a higher position
          await prisma.boxSubsectionAlbum.updateMany({
              where: {
                  subsectionId,
                  boxAlbumId: { not: boxAlbumId },
                  position: { gt: currentPosition, lte: newPosition },
              },
              data: { position: { decrement: 1 } },
          });
      }
  
      await prisma.boxSubsectionAlbum.update({
          where: { boxAlbumId_subsectionId: { subsectionId, boxAlbumId } },
          data: { position: newPosition },
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

export default boxAlbumService;
