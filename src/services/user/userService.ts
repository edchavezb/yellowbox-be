import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const userService = {
  async getMyUserData(userId: string) {
    const user = await prisma.user.findFirst({
      where: {
        userId,
      },
      include: {
        boxes: {
          where: {
            deletedAt: null,
          },
          select: {
            boxId: true,
            name: true,
            position: true,
            folderPosition: true,
            folderId: true,
            isPublic: true,
          },
          orderBy: {
            position: "asc",
          },
        },
        topAlbums: {
          include: {
            album: true
          },
          orderBy: {
            position: "asc"
          }
        },
        folders: {
          select: {
            folderId: true,
            name: true,
            isPublic: true,
            creator: true,
            description: true,
            boxes: {
              where: {
                deletedAt: null,
              },
              select: {
                boxId: true,
                name: true,
                position: true,
                folderPosition: true,
                isPublic: true,
              },
              orderBy: {
                folderPosition: "asc",
              },
            },
          },
        },
        followedUsers: {
          select: {
            followedUser: {
              select: {
                userId: true,
                username: true,
                imageUrl: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        followers: {
          select: {
            follower: {
              select: {
                userId: true,
                username: true,
                imageUrl: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        billing: true,
        accountData: true,
        spotifyAccount: true,
      },
    });

    if (!user) {
      return null;
    }

    const followedUsers = user.followedUsers.map((item) => item.followedUser);
    const followers = user.followers.map((item) => item.follower);

    return {
      ...user,
      followedUsers,
      followers,
    };
  },
  async getMyFollowedUsers(userId: string) {
    const user = await prisma.user.findFirst({
      where: {
        userId,
      },
      select: {
        followedUsers: {
          select: {
            followedUser: {
              select: {
                userId: true,
                username: true,
                imageUrl: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return [];
    }

    const followedUsers = user.followedUsers.map((item) => item.followedUser);

    return followedUsers;
  },
  async getMyFollowedBoxes(userId: string) {
    const followedBoxes = await prisma.user.findFirst({
      where: { userId },
      select: {
        followedBoxes: {
          where: {
            box: {
              isPublic: true
            }
          },
          select: {
            box: {
              select: {
                boxId: true,
                name: true,
                position: true,
                folderPosition: true,
                folderId: true,
                isPublic: true,
                creator: {
                  select: {
                    userId: true,
                    username: true,
                    imageUrl: true,
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!followedBoxes) {
      return [];
    }
    return followedBoxes.followedBoxes.map((item) => item.box);
  },
  async getUserDataById(userId: string) {
    const user = await prisma.user.findUnique({
      where: {
        userId,
      },
      include: {
        topAlbums: {
          include: {
            album: true
          },
          orderBy: {
            position: "asc"
          }
        },
        folders: {
          select: {
            folderId: true,
            name: true,
            isPublic: true,
            creator: true,
            description: true,
          },
        },
        boxes: {
          where: {
            deletedAt: null,
          },
          select: {
            boxId: true,
            name: true,
            position: true,
            folderPosition: true,
            folderId: true,
            isPublic: true,
          },
          orderBy: {
            position: "asc",
          },
        },
      },
    });

    return user;
  },
  async getUserDataByUsername(username: string) {
    const user = await prisma.user.findFirst({
      where: {
        username,
      },
      include: {
        topAlbums: {
          include: {
            album: true
          },
          orderBy: {
            position: "asc"
          }
        },
        folders: {
          select: {
            folderId: true,
            name: true,
            isPublic: true,
            creator: true,
            description: true,
          },
        },
        boxes: {
          where: {
            deletedAt: null,
          },
          select: {
            boxId: true,
            name: true,
            position: true,
            folderPosition: true,
            folderId: true,
            isPublic: true,
          },
          orderBy: {
            position: "asc",
          },
        },
        followedUsers: {
          select: {
            createdAt: true,
            followedUser: {
              select: {
                userId: true,
                username: true,
                imageUrl: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        followers: {
          select: {
            createdAt: true,
            follower: {
              select: {
                userId: true,
                username: true,
                imageUrl: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    const followedUsers = user!.followedUsers.map((item) => item.followedUser);
    const followers = user!.followers.map((item) => item.follower);

    return { ...user, followedUsers, followers };
  },
  async getUserWithDashboardBoxes(userId: string) {
    const user = await prisma.user.findFirst({
      where: {
        userId
      },
      include: {
        boxes: {
          where: {
            folderId: null,
            deletedAt: null
          },
          select: {
            boxId: true,
            name: true
          }
        }
      }
    });

    return user;
  },
  async getUsernameExists(username: string) {
    const count = await prisma.user.count({
      where: {
        username
      }
    });

    return !!count
  },
  async getEmailExists(email: string) {
    const count = await prisma.user.count({
      where: {
        email
      }
    });

    return !!count
  },
  async createUser(userData: any) {
    const { firebaseId, username, firstName, lastName, image, email } = userData;
    const newUser = await prisma.user.create({
      data: {
        firebaseId,
        username,
        firstName,
        lastName,
        imageUrl: image,
        email
      }
    });

    // Use the userId to create user billing, user account management data, and user queue
    await prisma.$transaction([
      prisma.userBilling.create({
        data: {
          userId: newUser.userId
        }
      }),
      prisma.userAccountManagementData.create({
        data: {
          userId: newUser.userId,
        }
      }),
      prisma.userQueue.create({
        data: {
          userId: newUser.userId,
        }
      })
    ]);

    return newUser;
  },
  async deleteUser(userId: string) {
    await prisma.user.delete({
      where: {
        userId
      }
    });
  },
  async updateUserProfileInfo(userId: string, updatedInfo: any) {
    const { firstName, lastName, bio } = updatedInfo;

    const updatedUser = await prisma.user.update({
      where: { userId },
      data: {
        firstName,
        lastName,
        bio
      }
    });

    return updatedUser;
  },
  async updateUserImage(userId: string, imageUrl: string) {
    const [updatedUser] = await prisma.$transaction([
      prisma.user.update({
        where: { userId },
        data: { imageUrl }
      }),
      prisma.updateUserImageAction.create({
        data: {
          userId,
          newImageUrl: imageUrl
        }
      })
    ]);

    return updatedUser;
  },
  async updateUserTopAlbum(userId: string, albumId: string, position: number) {
    if (position < 1 || position > 5) {
      throw new Error("Position must be between 1 and 5");
    }

    const existingTopAlbum = await prisma.userTopAlbum.findFirst({
      where: {
        userId,
        albumId,
      },
    });

    if (existingTopAlbum) {
      throw new Error("This album is already in your top albums");
    }

    // Check if there's already an album in the target position
    const existingPosition = await prisma.userTopAlbum.findFirst({
      where: {
        userId,
        position,
      },
    });

    const updatedTopAlbum = await prisma.$transaction(async (tx) => {
      if (existingPosition) {
        await tx.userTopAlbum.delete({
          where: {
            topAlbumId: existingPosition.topAlbumId,
          },
        });
      }

      return tx.userTopAlbum.create({
        data: {
          userId,
          albumId,
          position,
        },
        include: {
          album: true,
        },
      });
    });

    return updatedTopAlbum;
  },
  async removeUserTopAlbum(userId: string, topAlbumId: string) {
    const entry = await prisma.userTopAlbum.findUnique({
      where: { topAlbumId }
    });

    if (!entry) {
      throw new Error('Top album not found');
    }

    if (entry.userId !== userId) {
      // Guard: ensure caller is operating on their own top albums
      throw new Error('Unauthorized');
    }

    const result = await prisma.$transaction(async (tx) => {
      const deleted = await tx.userTopAlbum.delete({
        where: { topAlbumId },
        include: { album: true }
      });

      await tx.userTopAlbum.updateMany({
        where: {
          userId: entry.userId,
          position: { gt: entry.position }
        },
        data: {
          position: { decrement: 1 }
        }
      });

      return deleted;
    });

    return result;
  },
  async verifyUserEmail(userId: string) {
    const updatedUserAccountData = await prisma.userAccountManagementData.update({
      where: {
        userId: userId
      },
      data: {
        emailVerified: true
      }
    });

    return updatedUserAccountData;
  },
  async toggleTutorialPreference(userId: string) {
    const user = await prisma.userAccountManagementData.findUnique({
      where: { userId: userId }
    });

    const updatedUserAccountData = await prisma.userAccountManagementData.update({
      where: {
        userId: userId
      },
      data: {
        showTutorial: !user?.showTutorial
      }
    });

    return updatedUserAccountData;
  },
  async linkSpotifyAccount(userId: string, spotifyData: any) {
    const { refreshToken, spotifyId } = spotifyData;
    const updatedUserSpotifyAccount = await prisma.userSpotifyAccount.upsert({
      where: {
        userId
      },
      update: {
        refreshToken,
        spotifyId,
      },
      create: {
        userId,
        refreshToken,
        spotifyId,
      }
    });

    return updatedUserSpotifyAccount;
  },
  async unlinkSpotifyAccount(userId: string) {
    await prisma.userSpotifyAccount.delete({
      where: {
        userId: userId
      }
    });
  },
  async isUserFollowed(followerId: string, followedUserId: string) {
    const followRecord = await prisma.userFollow.findFirst({
      where: {
        followerId,
        followedUserId,
      },
    });

    return !!followRecord;
  },
  async followUser(followerId: string, followedUserId: string) {
    if (followerId === followedUserId) {
      throw new Error("You cannot follow yourself.");
    }

    const followRecord = await prisma.userFollow.findFirst({
      where: {
        followerId,
        followedUserId,
      },
    });

    if (followRecord) {
      throw new Error("You are already following this user.");
    }

    const newFollow = await prisma.userFollow.create({
      data: {
        followerId,
        followedUserId,
      },
    });

    return newFollow;
  },
  async unfollowUser(followerId: string, followedUserId: string) {
    const followRecord = await prisma.userFollow.findFirst({
      where: {
        followerId,
        followedUserId,
      },
    });

    if (!followRecord) {
      throw new Error("You are not following this user.");
    }

    await prisma.userFollow.delete({
      where: {
        userFollowId: followRecord.userFollowId,
      },
    });

    return { message: "Successfully unfollowed the user." };
  },
  async searchUsers(searchTerm: string, currentUserId: string) {
    const users = await prisma.user.findMany({
      where: {
        AND: [
          {
            OR: [
              { username: { contains: searchTerm, mode: 'insensitive' } },
              { firstName: { contains: searchTerm, mode: 'insensitive' } },
              { lastName: { contains: searchTerm, mode: 'insensitive' } }
            ]
          },
          {
            NOT: {
              userId: currentUserId
            }
          }
        ]
      },
      select: {
        userId: true,
        username: true,
        firstName: true,
        lastName: true,
        imageUrl: true
      },
      take: 20,
    });

    return users;
  },
  async getFollowedBoxesActivityFeed(userId: string) {
    // Get IDs of boxes that the current user follows
    const user = await prisma.user.findUnique({
      where: { userId },
      select: {
        followedBoxes: {
          select: {
            boxId: true
          }
        }
      }
    });

    if (!user?.followedBoxes.length) {
      return [];
    }

    const followedBoxIds = user.followedBoxes.map(f => f.boxId);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Fetch different types of box items added in parallel
    const [albums, tracks, artists, playlists] = await Promise.all([
      // Get albums added to followed boxes
      prisma.boxAlbum.findMany({
        where: {
          boxId: { in: followedBoxIds },
          createdAt: { gte: thirtyDaysAgo },
          box: {
            isPublic: true
          }
        },
        select: {
          album: true,
          box: {
            select: {
              boxId: true,
              name: true,
              creator: {
                select: {
                  userId: true,
                  username: true,
                  imageUrl: true,
                  firstName: true,
                  lastName: true
                }
              }
            }
          },
          createdAt: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      // Get tracks added to followed boxes
      prisma.boxTrack.findMany({
        where: {
          boxId: { in: followedBoxIds },
          createdAt: { gte: thirtyDaysAgo },
          box: {
            isPublic: true
          }
        },
        select: {
          track: true,
          box: {
            select: {
              boxId: true,
              name: true,
              creator: {
                select: {
                  userId: true,
                  username: true,
                  imageUrl: true,
                  firstName: true,
                  lastName: true
                }
              }
            }
          },
          createdAt: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      // Get artists added to followed boxes
      prisma.boxArtist.findMany({
        where: {
          boxId: { in: followedBoxIds },
          createdAt: { gte: thirtyDaysAgo },
          box: {
            isPublic: true
          }
        },
        select: {
          artist: true,
          box: {
            select: {
              boxId: true,
              name: true,
              creator: {
                select: {
                  userId: true,
                  username: true,
                  imageUrl: true,
                  firstName: true,
                  lastName: true
                }
              }
            }
          },
          createdAt: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      // Get playlists added to followed boxes
      prisma.boxPlaylist.findMany({
        where: {
          boxId: { in: followedBoxIds },
          createdAt: { gte: thirtyDaysAgo },
          box: {
            isPublic: true
          }
        },
        select: {
          playlist: true,
          box: {
            select: {
              boxId: true,
              name: true,
              creator: {
                select: {
                  userId: true,
                  username: true,
                  imageUrl: true,
                  firstName: true,
                  lastName: true
                }
              }
            }
          },
          createdAt: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    ]);

    // Transform and combine all activities
    const activities = [
      ...albums.map(item => ({
        type: 'BOX_ITEM_ADD' as const,
        actor: item.box.creator,
        box: { boxId: item.box.boxId, name: item.box.name },
        itemType: 'album' as const,
        item: item.album,
        timestamp: item.createdAt
      })),
      ...tracks.map(item => ({
        type: 'BOX_ITEM_ADD' as const,
        actor: item.box.creator,
        box: { boxId: item.box.boxId, name: item.box.name },
        itemType: 'track' as const,
        item: item.track,
        timestamp: item.createdAt
      })),
      ...artists.map(item => ({
        type: 'BOX_ITEM_ADD' as const,
        actor: item.box.creator,
        box: { boxId: item.box.boxId, name: item.box.name },
        itemType: 'artist' as const,
        item: item.artist,
        timestamp: item.createdAt
      })),
      ...playlists.map(item => ({
        type: 'BOX_ITEM_ADD' as const,
        actor: item.box.creator,
        box: { boxId: item.box.boxId, name: item.box.name },
        itemType: 'playlist' as const,
        item: item.playlist,
        timestamp: item.createdAt
      }))
    ];

    // Sort all activities by timestamp, most recent first
    return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  },

  async getFollowedUsersActivityFeed(userId: string) {
    // Get IDs of users that the current user follows
    const user = await prisma.user.findUnique({
      where: { userId },
      select: {
        followedUsers: {
          select: {
            followedUserId: true
          }
        }
      }
    });

    if (!user?.followedUsers.length) {
      return [];
    }

    const followedUserIds = user.followedUsers.map(f => f.followedUserId);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Fetch different types of activities in parallel
    const [userFollows, boxFollows, imageUpdates, topAlbums, newBoxes] = await Promise.all([
      // Get user follows by followed users
      prisma.userFollow.findMany({
        where: {
          followerId: { in: followedUserIds },
          createdAt: { gte: thirtyDaysAgo }
        },
        select: {
          follower: {
            select: {
              userId: true,
              username: true,
              imageUrl: true,
              firstName: true,
              lastName: true
            }
          },
          followedUser: {
            select: {
              userId: true,
              username: true,
              imageUrl: true,
              firstName: true,
              lastName: true
            }
          },
          createdAt: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      // Get box follows by followed users
      prisma.boxFollow.findMany({
        where: {
          userId: { in: followedUserIds },
          createdAt: { gte: thirtyDaysAgo },
          box: {
            isPublic: true
          }
        },
        select: {
          user: {
            select: {
              userId: true,
              username: true,
              imageUrl: true,
              firstName: true,
              lastName: true
            }
          },
          box: {
            select: {
              boxId: true,
              name: true,
              creator: {
                select: {
                  userId: true,
                  username: true,
                }
              }
            }
          },
          createdAt: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      // Get image updates by followed users
      prisma.updateUserImageAction.findMany({
        where: {
          userId: { in: followedUserIds },
          createdAt: { gte: thirtyDaysAgo }
        },
        select: {
          user: {
            select: {
              userId: true,
              username: true,
              imageUrl: true,
              firstName: true,
              lastName: true
            }
          },
          newImageUrl: true,
          createdAt: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      // Get top album updates by followed users
      prisma.userTopAlbum.findMany({
        where: {
          userId: { in: followedUserIds },
          createdAt: { gte: thirtyDaysAgo }
        },
        select: {
          user: {
            select: {
              userId: true,
              username: true,
              imageUrl: true,
              firstName: true,
              lastName: true
            }
          },
          album: true,
          position: true,
          createdAt: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      // Get newly created boxes by followed users
      prisma.box.findMany({
        where: {
          isPublic: true,
          creatorId: { in: followedUserIds },
          createdAt: { gte: thirtyDaysAgo },
          deletedAt: null
        },
        select: {
          boxId: true,
          name: true,
          creator: {
            select: {
              userId: true,
              username: true,
              imageUrl: true,
              firstName: true,
              lastName: true
            }
          },
          createdAt: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    ]);

    // Transform and combine all activities
    const activities = [
      ...userFollows.map(item => ({
        type: 'USER_FOLLOW' as const,
        actor: item.follower,
        followedUser: item.followedUser,
        timestamp: item.createdAt
      })),
      ...boxFollows.map(item => ({
        type: 'BOX_FOLLOW' as const,
        actor: item.user,
        box: { boxId: item.box.boxId, name: item.box.name, creator: item.box.creator },
        timestamp: item.createdAt
      })),
      ...imageUpdates.map(item => ({
        type: 'IMAGE_UPDATE' as const,
        actor: item.user,
        timestamp: item.createdAt
      })),
      ...topAlbums.map(item => ({
        type: 'TOP_ALBUM_UPDATE' as const,
        actor: item.user,
        item: item.album,
        timestamp: item.createdAt
      })),
      ...newBoxes.map(item => ({
        type: 'BOX_CREATE' as const,
        actor: item.creator,
        box: { boxId: item.boxId, name: item.name },
        timestamp: item.createdAt
      }))
    ];

    // Sort all activities by timestamp, most recent first
    return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
};

export default userService;