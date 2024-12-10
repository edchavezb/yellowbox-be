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
  async updateAlbumImages(albumItemId: string, images: any) {
    return await prisma.album.update({
      where: {
        itemId: albumItemId,
      },
      data: {
        images: images
      },
    });
  },
  async deleteAlbum(albumItemId: string) {
    await prisma.album.delete({
      where: { itemId: albumItemId }
    });
  },
  async createBoxAlbum(boxId: string, itemId: string, position: number) {
    const newBoxAlbum = await prisma.boxAlbum.create({
      data: {
        position: position,
        note: "",
        box: { connect: { boxId: boxId } },
        album: { connect: { itemId: itemId } }
      }
    });

    return newBoxAlbum;
  },
  async deleteBoxAlbum(boxId: string, albumId: string) {
    await prisma.boxAlbum.deleteMany({
      where: { boxId: boxId, albumId: albumId },
    });
  },
  async createBoxSubsectionAlbum(subsectionId: string, boxAlbumId: string, position: number) {
    await prisma.boxSubsectionAlbum.create({
      data: {
        position: position,
        note: "",
        boxAlbum: { connect: { boxAlbumId: boxAlbumId } },
        subsection: { connect: { subsectionId: subsectionId } }
      }
    });
  },
  async deleteBoxSubsectionAlbum(subsectionId: string, boxAlbumId: string) {
    await prisma.boxSubsectionAlbum.delete({
      where: { boxAlbumId_subsectionId: { subsectionId: subsectionId, boxAlbumId: boxAlbumId } },
    });
  },
  async getAlbumBoxCount(albumSpotifyId: string) {
    return await prisma.boxAlbum.count({
      where: { albumId: albumSpotifyId }
    });
  },
  async checkAlbumInBox(boxId: string, albumSpotifyId: string) {
    const boxAlbum = await prisma.boxAlbum.findFirst({
      where: {
        boxId: boxId,
        album: {
          spotifyId: albumSpotifyId
        }
      }
    });

    return !!boxAlbum;
  },
  async checkAlbumInSubsection(subsectionId: string, boxAlbumId: string) {
    const subsectionAlbum = await prisma.boxSubsectionAlbum.findUnique({
      where: { boxAlbumId_subsectionId: { subsectionId: subsectionId, boxAlbumId: boxAlbumId } },
    });

    return !!subsectionAlbum;
  },
  async getAlbumInBox(boxId: string, albumId: string) {
    const boxAlbum = await prisma.boxAlbum.findFirst({
      where: { boxId: boxId, albumId: albumId },
      select: { position: true, boxAlbumId: true }
    });

    return boxAlbum;
  },
  async getMaxBoxAlbumPosition(boxId: string) {
    const result = await prisma.boxAlbum.aggregate({
      where: {
        boxId: boxId
      },
      _max: {
        position: true,
      }
    });

    return result._max.position;
  },
  async getMaxSubsectionAlbumPosition(subsectionId: string) {
    const result = await prisma.boxSubsectionAlbum.aggregate({
      where: {
        subsectionId: subsectionId
      },
      _max: {
        position: true,
      }
    });

    return result._max.position;
  },
  async updateBoxAlbumPosition(boxAlbumId: string, newPosition: number) {
    await prisma.boxAlbum.update({
      where: { boxAlbumId: boxAlbumId },
      data: { position: newPosition }
    });
  },
  async updateSubsequentBoxAlbumPositions(boxId: string, albumId: string, position: number) {
    await prisma.boxAlbum.updateMany({
      where: {
        boxId: boxId,
        albumId: { not: albumId },
        position: { gte: position }
      },
      data: { position: { increment: 1 } }
    });
  },
  async updateSubsectionAlbumPosition(subsectionId: string, boxAlbumId: string, newPosition: number) {
    await prisma.boxSubsectionAlbum.update({
      where: { boxAlbumId_subsectionId: { subsectionId: subsectionId, boxAlbumId: boxAlbumId } },
      data: { position: newPosition }
    });
  },
  async updateSubsequentSubsectionAlbumPositions(subsectionId: string, boxAlbumId: string, position: number) {
    await prisma.boxSubsectionAlbum.updateMany({
      where: {
        subsectionId: subsectionId,
        boxAlbumId: { not: boxAlbumId },
        position: { gte: position }
      },
      data: { position: { increment: 1 } }
    });
  },
  async getBoxWithAlbums(boxId: string) {
    return await prisma.box.findUnique({
      where: { boxId: boxId },
      include: {
        albums: {
          include: {
            album: true,
            subsections: {
              select: {
                subsectionId: true,
                note: true
              }
            }
          }
        }
      }
    });
  }
};

export default albumService;
