import { Router } from "express";
import { BoxCreateDTO, SectionSorting } from "../../types/interfaces";
import { extractArrayQueryParam } from "../../helpers";
import { PrismaClient } from "@prisma/client";

const routes = Router();
const prisma = new PrismaClient();

// Get a single box by id
routes.get("/", async (req, res) => {
  try {
    const { boxId } = req.query;
    const box = await prisma.box.findFirst({
      where: {
        AND: {
          boxId: boxId as string,
          isDeleted: false
        }
      },
      select: {
        boxId: true,
        name: true,
        description: true,
        creator: true
      }
    });
    return res.status(200).json({ boxData: box, creatorName: box?.creator?.username });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Get a group of boxes that match an array of ids 
routes.get("/multiple", async (req, res) => {
  try {
    const boxIds = extractArrayQueryParam(req, 'id');
    const sortedBoxes = await prisma.box.findMany({
      where: {
        boxId: {
          in: boxIds
        }
      },
      select: {
        boxId: true,
        name: true
      }
    });
    return res.status(200).json(sortedBoxes);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Create a box
routes.post("/", async (req, res) => {
  try {
    const userBox: BoxCreateDTO = req.body;
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
    return res.status(201).json({ boxId: newBox.boxId, boxName: newBox.name });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Update a box's details
routes.put("/:boxId/box-details", async (req, res) => {
  try {
    const { boxId } = req.params;
    const { name, description, isPublic } = req.body;

    const updatedBox = await prisma.box.update({
      where: {
        boxId: boxId
      },
      data: {
        name,
        description,
        isPublic
      }
    });

    return res.status(201).json(updatedBox);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Delete a box
routes.put("/:boxId/delete", async (req, res) => {
  try {
    const { boxId } = req.params;
    const { folderId } = req.body;
    let updatedFolder: {} | null = {};

    const updatedBox = await prisma.box.update({
      where: {
        boxId: boxId
      },
      data: {
        isDeleted: true,
        folderId: null
      }
    });

    if (folderId) {
      updatedFolder = await prisma.folder.findFirst({
        where: {
          folderId: folderId
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
    }

    const updatedUser = await prisma.user.findFirst({
      where: {
        userId: updatedBox?.creatorId!
      },
      include: {
        boxes: {
          where: {
            folderId: null,
            isDeleted: false
          },
          select: {
            boxId: true,
            name: true
          }
        }
      }
    })
    return res.status(201).json({ updatedUser, updatedFolder: updatedFolder || {} });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// UNTESTED
// Clone a box
routes.post("/:boxId/clone", async (req, res) => {
  try {
    const { boxId } = req.params;
    const { name, description, isPublic, creator } = req.body;

    const originalBox = await prisma.box.findUnique({
      where: {
        boxId: boxId
      }
    });

    if (!originalBox) {
      return res.status(404).json({ message: "Box not found." });
    }

    const newBox = await prisma.box.create({
      data: {
        ...originalBox,
        name,
        description,
        isPublic: isPublic,
        creator
      }
    });

    return res.status(201).json({ boxId: newBox.boxId, boxName: newBox.name });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// UNTESTED
// Update a box's section sorting settings
routes.put("/:boxId/section-settings/:type", async (req, res) => {
  try {
    const { boxId, type } = req.params;
    const updatedSorting = req.body;

    const updatedBoxSectionSettings = await prisma.boxSectionSettings.updateMany({
      where: {
        AND: {
          boxId: boxId as string,
          type: type
        }
      },
      data: updatedSorting
    });

    return res.status(201).json(updatedBoxSectionSettings);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// UNTESTED
// Add a subsection to a box
routes.post("/:boxId/subsections", async (req, res) => {
  try {
    const { boxId } = req.params;
    const { itemType, name, position } = req.body
    await prisma.boxSubsection.create({
      data: {
        boxId: boxId,
        itemType: itemType,
        subsectionName: name,
        position: position
      }
    });

    const updatedSubsections = prisma.boxSubsection.findMany({
      where: {
        boxId: boxId
      }
    })

    return res.status(201).json(updatedSubsections);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// UNTESTED
// Reorder a subsection within a box
routes.put("/:boxId/reorderSubsection/:subsectionId", async (req, res) => {
  try {
    const { boxId, subsectionId } = req.params;
    const newPosition = parseInt(req.body.position);

    // Get the target subsection
    const targetSubsection = await prisma.boxSubsection.findUnique({
      where: { subsectionId: parseInt(subsectionId) },
      select: { position: true }
    });

    if (!targetSubsection) {
      return res.status(404).json({ error: "Subsection not found" });
    }

    // Update the position of the target subsection
    await prisma.boxSubsection.update({
      where: { subsectionId: parseInt(subsectionId) },
      data: { position: newPosition }
    });

    // Update the positions of other subsections in the same box
    await prisma.boxSubsection.updateMany({
      where: {
        boxId: boxId,
        subsectionId: { not: parseInt(subsectionId) }, // Exclude the target subsection
        position: { gte: targetSubsection.position } // Select subsections with positions greater than or equal to the target position
      },
      data: { position: { increment: 1 } } // Increment the position of selected subsections by 1
    });

    return res.status(200).json({ message: "Subsection reordered successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// UNTESTED
// Edit a subsection's name
routes.put("/subsections/:subsectionId", async (req, res) => {
  try {
    const { subsectionId, boxId } = req.params;
    const { name } = req.body;
    await prisma.boxSubsection.update({
      where: {
        subsectionId: parseInt(subsectionId)
      },
      data: {
        subsectionName: name
      }
    });

    const updatedSubsections = prisma.boxSubsection.findMany({
      where: {
        boxId: boxId
      }
    })

    return res.status(201).json(updatedSubsections);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// UNTESTED
// Delete a subsection
routes.delete("/:boxId/subsections/:subsectionId", async (req, res) => {
  try {
    const { boxId, subsectionId } = req.params;

    await prisma.boxSubsection.delete({
      where: {
        subsectionId: parseInt(subsectionId)
      }
    });

    const updatedSubsections = prisma.boxSubsection.findMany({
      where: {
        boxId: boxId
      }
    })

    return res.status(201).json(updatedSubsections);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

export default routes;