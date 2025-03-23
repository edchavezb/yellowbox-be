import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const boxPlaylistService = {
  async createBoxPlaylist(boxId: string, spotifyId: string, position: number) {
    const newBoxPlaylist = await prisma.boxPlaylist.create({
      data: {
        position,
        note: "",
        box: { connect: { boxId } },
        playlist: { connect: { spotifyId } },
      },
    });

    return newBoxPlaylist;
  },
  async deleteBoxPlaylist(boxPlaylistId: string) {
    await prisma.boxPlaylist.deleteMany({
      where: { boxPlaylistId },
    });
  },
  async createBoxSubsectionPlaylist(subsectionId: string, boxPlaylistId: string, position: number) {
    await prisma.boxSubsectionPlaylist.create({
      data: {
        position,
        note: "",
        boxPlaylist: { connect: { boxPlaylistId } },
        subsection: { connect: { subsectionId } },
      },
    });
  },
  async deleteBoxSubsectionPlaylist(subsectionId: string, boxPlaylistId: string) {
    await prisma.boxSubsectionPlaylist.delete({
      where: { boxPlaylistId_subsectionId: { subsectionId, boxPlaylistId } },
    });
  },
  async getPlaylistBoxCount(spotifyId: string) {
    return await prisma.boxPlaylist.count({
      where: { playlistId: spotifyId },
    });
  },
  async checkPlaylistInBox(boxId: string, spotifyId: string) {
    const boxPlaylist = await prisma.boxPlaylist.findFirst({
      where: {
        boxId,
        playlist: {
          spotifyId: spotifyId,
        },
      },
    });
  
    return !!boxPlaylist;
  },
  async checkPlaylistInSubsection(subsectionId: string, boxPlaylistId: string) {
    const subsectionPlaylist = await prisma.boxSubsectionPlaylist.findUnique({
      where: { boxPlaylistId_subsectionId: { subsectionId, boxPlaylistId } },
    });
  
    return !!subsectionPlaylist;
  },
  async getPlaylistInBox(boxPlaylistId: string) {
    const boxPlaylist = await prisma.boxPlaylist.findFirst({
      where: { boxPlaylistId }
    });
  
    return boxPlaylist;
  },
  async getPlaylistInSubsection(subsectionId: string, boxPlaylistId: string) {
    const subsectionPlaylist = await prisma.boxSubsectionPlaylist.findUnique({
      where: { boxPlaylistId_subsectionId: { subsectionId, boxPlaylistId } },
    });
  
    return subsectionPlaylist;
  },
  async getMaxBoxPlaylistPosition(boxId: string) {
    const result = await prisma.boxPlaylist.aggregate({
      where: {
        boxId,
      },
      _max: {
        position: true,
      },
    });

    return result._max.position;
  },
  async getMaxSubsectionPlaylistPosition(subsectionId: string) {
    const result = await prisma.boxSubsectionPlaylist.aggregate({
      where: {
        subsectionId,
      },
      _max: {
        position: true,
      },
    });

    return result._max.position;
  },
   async updateBoxPlaylistPosition(boxPlaylistId: string, newPosition: number) {
      const currentBoxPlaylist = await prisma.boxPlaylist.findUnique({
          where: { boxPlaylistId },
      });
  
      if (!currentBoxPlaylist) {
          throw new Error("Box playlist not found");
      }
  
      const currentPosition = currentBoxPlaylist.position;
  
      if (newPosition < currentPosition) {
          // Moving to a lower position
          await prisma.boxPlaylist.updateMany({
              where: {
                  boxId: currentBoxPlaylist.boxId,
                  boxPlaylistId: { not: boxPlaylistId },
                  position: { gte: newPosition, lt: currentPosition },
              },
              data: { position: { increment: 1 } },
          });
      } else if (newPosition > currentPosition) {
          // Moving to a higher position
          await prisma.boxPlaylist.updateMany({
              where: {
                  boxId: currentBoxPlaylist.boxId,
                  boxPlaylistId: { not: boxPlaylistId },
                  position: { gt: currentPosition, lte: newPosition },
              },
              data: { position: { decrement: 1 } },
          });
      }
  
      await prisma.boxPlaylist.update({
          where: { boxPlaylistId },
          data: { position: newPosition },
      });
  },
  async updateSubsectionPlaylistPosition(subsectionId: string, boxPlaylistId: string, newPosition: number) {
      const currentSubsectionPlaylist = await prisma.boxSubsectionPlaylist.findUnique({
          where: { boxPlaylistId_subsectionId: { subsectionId, boxPlaylistId } },
      });
  
      if (!currentSubsectionPlaylist) {
          throw new Error("Subsection playlist not found");
      }
  
      const currentPosition = currentSubsectionPlaylist.position;
  
      if (newPosition < currentPosition) {
          // Moving to a lower position
          await prisma.boxSubsectionPlaylist.updateMany({
              where: {
                  subsectionId,
                  boxPlaylistId: { not: boxPlaylistId },
                  position: { gte: newPosition, lt: currentPosition },
              },
              data: { position: { increment: 1 } },
          });
      } else if (newPosition > currentPosition) {
          // Moving to a higher position
          await prisma.boxSubsectionPlaylist.updateMany({
              where: {
                  subsectionId,
                  boxPlaylistId: { not: boxPlaylistId },
                  position: { gt: currentPosition, lte: newPosition },
              },
              data: { position: { decrement: 1 } },
          });
      }
  
      await prisma.boxSubsectionPlaylist.update({
          where: { boxPlaylistId_subsectionId: { subsectionId, boxPlaylistId } },
          data: { position: newPosition },
      });
  },
  async updateBoxPlaylistNote(boxPlaylistId: string, note: string) {
    const updatedBoxPlaylist = await prisma.boxPlaylist.update({
      where: { boxPlaylistId },
      data: { note },
    });
  
    return updatedBoxPlaylist.note;
  },
  async updateBoxSubsectionPlaylistNote(boxPlaylistId: string, subsectionId: string, note: string) {
    const updatedSubsectionPlaylist = await prisma.boxSubsectionPlaylist.update({
      where: { boxPlaylistId_subsectionId: { boxPlaylistId, subsectionId } },
      data: { note },
    });
  
    return updatedSubsectionPlaylist.note;
  },    
  async getBoxWithPlaylists(boxId: string) {
    return await prisma.box.findUnique({
      where: { boxId },
      include: {
        playlists: {
          include: {
            playlist: true,
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

export default boxPlaylistService;
