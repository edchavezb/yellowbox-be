import { Router } from "express";
import { SectionSorting } from "../../types/interfaces";
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
          box_id: boxId as string,
          is_deleted: false
        }
      },
      select: {
        box_id: true,
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
        box_id: {
          in: boxIds
        }
      },
      select: {
        box_id: true,
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
    const userBox = req.body;
    const newBox = await prisma.box.create({
      data: userBox
    });
    return res.status(201).json({ boxId: newBox.box_id, boxName: newBox.name });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Update a box
routes.put("/:boxId", async (req, res) => {
  try {
    const { boxId } = req.params;
    const replacementBox = req.body;

    const updatedBox = await prisma.box.update({
      where: {
        box_id: boxId
      },
      data: replacementBox
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
    const { containingFolder, folderId } = req.body;
    const updatedBox = await prisma.box.update({
      where: {
        box_id: boxId
      },
      data: {
        is_deleted: true,
        folder_id: null
      }
    });
    if (containingFolder) {
      const updatedFolder = await prisma.folder.findFirst({
        where: {
          folder_id: folderId
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
      return res.status(201).json(updatedFolder);
    } else {
      const updatedUser = await prisma.user.findFirst({
        where: {
          user_id: updatedBox.creator_id
        },
        include: {
          boxes: {
            where: {
              folder_id: null
            },
            select : {
              box_id: true,
              name: true
            }
          }
        }
      });
      return res.status(201).json(updatedUser);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Clone a box
routes.post("/:boxId/clone", async (req, res) => {
  try {
    const { boxId } = req.params;
    const { name, description, isPublic, creator } = req.body;

    const originalBox = await prisma.box.findUnique({
      where: {
        box_id: boxId
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
        is_public: isPublic,
        creator
      }
    });

    return res.status(201).json({ boxId: newBox.box_id, boxName: newBox.name });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Update a box's information
routes.put("/:boxId/boxInfo", async (req, res) => {
  try {
    const { boxId } = req.params;
    const { name, isPublic, description } = req.body;

    const updatedBox = await prisma.box.update({
      where: {
        box_id: boxId
      },
      data: {
        name,
        is_public: isPublic,
        description
      }
    });

    return res.status(201).json(updatedBox);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Update a box's section sorting settings
routes.put("/:boxId/sectionSettings", async (req, res) => {
  try {
    const { boxId } = req.params;
    const updatedSorting = req.body;

    const updatedBoxSectionSettings = await prisma.boxSectionSettings.update({
      where: {
        box_id: boxId
      },
      data: updatedSorting
    });

    return res.status(201).json(updatedBoxSectionSettings);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Add a note to the notes in a box. Not needed as notes are added to items directly now.
// routes.post("/:boxId/notes", async (req, res) => {
//   try {
//     const { boxId } = req.params;
//     const updatedBox = await prisma.box.update({
//       where: {
//         id: parseInt(boxId)
//       },
//       data: {
//         notes: {
//           push: req.body
//         }
//       },
//       select: {
//         notes: true
//       }
//     });
//     return res.status(201).json(updatedBox.notes);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Sorry, something went wrong :/" });
//   }
// });

// Edit a note in a box. Not needed as notes are added to items directly now.
// routes.put("/:boxId/notes/:noteId", async (req, res) => {
//   try {
//     const { boxId, noteId } = req.params;
//     const { noteText } = req.body;
//     const updatedBox = await prisma.box.update({
//       where: {
//         id: parseInt(boxId)
//       },
//       data: {
//         notes: {
//           update: {
//             where: {
//               id: parseInt(noteId)
//             },
//             data: {
//               noteText
//             }
//           }
//         }
//       },
//       select: {
//         notes: true
//       }
//     });
//     return res.status(201).json(updatedBox.notes);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Sorry, something went wrong :/" });
//   }
// });

// Add a subsection to a box
routes.post("/:boxId/subsections", async (req, res) => {
  try {
    const { boxId } = req.params;
    const { itemType, name, position } = req.body
    await prisma.boxSubsection.create({
      data: {
        box_id: boxId,
        item_type: itemType,     
        subsection_name: name,
        position: position
      }
    });

    const updatedSubsections = prisma.boxSubsection.findMany({
      where: {
        box_id: boxId
      }
    })

    return res.status(201).json(updatedSubsections);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Endpoint to reorder a subsection within a box
routes.put("/:boxId/reorderSubsection/:subsectionId", async (req, res) => {
  try {
    const { boxId, subsectionId } = req.params;
    const newPosition = parseInt(req.body.position);

    // Get the target subsection
    const targetSubsection = await prisma.boxSubsection.findUnique({
      where: { subsection_id: parseInt(subsectionId) },
      select: { position: true }
    });

    if (!targetSubsection) {
      return res.status(404).json({ error: "Subsection not found" });
    }

    // Update the position of the target subsection
    await prisma.boxSubsection.update({
      where: { subsection_id: parseInt(subsectionId) },
      data: { position: newPosition }
    });

    // Update the positions of other subsections in the same box
    await prisma.boxSubsection.updateMany({
      where: {
        box_id: boxId,
        subsection_id: { not: parseInt(subsectionId) }, // Exclude the target subsection
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

// Edit a subsection's name
routes.put("/subsections/:subsectionId", async (req, res) => {
  try {
    const { subsectionId, boxId } = req.params;
    const { name } = req.body;
    await prisma.boxSubsection.update({
      where: {
        subsection_id: parseInt(subsectionId)
      },
      data: {
        subsection_name: name
      }
    });

    const updatedSubsections = prisma.boxSubsection.findMany({
      where: {
        box_id: boxId
      }
    })

    return res.status(201).json(updatedSubsections);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Reorder items in a subsection
// routes.put('/:boxId/subsections/:subsectionId/reorder', async (req, res) => {
//   try {
//     const { boxId, subsectionId } = req.params;
//     const { sourceIndex, destinationIndex } = req.body;

//     const box = await prisma.box.findUnique({
//       where: {
//         id: parseInt(boxId)
//       },
//       include: {
//         subSections: true
//       }
//     });

//     if (!box) {
//       return res.status(404).json({ message: 'Box not found.' });
//     }

//     const subsection = box.subSections.find(sub => sub.id === parseInt(subsectionId));
//     if (!subsection) {
//       throw new Error('Subsection not found.');
//     }

//     const targetItem = subsection.items.splice(sourceIndex, 1)[0];
//     subsection.items.splice(destinationIndex, 0, targetItem);

//     const updatedBox = await prisma.box.update({
//       where: {
//         id: parseInt(boxId)
//       },
//       data: {
//         subSections: box.subSections
//       },
//       select: {
//         subSections: true
//       }
//     });

//     res.status(200).json({ message: 'Items in the subsection reordered successfully.', updatedSubsections: updatedBox.subSections });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Something went wrong.' });
//   }
// });

// Delete a subsection
routes.delete("/:boxId/subsections/:subsectionId", async (req, res) => {
  try {
    const { boxId, subsectionId } = req.params;

    await prisma.boxSubsection.delete({
      where: {
        subsection_id: parseInt(subsectionId)
      }
    });

    const updatedSubsections = prisma.boxSubsection.findMany({
      where: {
        box_id: boxId
      }
    })

    return res.status(201).json(updatedSubsections);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

export default routes;