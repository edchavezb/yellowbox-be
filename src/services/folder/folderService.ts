import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const folderService = {
  async getDashboardFolder(folderId: string) {
    const folder = await prisma.folder.findFirst({
      where: {
        folderId
      },
      include: {
        boxes: {
          select: {
            boxId: true,
            name: true,
            folderPosition: true
          }
        }
      }
    });

    return folder;
  },
  async getFolderById(folderId: string) {
    const folder = await prisma.folder.findUnique({
      where: {
        folderId: folderId as string
      },
      include: {
        creator: {
          select: {
            username: true
          }
        },
        boxes: {
          select: {
            boxId: true,
            name: true,
            position: true,
            folderPosition: true
          }
        }
      }
    });

    return folder;
  },
  async getFolderExists(folderId: string) {
    const folder = await prisma.folder.findUnique({
      where: {
        folderId: folderId as string
      },
    });

    return !!folder;
  },
  async getUserFolders(creatorId: string) {
    const dashboardFolders = await prisma.folder.findMany({
      where: {
        creatorId
      },
      include: {
        boxes: {
          select: {
            boxId: true,
            name: true,
            folderPosition: true
          }
        }
      }
    });

    return dashboardFolders;
  },
  async createFolder(folderData: any, creatorId: string) {
    const newFolder = await prisma.folder.create({
      data: {
        ...folderData,
        creator: { connect: { userId: creatorId } }
      }
    });

    return newFolder;
  },
  async updateFolderDetails(folderId: string, updatedDetails: any) {
    const { name, description, isPublic } = updatedDetails;
    const updatedFolder = await prisma.folder.update({
      where: {
        folderId: folderId as string
      },
      data: {
        name,
        description,
        isPublic
      },
      include: {
        creator: {
          select: {
            username: true
          }
        }
      }
    });

    return updatedFolder;
  },
  async deleteFolder(folderId: string) {
    await prisma.folder.delete({
      where: {
        folderId: folderId
      },
    });
  }
};

export default folderService;
