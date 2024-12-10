import { BoxAlbum, BoxArtist, BoxPlaylist, BoxSectionSettings, BoxSubsectionAlbum, BoxSubsectionArtist, BoxSubsectionPlaylist, BoxSubsectionTrack, BoxTrack, PrismaClient, PrismaPromise } from "@prisma/client";
import { flattenBoxItem, flattenSubsectionItem } from "../../helpers";
import { BoxCreateDTO } from "../../types/interfaces";
const prisma = new PrismaClient();

const boxService = {
  async getBoxById(boxId: string) {
    const box = await prisma.box.findFirst({
      where: {
        AND: {
          boxId: boxId as string,
          deletedAt: null
        }
      },
      select: {
        boxId: true,
        name: true,
        description: true,
        position: true,
        folderPosition: true,
        folder: {
          select: {
            name: true,
            folderId: true
          }
        },
        creator: {
          select: {
            username: true,
            userId: true
          }
        },
        isPublic: true,
        artists: {
          include: {
            artist: true,
            subsections: {
              select: {
                subsectionId: true,
                note: true
              }
            }
          },
          orderBy: {
            position: 'asc'
          }
        },
        albums: {
          include: {
            album: true,
            subsections: {
              select: {
                subsectionId: true,
                note: true
              }
            }
          },
          orderBy: {
            position: 'asc'
          }
        },
        tracks: {
          include: {
            track: true,
            subsections: {
              select: {
                subsectionId: true,
                note: true
              }
            }
          },
          orderBy: {
            position: 'asc'
          }
        },
        playlists: {
          include: {
            playlist: true,
            subsections: {
              select: {
                subsectionId: true,
                note: true
              }
            }
          },
          orderBy: {
            position: 'asc'
          }
        },
        sectionSettings: {
          select: {
            displayGrouping: true,
            displaySubsections: true,
            isVisible: true,
            primarySorting: true,
            secondarySorting: true,
            sortingOrder: true,
            type: true,
            view: true
          }
        },
        subsections: {
          include: {
            tracks: {
              include: {
                boxTrack: {
                  include: {
                    track: true
                  }
                }
              }
            },
            artists: {
              include: {
                boxArtist: {
                  include: {
                    artist: true
                  }
                }
              }
            },
            albums: {
              include: {
                boxAlbum: {
                  include: {
                    album: true
                  }
                }
              }
            },
            playlists: {
              include: {
                boxPlaylist: {
                  include: {
                    playlist: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (box) {
      const responseArtists = box.artists.map(item => flattenBoxItem(item, item.artist, item.subsections.map(sub => sub.subsectionId)))
      const responseAlbums = box.albums.map(item => flattenBoxItem(item, item.album, item.subsections.map(sub => sub.subsectionId)))
      const responseTracks = box.tracks.map(item => flattenBoxItem(item, item.track, item.subsections.map(sub => sub.subsectionId)))
      const responsePlaylists = box.playlists.map(item => flattenBoxItem(item, item.playlist, item.subsections.map(sub => sub.subsectionId)))
      const responseSubsections = box.subsections.map(sub => {
        const { artists, tracks, playlists, albums, ...remainderProps } = sub;
        const flattenedItems = {
          tracks: tracks.map(track => flattenSubsectionItem(track.boxTrack, track.boxTrack.track)),
          playlists: playlists.map(playlist => flattenSubsectionItem(playlist.boxPlaylist, playlist.boxPlaylist.playlist)),
          albums: albums.map(album => flattenSubsectionItem(album.boxAlbum, album.boxAlbum.album)),
          artists: artists.map(artist => flattenSubsectionItem(artist.boxArtist, artist.boxArtist.artist))
        }
        const reducedSubsection = { ...remainderProps, items: flattenedItems[sub.itemType as keyof typeof flattenedItems] }
        return reducedSubsection;
      })

      return { ...box, artists: responseArtists, albums: responseAlbums, tracks: responseTracks, playlists: responsePlaylists, subsections: responseSubsections }
    }

    else {
      return {}
    }
  },
  async getUserBoxes(userId: string) {
    const boxes = await prisma.box.findMany({
      where: {
        AND: [
          { creatorId: userId },
          { deletedAt: null }
        ]
      },
      select: {
        boxId: true,
        name: true,
        position: true
      }
    });

    return boxes;
  },
  async getDashboardBoxes(userId: string) {
    return await prisma.box.findMany({
      where: {
        creatorId: userId,
        folderId: null, // Only fetch boxes without a folder
        deletedAt: null // Exclude deleted boxes
      },
      select: {
        boxId: true,
        name: true,
        position: true
      },
      orderBy: {
        position: 'asc' // Order by position
      }
    });
  },
  async getMaxPositionDashboard(userId: string) {
    const result = await prisma.box.aggregate({
      where: {
        creatorId: userId,
        folderId: null,
        deletedAt: null,
      },
      _max: {
        position: true,
      }
    });
    return result._max.position;
  },
  async createBox(userBox: BoxCreateDTO) {
    const { creatorId, ...boxData } = userBox
    const newBox = await prisma.box.create({
      data: {
        ...boxData,
        creator: { connect: { userId: creatorId } },
        sectionSettings: {
          createMany: {
            data: [
              { type: "artists" },
              { type: "albums" },
              { type: "tracks" },
              { type: "playlists" }
            ]
          }
        }
      }
    });

    return {
      boxId: newBox.boxId,
      name: newBox.name,
      position: newBox.position,
      folderId: newBox.folderId,
      folderPosition: newBox.folderPosition
    }
  },
  async deleteBox(boxId: string) {
    return await prisma.box.update({
      where: {
        boxId: boxId
      },
      data: {
        deletedAt: new Date(),
        folderId: null,
        folderPosition: null,
        position: null
      }
    });
  },
  async undoDeleteBox(boxId: string, newPosition: number) {
    return await prisma.box.update({
      where: {
        boxId: boxId as string
      },
      data: {
        deletedAt: null, // Undo deletion
        position: newPosition // Set the new position
      }
    });
  },
  async getBoxExists(boxId: string) {
    const box = await prisma.box.findUnique({
      where: {
        boxId: boxId
      }
    });

    return !!box;
  },
  async updateBoxDetails(boxId: string, updatedDetails: any) {
    const { name, description, isPublic } = updatedDetails;
    return await prisma.box.update({
      where: {
        boxId: boxId
      },
      data: {
        name,
        description,
        isPublic
      },
      include: {
        folder: {
          select: {
            name: true,
            folderId: true
          }
        }
      }
    });
  },
  async addBoxToFolder(boxId: string, folderId: string, folderPosition: number) {
    await prisma.box.update({
      where: {
        boxId: boxId as string
      },
      data: {
        folderId: folderId,
        folderPosition: folderPosition
      }
    });
  },
  async removeBoxFromFolder(boxId: string, newPosition: number) {
    await prisma.box.update({
      where: {
        boxId: boxId as string
      },
      data: {
        folderId: null,
        folderPosition: null,
        position: newPosition
      }
    });
  },
  async updateBoxSectionSettings(boxId: string, type: string, updatedSettings: any) {
    const { primarySorting, secondarySorting, view, sortingOrder, displayGrouping, displaySubsections, isVisible } = updatedSettings;
    return await prisma.boxSectionSettings.updateMany({
      where: {
        AND: {
          boxId: boxId as string,
          type: type
        }
      },
      data: {
        primarySorting,
        secondarySorting,
        view,
        sortingOrder,
        displayGrouping,
        displaySubsections,
        isVisible
      }
    });
  },
  async updateDashboardBoxPosition(boxId: string, newPosition: number){
    await prisma.box.update({
      where: { boxId: boxId },
      data: { position: newPosition }
    });
  },
  async incrementSubsequentDashboardBoxPositions(userId: string, boxId: string, newPosition: number){
    await prisma.box.updateMany({
      where: {
        creatorId: userId,
        deletedAt: null,
        folderId: null,
        position: {
          gte: newPosition
        },
        boxId: {
          not: boxId
        },
        NOT: {
          position: null // Only update boxes with non-null positions
        }
      },
      data: {
        position: {
          increment: 1
        }
      }
    });
  },
  async updateFolderBoxPosition(boxId: string, newPosition: number){
    await prisma.box.update({
      where: { boxId: boxId },
      data: { folderPosition: newPosition }
    });
  },
  async incrementSubsequentFolderBoxPositions(boxId: string, folderId: string, newPosition: number){
    await prisma.box.updateMany({
      where: {
        folderId: folderId,
        deletedAt: null,
        boxId: { not: boxId }, // Exclude the target box
        folderPosition: { gte: newPosition } // Select boxes with positions greater than or equal to the target position
      },
      data: { folderPosition: { increment: 1 } } // Increment the position of selected boxes by 1
    });
  },
  async cloneBoxItems(originalBox: any, newBoxId: string) {
    const operations: PrismaPromise<any>[] = [];

    // Add artist cloning operations
    operations.push(
      ...originalBox.artists.map((artist: BoxArtist) =>
        prisma.boxArtist.create({
          data: {
            boxId: newBoxId,
            artistId: artist.artistId,
            position: artist.position,
            note: artist.note,
          },
        })
      )
    );

    // Add track cloning operations
    operations.push(
      ...originalBox.tracks.map((track: BoxTrack) =>
        prisma.boxTrack.create({
          data: {
            boxId: newBoxId,
            trackId: track.trackId,
            position: track.position,
            note: track.note,
          },
        })
      )
    );

    // Add album cloning operations
    operations.push(
      ...originalBox.albums.map((album: BoxAlbum) =>
        prisma.boxAlbum.create({
          data: {
            boxId: newBoxId,
            albumId: album.albumId,
            position: album.position,
            note: album.note,
          },
        })
      )
    );

    // Add playlist cloning operations
    operations.push(
      ...originalBox.playlists.map((playlist: BoxPlaylist) =>
        prisma.boxPlaylist.create({
          data: {
            boxId: newBoxId,
            playlistId: playlist.playlistId,
            position: playlist.position,
            note: playlist.note,
          },
        })
      )
    );

    // Execute all operations in a single transaction
    const results = await prisma.$transaction(operations);

    // Initialize result objects for each type
    const artistIdMap: Record<string, string> = {};
    const trackIdMap: Record<string, string> = {};
    const albumIdMap: Record<string, string> = {};
    const playlistIdMap: Record<string, string> = {};

    // Map results to corresponding objects
    let resultIndex = 0;

    // Map artist results
    originalBox.artists.forEach((artist: BoxArtist) => {
      artistIdMap[artist.boxArtistId] = results[resultIndex].boxArtistId;
      resultIndex++;
    });

    // Map track results
    originalBox.tracks.forEach((track: BoxTrack) => {
      trackIdMap[track.boxTrackId] = results[resultIndex].boxTrackId;
      resultIndex++;
    });

    // Map album results
    originalBox.albums.forEach((album: BoxAlbum) => {
      albumIdMap[album.boxAlbumId] = results[resultIndex].boxAlbumId;
      resultIndex++;
    });

    // Map playlist results
    originalBox.playlists.forEach((playlist: BoxPlaylist) => {
      playlistIdMap[playlist.boxPlaylistId] = results[resultIndex].boxPlaylistId;
      resultIndex++;
    });

    // Return all result objects
    return {
      artistIdMap,
      trackIdMap,
      albumIdMap,
      playlistIdMap,
    };
  },
  async cloneBoxSubsections(
    originalBox: any,
    newBoxId: string,
    boxItemsMap: {
      artistIdMap: Record<string, string>;
      trackIdMap: Record<string, string>;
      albumIdMap: Record<string, string>;
      playlistIdMap: Record<string, string>;
    }
  ) {
    const operations: PrismaPromise<any>[] = [];
  
    for (const subsection of originalBox.subsections) {
      // Create the subsection and push the operation to the transaction queue
      const subsectionPromise = prisma.boxSubsection.create({
        data: {
          boxId: newBoxId,
          itemType: subsection.itemType,
          name: subsection.name,
          position: subsection.position,
        },
      });
  
      operations.push(subsectionPromise);
  
      // Wait for subsection creation to resolve and proceed with cloning items
      const newSubsection = await subsectionPromise;
  
      // Clone subsection artists
      subsection.artists.forEach((item: BoxSubsectionArtist) => {
        const newBoxArtistId = boxItemsMap.artistIdMap[item.boxArtistId];
        if (newBoxArtistId) {
          operations.push(
            prisma.boxSubsectionArtist.create({
              data: {
                position: item.position,
                note: item.note,
                boxArtist: { connect: { boxArtistId: newBoxArtistId } },
                subsection: { connect: { subsectionId: newSubsection.subsectionId } },
              },
            })
          );
        }
      });
  
      // Clone subsection albums
      subsection.albums.forEach((item: BoxSubsectionAlbum) => {
        const newBoxAlbumId = boxItemsMap.albumIdMap[item.boxAlbumId];
        if (newBoxAlbumId) {
          operations.push(
            prisma.boxSubsectionAlbum.create({
              data: {
                position: item.position,
                note: item.note,
                boxAlbum: { connect: { boxAlbumId: newBoxAlbumId } },
                subsection: { connect: { subsectionId: newSubsection.subsectionId } },
              },
            })
          );
        }
      });
  
      // Clone subsection tracks
      subsection.tracks.forEach((item: BoxSubsectionTrack) => {
        const newBoxTrackId = boxItemsMap.trackIdMap[item.boxTrackId];
        if (newBoxTrackId) {
          operations.push(
            prisma.boxSubsectionTrack.create({
              data: {
                position: item.position,
                note: item.note,
                boxTrack: { connect: { boxTrackId: newBoxTrackId } },
                subsection: { connect: { subsectionId: newSubsection.subsectionId } },
              },
            })
          );
        }
      });
  
      // Clone subsection playlists
      subsection.playlists.forEach((item: BoxSubsectionPlaylist) => {
        const newBoxPlaylistId = boxItemsMap.playlistIdMap[item.boxPlaylistId];
        if (newBoxPlaylistId) {
          operations.push(
            prisma.boxSubsectionPlaylist.create({
              data: {
                position: item.position,
                note: item.note,
                boxPlaylist: { connect: { boxPlaylistId: newBoxPlaylistId } },
                subsection: { connect: { subsectionId: newSubsection.subsectionId } },
              },
            })
          );
        }
      });
    }
  
    // Execute all operations (subsection creation + item cloning) in a single transaction
    await prisma.$transaction(operations);
  },  
  async cloneBoxSectionSettings(originalBox: any, newBoxId: string) {
    // Collect all PrismaPromise operations to run them in a transaction
    const operations: PrismaPromise<any>[] = [];
    // Map sectionSettings to their correct types and clone them
    const sectionSettingsMap = originalBox.sectionSettings.reduce((map: { [key: string]: BoxSectionSettings }, setting: BoxSectionSettings) => {
      map[setting.type] = setting;
      return map;
    }, {} as Record<string, typeof originalBox.sectionSettings[0]>);

    operations.push(
      ...['albums', 'tracks', 'artists', 'playlists'].map(type => prisma.boxSectionSettings.create({
        data: {
          boxId: newBoxId,
          type: type,
          primarySorting: sectionSettingsMap[type]?.primarySorting || 'custom',
          secondarySorting: sectionSettingsMap[type]?.secondarySorting || 'none',
          view: sectionSettingsMap[type]?.view || 'grid',
          sortingOrder: sectionSettingsMap[type]?.sortingOrder || 'ASCENDING',
          displayGrouping: sectionSettingsMap[type]?.displayGrouping || false,
          displaySubsections: sectionSettingsMap[type]?.displaySubsections || false,
          isVisible: sectionSettingsMap[type]?.isVisible || true,
        }
      }))
    );

    // Execute the cloning operations in a transaction
    await prisma.$transaction(operations);
  }
};

export default boxService;