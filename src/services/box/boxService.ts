import { BoxAlbum, BoxArtist, BoxPlaylist, BoxSectionSettings, BoxSubsectionAlbum, BoxSubsectionArtist, BoxSubsectionPlaylist, BoxSubsectionTrack, BoxTrack, PrismaClient, PrismaPromise } from "@prisma/client";
import { flattenBoxItem, flattenSubsectionItem } from "../../helpers";
import { BoxCreateDTO } from "../../types/interfaces";
const prisma = new PrismaClient();

const boxService = {
  async getBoxById(boxId: string, viewingUserId?: string) {
    const box = await prisma.box.findFirst({
      where: {
        AND: {
          boxId: boxId as string,
          deletedAt: null,
        },
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
            folderId: true,
          },
        },
        creator: {
          select: {
            username: true,
            userId: true,
          },
        },
        isPublic: true,
        artists: {
          include: {
            artist: {
              include: viewingUserId
                ? {
                  userPlays: {
                    where: { userId: viewingUserId },
                  },
                }
                : undefined,
            },
            subsections: {
              select: {
                subsectionId: true,
              },
            },
          },
          orderBy: {
            position: "asc",
          },
        },
        albums: {
          include: {
            album: {
              include: viewingUserId
                ? {
                  userPlays: {
                    where: { userId: viewingUserId },
                  },
                }
                : undefined,
            },
            subsections: {
              select: {
                subsectionId: true,
              },
            },
          },
          orderBy: {
            position: "asc",
          },
        },
        tracks: {
          include: {
            track: {
              include: viewingUserId
                ? {
                  userPlays: {
                    where: { userId: viewingUserId },
                  },
                }
                : undefined,
            },
            subsections: {
              select: {
                subsectionId: true,
              },
            },
          },
          orderBy: {
            position: "asc",
          },
        },
        playlists: {
          include: {
            playlist: {
              include: viewingUserId
                ? {
                  userPlays: {
                    where: { userId: viewingUserId },
                  },
                }
                : undefined,
            },
            subsections: {
              select: {
                subsectionId: true,
              },
            },
          },
          orderBy: {
            position: "asc",
          },
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
            view: true,
          },
        },
        subsections: {
          orderBy: {
            position: "asc",
          },
          include: {
            tracks: {
              select: {
                boxTrackId: true,
                subsectionId: true,
                position: true,
                note: true,
                boxTrack: {
                  select: {
                    boxTrackId: true,
                    track: {
                      include: viewingUserId
                        ? {
                          userPlays: {
                            where: { userId: viewingUserId },
                          },
                        }
                        : undefined,
                    },
                  },
                },
              },
              orderBy: {
                position: "asc",
              },
            },
            artists: {
              select: {
                boxArtistId: true,
                subsectionId: true,
                position: true,
                note: true,
                boxArtist: {
                  select: {
                    artist: {
                      include: viewingUserId
                        ? {
                          userPlays: {
                            where: { userId: viewingUserId },
                          },
                        }
                        : undefined,
                    },
                  },
                },
              },
              orderBy: {
                position: "asc",
              },
            },
            albums: {
              select: {
                boxAlbumId: true,
                subsectionId: true,
                position: true,
                note: true,
                boxAlbum: {
                  select: {
                    boxAlbumId: true,
                    album: {
                      include: viewingUserId
                        ? {
                          userPlays: {
                            where: { userId: viewingUserId },
                          },
                        }
                        : undefined,
                    },
                  },
                },
              },
              orderBy: {
                position: "asc",
              },
            },
            playlists: {
              select: {
                boxPlaylistId: true,
                subsectionId: true,
                position: true,
                note: true,
                boxPlaylist: {
                  select: {
                    boxPlaylistId: true,
                    playlist: {
                      include: viewingUserId
                        ? {
                          userPlays: {
                            where: { userId: viewingUserId },
                          },
                        }
                        : undefined,
                    },
                  },
                },
              },
              orderBy: {
                position: "asc",
              },
            },
          },
        },
      },
    });

    if (box) {
      const responseArtists = box.artists.map((item) =>
        flattenBoxItem(
          item,
          item.artist,
          item.subsections.map((sub) => sub.subsectionId)
        )
      );
      const responseAlbums = box.albums.map((item) =>
        flattenBoxItem(
          item,
          item.album,
          item.subsections.map((sub) => sub.subsectionId)
        )
      );
      const responseTracks = box.tracks.map((item) =>
        flattenBoxItem(
          item,
          item.track,
          item.subsections.map((sub) => sub.subsectionId)
        )
      );
      const responsePlaylists = box.playlists.map((item) =>
        flattenBoxItem(
          item,
          item.playlist,
          item.subsections.map((sub) => sub.subsectionId)
        )
      );
      const responseSubsections = box.subsections.map((sub) => {
        const { artists, tracks, playlists, albums, ...remainderProps } = sub;
        const flattenedItems = {
          tracks: tracks.map((track) =>
            flattenSubsectionItem(track, track.boxTrack.track)
          ),
          playlists: playlists.map((playlist) =>
            flattenSubsectionItem(playlist, playlist.boxPlaylist.playlist)
          ),
          albums: albums.map((album) =>
            flattenSubsectionItem(album, album.boxAlbum.album)
          ),
          artists: artists.map((artist) =>
            flattenSubsectionItem(artist, artist.boxArtist.artist)
          ),
        };
        const reducedSubsection = {
          ...remainderProps,
          items: flattenedItems[sub.itemType as keyof typeof flattenedItems],
        };
        return reducedSubsection;
      });

      return {
        ...box,
        artists: responseArtists,
        albums: responseAlbums,
        tracks: responseTracks,
        playlists: responsePlaylists,
        subsections: responseSubsections,
      };
    } else {
      return null;
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
  async getBoxPosition(boxId: string) {
    const box = await prisma.box.findUnique({
      where: {
        boxId: boxId
      },
      select: {
        position: true
      }
    });

    if (!box) {
      return null;
    }

    return box.position
  },
  async getBoxFolderPosition(boxId: string) {
    const box = await prisma.box.findUnique({
      where: {
        boxId: boxId
      },
      select: {
        folderPosition: true
      }
    });

    if (!box) {
      return null;
    }

    return box.folderPosition;
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
    try {
      const { creatorId, ...boxData } = userBox;

      // Verify that the creatorId exists in the User table
      const userExists = await prisma.user.findUnique({
        where: { userId: creatorId },
      });

      if (!userExists) {
        throw new Error(`User with id ${creatorId} does not exist`);
      }

      // Create the new box
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
      };
    } catch (error) {
      console.error("Failed to create box:", error);
      throw error;
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
        folderPosition: null
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
  async updateAllBoxSectionSettings(boxId: string, updatedSettings: any) {
    const { artistSettings, albumSettings, trackSettings, playlistSettings } = updatedSettings;
    const operations: PrismaPromise<any>[] = [];

    if (artistSettings) {
      operations.push(
        prisma.boxSectionSettings.updateMany({
          where: {
            boxId: boxId,
            type: 'artists'
          },
          data: artistSettings
        })
      );
    }

    if (albumSettings) {
      operations.push(
        prisma.boxSectionSettings.updateMany({
          where: {
            boxId: boxId,
            type: 'albums'
          },
          data: albumSettings
        })
      );
    }

    if (trackSettings) {
      operations.push(
        prisma.boxSectionSettings.updateMany({
          where: {
            boxId: boxId,
            type: 'tracks'
          },
          data: trackSettings
        })
      );
    }

    if (playlistSettings) {
      operations.push(
        prisma.boxSectionSettings.updateMany({
          where: {
            boxId: boxId,
            type: 'playlists'
          },
          data: playlistSettings
        })
      );
    }

    await prisma.$transaction(operations);
  },
  async updateDashboardBoxPosition(boxId: string, newPosition: number) {
    const currentBox = await prisma.box.findUnique({
      where: { boxId },
    });

    if (!currentBox) {
      throw new Error("Box not found");
    }

    const currentPosition = currentBox.position;

    if (newPosition < currentPosition) {
      // Moving to a lower position
      await prisma.box.updateMany({
        where: {
          creatorId: currentBox.creatorId,
          deletedAt: null,
          folderId: null,
          position: { gte: newPosition, lt: currentPosition },
          boxId: { not: boxId },
        },
        data: { position: { increment: 1 } },
      });
    } else if (newPosition > currentPosition) {
      // Moving to a higher position
      await prisma.box.updateMany({
        where: {
          creatorId: currentBox.creatorId,
          deletedAt: null,
          folderId: null,
          position: { gt: currentPosition, lte: newPosition },
          boxId: { not: boxId },
        },
        data: { position: { decrement: 1 } },
      });
    }

    await prisma.box.update({
      where: { boxId },
      data: { position: newPosition },
    });
  },
  async updateFolderBoxPosition(boxId: string, newPosition: number) {
    const currentBox = await prisma.box.findUnique({
      where: { boxId },
    });

    if (!currentBox) {
      throw new Error("Box not found");
    }

    const currentPosition = currentBox.folderPosition;

    if (currentPosition === null) {
      throw new Error("Current folder position is null");
    }

    if (newPosition < currentPosition) {
      // Moving to a lower position
      await prisma.box.updateMany({
        where: {
          folderId: currentBox.folderId,
          deletedAt: null,
          folderPosition: { gte: newPosition, lt: currentPosition },
          boxId: { not: boxId },
        },
        data: { folderPosition: { increment: 1 } },
      });
    } else if (newPosition > currentPosition) {
      // Moving to a higher position
      await prisma.box.updateMany({
        where: {
          folderId: currentBox.folderId,
          deletedAt: null,
          folderPosition: { gt: currentPosition, lte: newPosition },
          boxId: { not: boxId },
        },
        data: { folderPosition: { decrement: 1 } },
      });
    }

    await prisma.box.update({
      where: { boxId },
      data: { folderPosition: newPosition },
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
  },
  async isBoxFollowedByUser(userId: string, boxId: string) {
    const boxFollow = await prisma.boxFollow.findFirst({  
      where: {
        userId,
        boxId,
      },
    });
    return !!boxFollow;
  },
  async followBox(userId: string, boxId: string) {
    const existingFollow = await prisma.boxFollow.findFirst({
      where: {
        userId,
        boxId,
      },
    });

    if (existingFollow) {
      throw new Error("You are already following this box.");
    }

    await prisma.boxFollow.create({
      data: {
        userId,
        boxId,
      },
    });

    return { message: "Successfully followed the box." };
  },
  async unfollowBox(userId: string, boxId: string) {
    const existingFollow = await prisma.boxFollow.findFirst({
      where: {
        userId,
        boxId,
      },
    });

    if (!existingFollow) {
      throw new Error("You are not following this box.");
    }

    await prisma.boxFollow.delete({
      where: {
        boxFollowId: existingFollow.boxFollowId,
      },
    });

    return { message: "Successfully unfollowed the box." };
  }
};

export default boxService;