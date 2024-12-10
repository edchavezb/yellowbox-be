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
        explicit,
        type
      }
    });

    return newTrack;
  },
  async updateTrackImages(trackItemId: string, images: any) {
    return await prisma.track.update({
      where: {
        itemId: trackItemId,
      },
      data: {
        albumImages: images
      },
    });
  },
  async deleteTrack(trackItemId: string) {
    await prisma.track.delete({
      where: { itemId: trackItemId },
    });
  },
  async createBoxTrack(boxId: string, itemId: string, position: number) {
    const newBoxTrack = await prisma.boxTrack.create({
      data: {
        position,
        note: "",
        box: { connect: { boxId } },
        track: { connect: { itemId } },
      },
    });

    return newBoxTrack;
  },
  async deleteBoxTrack(boxId: string, trackId: string) {
    await prisma.boxTrack.deleteMany({
      where: { boxId, trackId },
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
  async getTrackBoxCount(trackSpotifyId: string) {
    return await prisma.boxTrack.count({
      where: { trackId: trackSpotifyId },
    });
  },
  async checkTrackInBox(boxId: string, trackSpotifyId: string) {
    const boxTrack = await prisma.boxTrack.findFirst({
      where: {
        boxId,
        track: {
          spotifyId: trackSpotifyId,
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
  async getTrackInBox(boxId: string, trackId: string) {
    const boxTrack = await prisma.boxTrack.findFirst({
      where: { boxId, trackId },
      select: { position: true, boxTrackId: true },
    });

    return boxTrack;
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
    await prisma.boxTrack.update({
      where: { boxTrackId },
      data: { position: newPosition },
    });
  },
  async updateSubsequentBoxTrackPositions(boxId: string, trackId: string, position: number) {
    await prisma.boxTrack.updateMany({
      where: {
        boxId,
        trackId: { not: trackId },
        position: { gte: position },
      },
      data: { position: { increment: 1 } },
    });
  },
  async updateSubsectionTrackPosition(subsectionId: string, boxTrackId: string, newPosition: number) {
    await prisma.boxSubsectionTrack.update({
      where: { boxTrackId_subsectionId: { subsectionId, boxTrackId } },
      data: { position: newPosition },
    });
  },
  async updateSubsequentSubsectionTrackPositions(subsectionId: string, boxTrackId: string, position: number) {
    await prisma.boxSubsectionTrack.updateMany({
      where: {
        subsectionId,
        boxTrackId: { not: boxTrackId },
        position: { gte: position },
      },
      data: { position: { increment: 1 } },
    });
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
