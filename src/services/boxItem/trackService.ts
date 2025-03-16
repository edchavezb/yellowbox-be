import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const trackService = {
  async createTrack(trackData: any) {
    const { spotifyId, name, artists, albumName, albumId, albumReleaseDate, albumImages, duration, explicit, type } = trackData;
    const newTrack = await prisma.track.upsert({
      where: { spotifyId },
      update: {},
      create: {
        spotifyId,
        name,
        artists,
        albumName,
        albumId,
        albumReleaseDate,
        albumImages,
        duration,
        explicit: Boolean(explicit),
        type
      }
    });

    return newTrack;
  },
  async updateTrackImages(spotifyId: string, images: any) {
    return await prisma.track.update({
      where: {
        spotifyId
      },
      data: {
        albumImages: images
      },
    });
  },
  async deleteTrack(spotifyId: string) {
    await prisma.track.delete({
      where: { spotifyId },
    });
  },
  async createBoxTrack(boxId: string, spotifyId: string, position: number) {
    const newBoxTrack = await prisma.boxTrack.create({
      data: {
        position,
        note: "",
        box: { connect: { boxId } },
        track: { connect: { spotifyId } },
      },
    });
  
    return newBoxTrack;
  },
  async deleteBoxTrack(boxTrackId: string) {
    await prisma.boxTrack.deleteMany({
      where: { boxTrackId },
    });
  },
  async createBoxSubsectionTrack(subsectionId: string, boxTrackId: string, position: number) {
    await prisma.boxSubsectionTrack.create({
      data: {
        position,
        note: "",
        boxTrack: { connect: { boxTrackId } },
        subsection: { connect: { subsectionId } },
      },
    });
  },
  async deleteBoxSubsectionTrack(subsectionId: string, boxTrackId: string) {
    await prisma.boxSubsectionTrack.delete({
      where: { boxTrackId_subsectionId: { subsectionId, boxTrackId } },
    });
  },
  async getTrackBoxCount(spotifyId: string) {
    return await prisma.boxTrack.count({
      where: { trackId: spotifyId },
    });
  },
  async checkTrackInBox(boxId: string, spotifyId: string) {
    const boxTrack = await prisma.boxTrack.findFirst({
      where: {
        boxId,
        track: {
          spotifyId: spotifyId,
        },
      },
    });
  
    return !!boxTrack;
  },
  async checkTrackInSubsection(subsectionId: string, boxTrackId: string) {
    const subsectionTrack = await prisma.boxSubsectionTrack.findUnique({
      where: { boxTrackId_subsectionId: { subsectionId, boxTrackId } },
    });
  
    return !!subsectionTrack;
  },
  async getTrackInBox(boxTrackId: string) {
    const boxTrack = await prisma.boxTrack.findFirst({
      where: { boxTrackId }
    });
  
    return boxTrack;
  },
  async getTrackInSubsection(subsectionId: string, boxTrackId: string) {
    const subsectionTrack = await prisma.boxSubsectionTrack.findUnique({
      where: { boxTrackId_subsectionId: { subsectionId, boxTrackId } },
    });
  
    return subsectionTrack;
  },
  async getMaxBoxTrackPosition(boxId: string) {
    const result = await prisma.boxTrack.aggregate({
      where: {
        boxId,
      },
      _max: {
        position: true,
      },
    });
  
    return result._max.position;
  },
  async getMaxSubsectionTrackPosition(subsectionId: string) {
    const result = await prisma.boxSubsectionTrack.aggregate({
      where: {
        subsectionId,
      },
      _max: {
        position: true,
      },
    });
  
    return result._max.position;
  },
   async updateBoxTrackPosition(boxTrackId: string, newPosition: number) {
      const currentBoxTrack = await prisma.boxTrack.findUnique({
          where: { boxTrackId },
      });
  
      if (!currentBoxTrack) {
          throw new Error("Box track not found");
      }
  
      const currentPosition = currentBoxTrack.position;
  
      if (newPosition < currentPosition) {
          // Moving to a lower position
          await prisma.boxTrack.updateMany({
              where: {
                  boxId: currentBoxTrack.boxId,
                  boxTrackId: { not: boxTrackId },
                  position: { gte: newPosition, lt: currentPosition },
              },
              data: { position: { increment: 1 } },
          });
      } else if (newPosition > currentPosition) {
          // Moving to a higher position
          await prisma.boxTrack.updateMany({
              where: {
                  boxId: currentBoxTrack.boxId,
                  boxTrackId: { not: boxTrackId },
                  position: { gt: currentPosition, lte: newPosition },
              },
              data: { position: { decrement: 1 } },
          });
      }
  
      await prisma.boxTrack.update({
          where: { boxTrackId },
          data: { position: newPosition },
      });
  },
  async updateSubsectionTrackPosition(subsectionId: string, boxTrackId: string, newPosition: number) {
      const currentSubsectionTrack = await prisma.boxSubsectionTrack.findUnique({
          where: { boxTrackId_subsectionId: { subsectionId, boxTrackId } },
      });
  
      if (!currentSubsectionTrack) {
          throw new Error("Subsection track not found");
      }
  
      const currentPosition = currentSubsectionTrack.position;
  
      if (newPosition < currentPosition) {
          // Moving to a lower position
          await prisma.boxSubsectionTrack.updateMany({
              where: {
                  subsectionId,
                  boxTrackId: { not: boxTrackId },
                  position: { gte: newPosition, lt: currentPosition },
              },
              data: { position: { increment: 1 } },
          });
      } else if (newPosition > currentPosition) {
          // Moving to a higher position
          await prisma.boxSubsectionTrack.updateMany({
              where: {
                  subsectionId,
                  boxTrackId: { not: boxTrackId },
                  position: { gt: currentPosition, lte: newPosition },
              },
              data: { position: { decrement: 1 } },
          });
      }
  
      await prisma.boxSubsectionTrack.update({
          where: { boxTrackId_subsectionId: { subsectionId, boxTrackId } },
          data: { position: newPosition },
      });
  },
  async updateBoxTrackNote(boxTrackId: string, note: string) {
    const updatedBoxTrack = await prisma.boxTrack.update({
      where: { boxTrackId },
      data: { note },
    });
  
    return updatedBoxTrack.note;
  },
  async updateBoxSubsectionTrackNote(boxTrackId: string, subsectionId: string, note: string) {
    const updatedSubsectionTrack = await prisma.boxSubsectionTrack.update({
      where: { boxTrackId_subsectionId: { boxTrackId, subsectionId } },
      data: { note },
    });
  
    return updatedSubsectionTrack.note;
  },
  async getBoxWithTracks(boxId: string) {
    return await prisma.box.findUnique({
      where: { boxId },
      include: {
        tracks: {
          include: {
            track: true,
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

export default trackService;
