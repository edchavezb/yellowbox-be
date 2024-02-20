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
        folder_id: folderId as string
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
        folder_id: {
          in: folderIds
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
        creator_id: userFolder.creator_id
      },
      select: {
        folder_id: true,
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
        folder_id: folderId as string
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
        folder_id: folderId as string
      },
    });

    await prisma.folder.delete({
      where: {
        folder_id: folderId as string
      },
    });

    const updatedFolders = await prisma.folder.findMany({
      where: {
        creator_id: folder?.creator_id
      },
      select: {
        folder_id: true,
        name: true
      }
    });

    const updatedBoxes = await prisma.box.findMany({
      where: {
        creator_id: folder?.creator_id,
        folder_id: undefined
      },
      select: {
        box_id: true,
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
    const { boxId } = req.body;

    await prisma.box.update({
      where: {
        box_id: boxId as string
      },
      data: {
        folder_id: folderId
      }
    });

    const updatedFolder = await prisma.folder.findFirst({
      where: {
        folder_id: folderId as string
      },
      include: {
        boxes: {
          select: {
            box_id: true,
            name: true
          }
        }
      }
    });

    const updatedBoxes = await prisma.box.findMany({
      where: {
        creator_id: updatedFolder?.creator_id,
        folder_id: undefined
      },
      select: {
        box_id: true,
        name: true
      }
    });

    return res.status(200).json({ updatedFolder, updatedDashboardBoxes: updatedBoxes });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Update a folder's boxes. Only used to reorder boxes within a folder so need to update it
// routes.put("/:folderId/boxes", async (req, res) => {
//   try {
//     const { folderId } = req.params;
//     const { updatedItems } = req.body;

//     const updatedFolder = await prisma.folder.update({
//       where: {
//         folder_id: folderId as string
//       },
//       data: {
//         boxes: updatedItems
//       }
//     });

//     return res.status(200).json({ updatedFolder });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Sorry, something went wrong :/" });
//   }
// });

// Update a folder box's name. No longer necessary. Just need to refetch boxes in a folder when the box name is updated.
// routes.put("/:folderId/boxes/:boxId", async (req, res) => {
//   try {
//     const { folderId, boxId } = req.params;
//     const { name } = req.body;

//     const updatedFolder = await prisma.folder.update({
//       where: {
//         folder_id: folderId as string
//       },
//       data: {
//         boxes: {
//           update: {
//             where: {
//               box_id: boxId
//             },
//             data: {
//               box_name: name
//             }
//           }
//         }
//       }
//     });

//     return res.status(200).json({ updatedFolder });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Sorry, something went wrong :/" });
//   }
// });

// Remove a box from a folder
routes.delete("/:folderId/boxes/:boxId", async (req, res) => {
  try {
    const { folderId, boxId } = req.params;

    await prisma.box.update({
      where: {
        box_id: boxId as string
      },
      data: {
        folder_id: null
      }
    });

    const updatedFolder = await prisma.folder.findFirst({
      where: {
        folder_id: folderId as string
      },
      include: {
        boxes: {
          select: {
            box_id: true,
            name: true
          }
        }
      }
    });

    const updatedBoxes = await prisma.box.findMany({
      where: {
        creator_id: updatedFolder?.creator_id,
        folder_id: undefined
      },
      select: {
        box_id: true,
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
routes.put("/:sourceId/boxes/:boxId", async (req, res) => {
  try {
    const { sourceId, boxId } = req.params;
    const { targetId } = req.body;

    await prisma.box.update({
      where: {
        box_id: boxId as string
      },
      data: {
        folder_id: targetId
      }
    });

    const updatedSourceFolder = await prisma.folder.findFirst({
      where: {
        folder_id: sourceId as string
      },
      include: {
        boxes: {
          select: {
            box_id: true,
            name: true
          }
        }
      }
    });

    const updatedTargetFolder = await prisma.folder.findFirst({
      where: {
        folder_id: targetId as string
      },
      include: {
        boxes: {
          select: {
            box_id: true,
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