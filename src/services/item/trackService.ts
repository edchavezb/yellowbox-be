import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const trackService = {
  async createTrack(trackData: any) {
    const {
      spotifyId,
      name,
      artists,
      albumName,
      albumId,
      albumReleaseDate,
      albumImages,
      duration,
      explicit,
      type,
    } = trackData;
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
        type,
      },
    });

    return newTrack;
  },
  async updateTrackImages(spotifyId: string, images: any) {
    return await prisma.track.update({
      where: {
        spotifyId,
      },
      data: {
        albumImages: images,
      },
    });
  },
  async markTrackAsPlayed(userId: string, trackId: string) {
    return await prisma.playedTrack.upsert({
      where: { userId_trackId: { userId, trackId } },
      update: { lastPlayedAt: new Date() },
      create: { userId, trackId, lastPlayedAt: new Date() },
    });
  },
  async removeTrackPlay(userId: string, trackId: string) {
    return await prisma.playedTrack.deleteMany({
      where: { userId, trackId },
    });
  },
  async checkTrackPlayedByUser(userId: string, trackId: string) {
    const playRecord = await prisma.playedTrack.findFirst({
      where: {
        userId,
        trackId,
      },
    });

    return !!playRecord;
  },
  async deleteTrack(spotifyId: string) {
    await prisma.track.delete({
      where: { spotifyId },
    });
  },
};

export default trackService;