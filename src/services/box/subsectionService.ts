import { PrismaClient } from "@prisma/client";
import { flattenSubsectionItem } from "../../helpers";
const prisma = new PrismaClient();

const subsectionService = {
    async getSubsectionSimple(subsectionId: string){
      return await prisma.boxSubsection.findUnique({
        where: { subsectionId: subsectionId },
        select: { position: true }
      });
    },
    async createSubsection(boxId: string, subSectionData: any){
      const {itemType, name, position} = subSectionData;
      await prisma.boxSubsection.create({
        data: {
          boxId,
          itemType,
          name,
          position
        }
      });
    },
    async deleteSubsection(subsectionId: string){
      await prisma.boxSubsection.delete({
        where: {
          subsectionId: subsectionId
        }
      });
    },
    async updateSubsectionName(subsectionId: string, newName: string){
      await prisma.boxSubsection.update({
        where: {
          subsectionId: subsectionId
        },
        data: {
          name: newName
        }
      });
    },
    async updateSubsectionPosition(subsectionId: string, newPosition: number){
      await prisma.boxSubsection.update({
        where: { subsectionId: subsectionId },
        data: { position: newPosition }
      });
    },
    async incrementSubsequentSubsectionPositions(boxId: string, subsectionId: string, startIndex: number){
      await prisma.boxSubsection.updateMany({
        where: {
          boxId: boxId,
          subsectionId: { not: subsectionId }, // Exclude the target subsection
          position: { gte: startIndex } // Select subsections with positions greater than or equal to the target position
        },
        data: { position: { increment: 1 } } // Increment the position of selected subsections by 1
      });
    },
    async getUpdatedSubsections(boxId: string) {
      const updatedSubsections = await prisma.boxSubsection.findMany({
        where: { boxId },
        include: {
          tracks: { include: { boxTrack: { include: { track: true } } } },
          artists: { include: { boxArtist: { include: { artist: true } } } },
          albums: { include: { boxAlbum: { include: { album: true } } } },
          playlists: { include: { boxPlaylist: { include: { playlist: true } } } },
        }
      });
  
      return updatedSubsections.map(sub => {
        const { artists, tracks, playlists, albums, ...remainderProps } = sub;
        const flattenedItems = {
          tracks: tracks.map(track => flattenSubsectionItem(track.boxTrack, track.boxTrack.track)),
          playlists: playlists.map(playlist => flattenSubsectionItem(playlist.boxPlaylist, playlist.boxPlaylist.playlist)),
          albums: albums.map(album => flattenSubsectionItem(album.boxAlbum, album.boxAlbum.album)),
          artists: artists.map(artist => flattenSubsectionItem(artist.boxArtist, artist.boxArtist.artist)),
        };
        return { ...remainderProps, items: flattenedItems[sub.itemType as keyof typeof flattenedItems] };
      });
    },
  
  };
  
  export default subsectionService;