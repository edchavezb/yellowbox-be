import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const userService = {
  async getMyUserData(userId: string) {
    const user = await prisma.user.findFirst({
      where: {
        userId
      },
      include: {
        boxes: {
          where: {
            deletedAt: null
          },
          select: {
            boxId: true,
            name: true,
            position: true,
            folderPosition: true,
            folderId: true,
            isPublic: true
          },
          orderBy: {
            position: 'asc'
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
                deletedAt: null
              },
              select: {
                boxId: true,
                name: true,
                position: true,
                folderPosition: true,
                isPublic: true
              },
              orderBy: {
                folderPosition: 'asc'
              }
            }
          }
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
                lastName: true
              }
            }
          }
        },
        followers: {
          select: {
            createdAt: true,
            followedUser: {
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
        followedBoxes: {
          select: {
            createdAt: true,
            box: {
              select: {
                boxId: true,
                name: true,
                isPublic: true,
                folderId: true,
                folderPosition: true,
                position: true,
                creator: {
                  select: {
                    userId: true,
                    username: true,
                  },
                },
              }
            }
          }
        },
        billing: true,
        accountData: true,
        spotifyAccount: true
      }
    });

    return user;
  },
  async getUserDataById(userId: string) {
    const user = await prisma.user.findUnique({
      where: {
        userId,
      },
      include: {
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
    const {firstName, lastName} = updatedInfo;
    const updatedUser = await prisma.user.update({
      where: {
        userId
      },
      data: {
        firstName,
        lastName
      }
    });

    return updatedUser;
  },
  async updateUserImage(userId: string, imageUrl: string) {
    const updatedUser = await prisma.user.update({
      where: {
        userId
      },
      data: {
        imageUrl
      }
    });

    return updatedUser;
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
    const {refreshToken, spotifyId} = spotifyData;
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
};

export default userService;