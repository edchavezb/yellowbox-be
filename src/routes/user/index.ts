import { Router } from "express";
import authenticate from "../../middleware/autenticate"
import { Prisma } from "@prisma/client";
import { SpotifyAccountDTO, UserCreateDTO } from "../../types/interfaces";
import userService from "../../services/user/userService";
import boxService from "../../services/box/boxService";
import folderService from "../../services/folder/folderService";

const routes = Router();

// TESTED
// Get the authenticated user's data
routes.get("/me", authenticate, async (req, res) => {
  const { userId } = req.user;
  const appUser = await userService.getUserData(userId);

  res.status(200).json({ appUser });
});

// TESTED
// Check if username exists
routes.get("/check-username/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const usernameExists = await userService.getUsernameExists(username);
    return res.status(201).json({ usernameExists });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// TESTED
// Check if an email exists
routes.get("/check-email/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const emailExists = await userService.getEmailExists(email);
    return res.status(201).json({ emailExists });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// TESTED
// Create a new user
routes.post("/", async (req, res) => {
  try {
    const userData: UserCreateDTO = req.body;
    const newUser = await userService.createUser(userData);

    return res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// TESTED WITHOUT AUTH
// TODO: Test with auth
routes.delete("/", authenticate, async (req, res) => {
  try {
    const userId = req.user.userId
    await userService.deleteUser(userId);

    return res.status(201).json({ message: "User deleted successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// TESTED
// Update a user's basic profile information
routes.put("/:userId/profile-information", async (req, res) => {
  try {
    const { userId } = req.params;
    const updatedInfo = req.body;
    const updatedUser = await userService.updateUserProfileInfo(userId, updatedInfo);

    return res.status(201).json(updatedUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// TESTED
// TODO: Add check to ensure url is in correct format
// Set a user's image URL
routes.put("/:userId/profile-picture", async (req, res) => {
  try {
    const { userId } = req.params;
    const { imageUrl } = req.body;
    const updatedUser = await userService.updateUserImage(userId, imageUrl);

    return res.status(201).json(updatedUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// TESTED
// Set a user's email address as verified
routes.put("/:userId/verify-email", async (req, res) => {
  try {
    const { userId } = req.params;
    const updatedUserAccountData = await userService.verifyUserEmail(userId);

    return res.status(201).json({ userAccountData: updatedUserAccountData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// TESTED
// Toggle a user's tutorial preference on or off
routes.put("/:userId/toggle-tutorial", async (req, res) => {
  try {
    const { userId } = req.params;
    const updatedUserAccountData = await userService.toggleTutorialPreference(userId);

    return res.status(201).json({ userAccountData: updatedUserAccountData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// TESTED
// Link a user to a Spotify account
routes.post("/:userId/link-account/spotify", async (req, res) => {
  try {
    const { userId } = req.params;
    const { spotifyData }: { spotifyData: SpotifyAccountDTO } = req.body;
    const updatedUserSpotifyAccount = await userService.linkSpotifyAccount(userId, spotifyData);

    return res.status(201).json(updatedUserSpotifyAccount);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// TESTED
// Unlink a user from a Spotify account
routes.delete("/:userId/unlink-account/spotify", async (req, res) => {
  try {
    const { userId } = req.params;
    await userService.unlinkSpotifyAccount(userId);

    return res.status(200).json({ message: "Spotify account unlinked successfully." });
  } catch (error) {
    console.error(error);

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') { // Record to delete does not exist
      return res.status(404).json({ error: "No linked Spotify account found for this user." });
    }

    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// TESTED
// Get a user's boxes
routes.get("/:userId/boxes", async (req, res) => {
  try {
    const { userId } = req.params;
    const boxes = await boxService.getUserBoxes(userId);

    return res.json(boxes);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// TESTED
// Get a user's dashboard boxes
routes.get("/:userId/boxes/unparented", async (req, res) => {
  try {
    const { userId } = req.params;
    const boxes = await boxService.getDashboardBoxes(userId);

    return res.json(boxes);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// TESTED
// Get a user's folders
routes.get("/:userId/folders", async (req, res) => {
  try {
    const { userId } = req.params;
    const folders = await folderService.getUserFolders(userId);

    return res.json(folders);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// TESTED
// Reorder user boxes
routes.put("/:userId/boxes/:boxId/reorder", async (req, res) => {
  try {
    const { userId, boxId } = req.params;
    const { destinationId } = req.body;

    // Get the box to be reordered
    const boxExists = await boxService.getBoxExists(boxId);
    const newPosition = await boxService.getBoxPosition(destinationId);

    if (!boxExists || !newPosition) {
      return res.status(404).json({ message: "Box not found." });
    }

    // Update the position of the box to be reordered
    await boxService.updateDashboardBoxPosition(boxId, newPosition);

    // Return the updated box
    return res.status(200).json({ message: "Box reordered successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

export default routes;
