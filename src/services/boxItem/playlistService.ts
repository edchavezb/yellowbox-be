import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const playlistService = {
  async createPlaylist(playlistData: any) {
    const { spotifyId, name, description, ownerDisplayName, ownerId, images, type, totalTracks } = playlistData;
    const newPlaylist = await prisma.playlist.upsert({
      where: { spotifyId },
      update: {},
      create: {
        spotifyId,
        name,
        description,
        ownerDisplayName,
        ownerId,
        images,
        type,
        totalTracks
      }
    });

    return newPlaylist;
  },
  async updatePlaylistImages(playlistItemId: string, images: any) {
    return await prisma.playlist.update({
      where: {
        itemId: playlistItemId,
      },
      data: {
        images: images
      },
    });
  },
  async deletePlaylist(playlistItemId: string) {
    await prisma.playlist.delete({
      where: { itemId: playlistItemId },
    });
  },
  async createBoxPlaylist(boxId: string, itemId: string, position: number) {
    const newBoxPlaylist = await prisma.boxPlaylist.create({
      data: {
        position,
        note: "",
        box: { connect: { boxId } },
        playlist: { connect: { itemId } },
      },
    });

    return newBoxPlaylist;
  },
  async deleteBoxPlaylist(boxId: string, playlistId: string) {
    await prisma.boxPlaylist.deleteMany({
      where: { boxId, playlistId },
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
  async getPlaylistBoxCount(playlistSpotifyId: string) {
    return await prisma.boxPlaylist.count({
      where: { playlistId: playlistSpotifyId },
    });
  },
  async checkPlaylistInBox(boxId: string, playlistSpotifyId: string) {
    const boxPlaylist = await prisma.boxPlaylist.findFirst({
      where: {
        boxId,
        playlist: {
          spotifyId: playlistSpotifyId,
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
  async getPlaylistInBox(boxId: string, playlistId: string) {
    const boxPlaylist = await prisma.boxPlaylist.findFirst({
      where: { boxId, playlistId },
      select: { position: true, boxPlaylistId: true },
    });

    return boxPlaylist;
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
    await prisma.boxPlaylist.update({
      where: { boxPlaylistId },
      data: { position: newPosition },
    });
  },
  async updateSubsequentBoxPlaylistPositions(boxId: string, playlistId: string, position: number) {
    await prisma.boxPlaylist.updateMany({
      where: {
        boxId,
        playlistId: { not: playlistId },
        position: { gte: position },
      },
      data: { position: { increment: 1 } },
    });
  },
  async updateSubsectionPlaylistPosition(subsectionId: string, boxPlaylistId: string, newPosition: number) {
    await prisma.boxSubsectionPlaylist.update({
      where: { boxPlaylistId_subsectionId: { subsectionId, boxPlaylistId } },
      data: { position: newPosition },
    });
  },
  async updateSubsequentSubsectionPlaylistPositions(subsectionId: string, boxPlaylistId: string, position: number) {
    await prisma.boxSubsectionPlaylist.updateMany({
      where: {
        subsectionId,
        boxPlaylistId: { not: boxPlaylistId },
        position: { gte: position },
      },
      data: { position: { increment: 1 } },
    });
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

export default playlistService;
