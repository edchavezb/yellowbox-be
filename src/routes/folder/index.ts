import { Router } from "express";
import { FolderCreateDTO } from "../../types/interfaces";
import folderService from "../../services/folder/folderService";
import boxService from "../../services/box/boxService";

const routes = Router();

// Get a single folder by id
routes.get("/:folderId", async (req, res) => {
  try {
    const { folderId } = req.params;
    const folder = await folderService.getFolderById(folderId);
    return res.status(200).json({ folderData: folder, creatorName: folder?.creator?.username });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Create a folder
routes.post("/", async (req, res) => {
  try {
    const userFolder: FolderCreateDTO = req.body;
    const { creator, ...folderData } = userFolder;
    const newFolder = await folderService.createFolder(folderData, creator);
    const updatedFolders = await folderService.getUserFolders(newFolder.creatorId);

    return res.status(201).json({ newFolder: {...newFolder, boxes: []}, updatedDashboardFolders: updatedFolders });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Update a folder
routes.put("/:folderId/folder-details", async (req, res) => {
  try {
    const { folderId } = req.params;
    const updatedDetails = req.body;

    const updatedFolder = await folderService.updateFolderDetails(folderId, updatedDetails);

    return res.status(200).json({ updatedFolder });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Delete a folder
routes.delete("/:folderId", async (req, res) => {
  try {
    const { folderId } = req.params;
    const folder = await folderService.getFolderById(folderId);

    await folderService.deleteFolder(folderId);
    const updatedFolders = await folderService.getUserFolders(folder!.creatorId);
    const updatedBoxes = await boxService.getDashboardBoxes(folder!.creatorId);

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

    await boxService.addBoxToFolder(boxId, folderId, folderPosition);
    const updatedFolder = await folderService.getFolderById(folderId);
    const updatedBoxes = await boxService.getDashboardBoxes(updatedFolder!.creatorId);

    return res.status(200).json({ updatedFolder, updatedDashboardBoxes: updatedBoxes });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Reorder a box within a folder
routes.put("/:folderId/reorder-box/:boxId", async (req, res) => {
  try {
    const { folderId, boxId } = req.params;
    const newPosition = parseInt(req.body.position);

    // Get the target box
    const targetBox = await boxService.getBoxExists(boxId);

    if (!targetBox) {
      return res.status(404).json({ error: "Box not found" });
    }

    // Update the position of the target box
    await boxService.updateFolderBoxPosition(boxId, newPosition);

    // Update the positions of other boxes in the same folder
    await boxService.incrementSubsequentFolderBoxPositions(boxId, folderId, newPosition);

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
    const { userId } = req.body;

    // Find the highest position among boxes with folderId set to null
    const maxPositionDashboard = await boxService.getMaxPositionDashboard(userId);

    // Determine the new position value: max position + 1, or default to 1 if no boxes exist
    const newPosition = (maxPositionDashboard ?? 0) + 1;
    await boxService.removeBoxFromFolder(boxId, newPosition);

    const updatedFolder = await folderService.getDashboardFolder(folderId);
    const updatedBoxes = await boxService.getDashboardBoxes(userId);

    return res.status(200).json({ updatedFolder, updatedDashboardBoxes: updatedBoxes });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Move a box between folders
routes.put("/:sourceFolderId/boxes/:boxId/change-folder", async (req, res) => {
  try {
    const { sourceFolderId, boxId } = req.params;
    const { targetFolderId, folderPosition } = req.body;

    await boxService.addBoxToFolder(boxId, targetFolderId, folderPosition);
    const updatedSourceFolder = await folderService.getDashboardFolder(sourceFolderId);
    const updatedTargetFolder = await folderService.getDashboardFolder(targetFolderId);

    return res.status(200).json({ updatedSourceFolder, updatedTargetFolder });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});


export default routes;