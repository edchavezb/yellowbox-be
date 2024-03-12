import { Router } from "express";
import { extractArrayQueryParam } from "../../helpers";
import { PrismaClient } from "@prisma/client";

const routes = Router();
const prisma = new PrismaClient();

// Get a single folder by id
routes.get("/", async (req, res) => {
  try {
    const { folderId } = req.query;
    const folder = await prisma.folder.findUnique({
      where: {
        folderId: folderId as string
      },
      include: {
        creator: {
          select: {
            username: true
          }
        }
      }
    });
    return res.status(200).json({ folderData: folder, creatorName: folder?.creator?.username });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Get a group of folders that match an array of ids 
routes.get("/multiple", async (req, res) => {
  try {
    const folderIds = extractArrayQueryParam(req, 'id');
    const sortedFolders = await prisma.folder.findMany({
      where: {
        folderId: {
          in: folderIds
        }
      },
      include: {
        boxes: {
          select: {
            boxId: true,
            name: true
          }
        }
      }
    });
    return res.status(200).json(sortedFolders);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Create a folder
routes.post("/", async (req, res) => {
  try {
    const userFolder = req.body;
    const newFolder = await prisma.folder.create({
      data: userFolder
    });

    const updatedFolders = await prisma.folder.findMany({
      where: {
        creatorId: userFolder.creatorId
      },
      select: {
        folderId: true,
        name: true
      }
    });

    return res.status(201).json({ newFolder, updatedDashboardFolders: updatedFolders });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Update a folder
routes.put("/:folderId", async (req, res) => {
  try {
    const { folderId } = req.params;
    const updatedFolder = req.body;

    const result = await prisma.folder.update({
      where: {
        folderId: folderId as string
      },
      data: updatedFolder,
      include: {
        creator: {
          select: {
            username: true
          }
        }
      }
    });

    return res.status(200).json({ updatedFolder: result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Delete a folder
routes.delete("/:folderId", async (req, res) => {
  try {
    const { folderId } = req.params;
    const folder = await prisma.folder.findUnique({
      where: {
        folderId: folderId as string
      },
    });

    await prisma.folder.delete({
      where: {
        folderId: folderId as string
      },
    });

    const updatedFolders = await prisma.folder.findMany({
      where: {
        creatorId: folder?.creatorId
      },
      select: {
        folderId: true,
        name: true
      }
    });

    const updatedBoxes = await prisma.box.findMany({
      where: {
        creatorId: folder?.creatorId,
        folderId: undefined
      },
      select: {
        boxId: true,
        name: true
      }
    });

    return res.status(200).json({ updatedDashboardFolders: updatedFolders, updatedDashboardBoxes: updatedBoxes });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Add a box to a folder
routes.post("/:folderId/boxes", async (req, res) => {
  try {
    const { folderId } = req.params;
    const { boxId, folderPosition } = req.body;

    await prisma.box.update({
      where: {
        boxId: boxId as string
      },
      data: {
        folderId: folderId,
        folderPosition: folderPosition
      }
    });

    const updatedFolder = await prisma.folder.findFirst({
      where: {
        folderId: folderId as string
      },
      include: {
        boxes: {
          select: {
            boxId: true,
            name: true
          }
        }
      }
    });

    const updatedBoxes = await prisma.box.findMany({
      where: {
        creatorId: updatedFolder?.creatorId,
        folderId: undefined
      },
      select: {
        boxId: true,
        name: true
      }
    });

    return res.status(200).json({ updatedFolder, updatedDashboardBoxes: updatedBoxes });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Reorder a box within a folder
routes.put("/:folderId/reorderBox/:boxId", async (req, res) => {
  try {
    const { folderId, boxId } = req.params;
    const newPosition = parseInt(req.body.position);

    // Get the target box
    const targetBox = await prisma.box.findUnique({
      where: { boxId: boxId },
      select: { folderPosition: true }
    });

    if (!targetBox) {
      return res.status(404).json({ error: "Box not found" });
    }

    // Update the position of the target box
    await prisma.box.update({
      where: { boxId: boxId },
      data: { folderPosition: newPosition }
    });

    // Update the positions of other boxes in the same folder
    await prisma.box.updateMany({
      where: {
        folderId: folderId,
        boxId: { not: boxId }, // Exclude the target box
        position: { gte: newPosition } // Select boxes with positions greater than or equal to the target position
      },
      data: { position: { increment: 1 } } // Increment the position of selected boxes by 1
    });

    return res.status(200).json({ message: "Box reordered successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Remove a box from a folder
routes.delete("/:folderId/boxes/:boxId", async (req, res) => {
  try {
    const { folderId, boxId } = req.params;

    await prisma.box.update({
      where: {
        boxId: boxId as string
      },
      data: {
        folderId: null,
        folderPosition: null
      }
    });

    const updatedFolder = await prisma.folder.findFirst({
      where: {
        folderId: folderId as string
      },
      include: {
        boxes: {
          select: {
            boxId: true,
            name: true
          }
        }
      }
    });

    const updatedBoxes = await prisma.box.findMany({
      where: {
        creatorId: updatedFolder?.creatorId,
        folderId: undefined
      },
      select: {
        boxId: true,
        name: true
      }
    });

    return res.status(200).json({ updatedFolder, updatedDashboardBoxes: updatedBoxes });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Move a box between folders
routes.put("/:sourceFolderId/boxes/:boxId", async (req, res) => {
  try {
    const { sourceFolderId, boxId } = req.params;
    const { targetFolderId, folderPosition } = req.body;

    await prisma.box.update({
      where: {
        boxId: boxId as string
      },
      data: {
        folderId: targetFolderId,
        folderPosition: folderPosition
      }
    });

    const updatedSourceFolder = await prisma.folder.findFirst({
      where: {
        folderId: sourceFolderId as string
      },
      include: {
        boxes: {
          select: {
            boxId: true,
            name: true
          }
        }
      }
    });

    const updatedTargetFolder = await prisma.folder.findFirst({
      where: {
        folderId: targetFolderId as string
      },
      include: {
        boxes: {
          select: {
            boxId: true,
            name: true
          }
        }
      }
    });

    return res.status(200).json({ updatedSourceFolder, updatedTargetFolder });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});


export default routes;