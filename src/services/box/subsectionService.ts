import { PrismaClient } from "@prisma/client";
import { flattenSubsectionItem } from "../../helpers";
import boxService from "./boxService";
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
      return await prisma.boxSubsection.create({
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
    async updateSubsectionPosition(subsectionId: string, newPosition: number) {
        const currentSubsection = await prisma.boxSubsection.findUnique({
            where: { subsectionId },
        });
    
        if (!currentSubsection) {
            throw new Error("Subsection not found");
        }
    
        const currentPosition = currentSubsection.position;
    
        if (newPosition < currentPosition) {
            // Moving to a lower position
            await prisma.boxSubsection.updateMany({
                where: {
                    boxId: currentSubsection.boxId,
                    subsectionId: { not: subsectionId },
                    position: { gte: newPosition, lt: currentPosition },
                },
                data: { position: { increment: 1 } },
            });
        } else if (newPosition > currentPosition) {
            // Moving to a higher position
            await prisma.boxSubsection.updateMany({
                where: {
                    boxId: currentSubsection.boxId,
                    subsectionId: { not: subsectionId },
                    position: { gt: currentPosition, lte: newPosition },
                },
                data: { position: { decrement: 1 } },
            });
        }
    
        await prisma.boxSubsection.update({
            where: { subsectionId },
            data: { position: newPosition },
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
          tracks: tracks.map(track => flattenSubsectionItem(track, track.boxTrack.track)),
          playlists: playlists.map(playlist => flattenSubsectionItem(playlist, playlist.boxPlaylist.playlist)),
          albums: albums.map(album => flattenSubsectionItem(album, album.boxAlbum.album)),
          artists: artists.map(artist => flattenSubsectionItem(artist, artist.boxArtist.artist)),
        };
        return { ...remainderProps, items: flattenedItems[sub.itemType as keyof typeof flattenedItems] };
      });
    },
  
  };
  
  export default subsectionService;