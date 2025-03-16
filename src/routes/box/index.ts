import { Router } from "express";
import { BoxCreateDTO } from "../../types/interfaces";
import { PrismaClient } from "@prisma/client";
import authenticate from "../../middleware/autenticate"
import subsectionService from "../../services/box/subsectionService";
import boxService from "../../services/box/boxService";
import userService from "../../services/user/userService";
import folderService from "../../services/folder/folderService";

const routes = Router();
const prisma = new PrismaClient();

// TESTED - Id moved to params, not query
// Get a single box by id
routes.get("/:boxId", async (req, res) => {
  try {
    const { boxId } = req.params;

    const boxData = await boxService.getBoxById(boxId);
    if (!boxData) {
      return res.status(404).json({ error: "Box not found" });
    }

    return res.status(200).json({
      boxData
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// TESTED
// Create a box
routes.post("/", async (req, res) => {
  try {
    const userBox: BoxCreateDTO = req.body;
    const newBox = await boxService.createBox(userBox);
    return res.status(201).json(newBox);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// TESTED
// Update a box's details
routes.put("/:boxId/box-details", async (req, res) => {
  try {
    const { boxId } = req.params;
    const updatedDetails = req.body;

    const updatedBox = await boxService.updateBoxDetails(boxId, updatedDetails);

    return res.status(201).json(updatedBox);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// TESTED W/O AUTH
// Delete a box
routes.put("/:boxId/delete", authenticate, async (req, res) => {
  try {
    const { boxId } = req.params;
    const { folderId } = req.body;
    let updatedFolder: {} | null = {};

    const updatedBox = await boxService.deleteBox(boxId);
    if (folderId) {
      updatedFolder = await folderService.getDashboardFolder(folderId);
    }
    const updatedUser = await userService.getUserWithDashboardBoxes(updatedBox.creatorId!);

    return res.status(201).json({ updatedUser, updatedFolder: updatedFolder || {} });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// TESTED W/O AUTH
// Undo deletion of a box
routes.put("/:boxId/undo-delete", authenticate, async (req, res) => {
  try {
    const { boxId } = req.params;
    const { userId } = req.user;

    // Find the highest position among boxes where folderId is null and deletedAt is null
    const maxPosition = await boxService.getMaxPositionDashboard(userId);

    // Determine the new position value: max position + 1, or default to 1 if no boxes exist
    const newPosition = (maxPosition ?? 0) + 1;

    // Update the box: undo deletion and set its position to the new value
    const restoredBox = await boxService.undoDeleteBox(boxId, newPosition);

    // Fetch the updated set of boxes where folderId is null
    const updatedBoxes = boxService.getDashboardBoxes(userId);

    // Return the restored box and the updated set of boxes
    return res.status(200).json({ restoredBox, updatedDashboardBoxes: updatedBoxes });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// TESTED
// Update a box's section sorting settings by type
routes.put("/:boxId/section-settings/:type", async (req, res) => {
  try {
    const { boxId, type } = req.params;
    const updatedSettings = req.body;

    await boxService.updateBoxSectionSettings(boxId, type, updatedSettings);
    const updatedBox = await boxService.getBoxById(boxId);

    return res.status(201).json({updatedBox});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// UNTESTED
// Update all section sorting settings in a box
routes.put("/:boxId/section-settings", async (req, res) => {
  try {
    const { boxId } = req.params;
    const updatedSettings = req.body;

    await boxService.updateAllBoxSectionSettings(boxId, updatedSettings);
    const updatedBox = await boxService.getBoxById(boxId);

    return res.status(201).json({updatedBox});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});


// TESTED
// Add a subsection to a box
routes.post("/:boxId/subsections", async (req, res) => {
  try {
    const { boxId } = req.params;
    const subSectionData = req.body
    await subsectionService.createSubsection(boxId, subSectionData);

    const updatedSubsections = await subsectionService.getUpdatedSubsections(boxId);

    return res.status(201).json(updatedSubsections);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// TESTED
// Reorder a subsection within a box
routes.put("/:boxId/subsections/:subsectionId/reorder", async (req, res) => {
  try {
    const { boxId, subsectionId } = req.params;
    const {destinationId} = req.body;

    // Get the target subsection
    const targetSubsection = await subsectionService.getSubsectionSimple(subsectionId);
    const destinationSubsection = await subsectionService.getSubsectionSimple(destinationId);

    if (!targetSubsection || !destinationSubsection) {
      return res.status(404).json({ error: "Subsection not found" });
    }

    const newPosition = destinationSubsection.position;
    // Update the position of the target subsection
    await subsectionService.updateSubsectionPosition(subsectionId, newPosition);

    return res.status(200).json({ message: "Subsection reordered successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// TESTED
// Edit a subsection's name
routes.put("/:boxId/subsections/:subsectionId/name", async (req, res) => {
  try {
    const { subsectionId, boxId } = req.params;
    const { name } = req.body;
    await subsectionService.updateSubsectionName(subsectionId, name);

    const updatedSubsections = await subsectionService.getUpdatedSubsections(boxId);

    return res.status(201).json(updatedSubsections);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// TESTED
// Delete a subsection
routes.delete("/:boxId/subsections/:subsectionId", async (req, res) => {
  try {
    const { boxId, subsectionId } = req.params;
    await subsectionService.deleteSubsection(subsectionId);

    const updatedBox = await boxService.getBoxById(boxId);

    return res.status(201).json(updatedBox);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// TESTED
// Clone a box
routes.post("/:boxId/clone", async (req, res) => {
  try {
    const { boxId } = req.params;
    const { name, description, isPublic, creator } = req.body;

    // Fetch the original box and related records
    const originalBox = await prisma.box.findUnique({
      where: { boxId: boxId },
      include: {
        artists: true,
        tracks: true,
        albums: true,
        playlists: true,
        subsections: {
          include: {
            artists: true,
            albums: true,
            tracks: true,
            playlists: true
          }
        },
        sectionSettings: true, // Include sectionSettings
      }
    });

    if (!originalBox) {
      return res.status(404).json({ message: "Box not found." });
    }

    // Find the greatest position value for boxes created by the same user
    const maxPosition = await boxService.getMaxPositionDashboard(originalBox.creatorId!);
    const newPosition = (maxPosition || 0) + 1;

    // Clone the main box
    const newBox = await prisma.box.create({
      data: {
        name,
        description,
        isPublic,
        creator: { connect: { userId: creator } },
        position: newPosition,
      }
    });

    const { boxId: newBoxId, position, folderId, folderPosition, name: newBoxName }  = newBox;
    const boxItemsMap = await boxService.cloneBoxItems(originalBox, newBoxId);
    await boxService.cloneBoxSubsections(originalBox, newBoxId, boxItemsMap);
    await boxService.cloneBoxSectionSettings(originalBox, newBoxId);

    return res.status(201).json({ boxId: newBoxId, name: newBoxName, position, folderId, folderPosition });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// UNTESTED
// Move boxes deleted for more than a week to DeletedBox table
routes.post("/archive-deleted-boxes", async (req, res) => {
  try {
    // Get the current date minus one week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    // Find all boxes that have been deleted for more than a week
    const oldDeletedBoxes = await prisma.box.findMany({
      where: {
        deletedAt: {
          lte: oneWeekAgo
        }
      },
      include: {
        artists: true,          // Include related artists
        tracks: true,           // Include related tracks
        albums: true,           // Include related albums
        playlists: true,        // Include related playlists
        subsections: true,      // Include related subsections
        sectionSettings: true,  // Include related section settings
        creator: true,          // Include creator (User)
        folder: true            // Include folder if necessary
      }
    });

    // If there are no boxes to archive, return early
    if (oldDeletedBoxes.length === 0) {
      return res.status(200).json({ message: "No boxes to archive." });
    }

    // Prepare the box data to be inserted into DeletedBox
    const deletedBoxData = oldDeletedBoxes.map((box) => ({
      boxData: box, // Store the entire box along with related data as JSON
      deletedAt: box.deletedAt!
    }));

    // Move the old deleted boxes to the DeletedBox table
    await prisma.deletedBox.createMany({
      data: deletedBoxData
    });

    // Remove the old deleted boxes from the box table
    await prisma.box.deleteMany({
      where: {
        deletedAt: {
          lte: oneWeekAgo
        }
      }
    });

    return res.status(200).json({ message: "Archived and removed old deleted boxes." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

export default routes;