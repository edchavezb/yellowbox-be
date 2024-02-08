import { Router } from "express";
import authenticate from "../../middleware/autenticate"
import { PrismaClient } from "@prisma/client";
import { UserCreateDTO } from "../../types/interfaces";

const prisma = new PrismaClient();
const routes = Router();

// Get the authenticated user's data
routes.get("/me", authenticate, async (req, res) => {
  res.status(200).json({ appUser: req.user });
});

// Check if username exists
routes.get("/check/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const usernameCount = await prisma.user.count({
      where: {
        username: username
      }
    });
    return res.status(201).json({ usernameExists: !!usernameCount });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Create a new user
routes.post("/", async (req, res) => {
  try {
    const userData: UserCreateDTO = req.body;
    const newUser = await prisma.user.create({
      data: {
        firebase_id: userData.firebaseId,
        username: userData.username,
        first_name: userData.firstName,
        last_name: userData.lastName,
        image_url: userData.image,
        linked_services: userData.services
      }
    });

    // Use the user_id to create user billing and user account management data
    await prisma.$transaction([
      prisma.userBilling.create({
        data: {
          user_id: newUser.user_id
        }
      }),
      prisma.userAccountManagementData.create({
        data: {
          user_id: newUser.user_id,
          email: userData.email
        }
      })
    ]);

    return res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Update a user
routes.put("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const userData = req.body;

    const updatedUser = await prisma.user.update({
      where: {
        user_id: userId
      },
      data: userData
    });
    return res.status(201).json(updatedUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Set a user's email address as verified
routes.put("/:userId/verifyEmail", async (req, res) => {
  try {
    const { userId } = req.params;

    const updatedUser = await prisma.userAccountManagementData.update({
      where: {
        user_id: userId
      },
      data: {
        email_verified: true
      }
    });
    return res.status(201).json(updatedUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Link a user to a Spotify account
routes.post("/:userId/spotify", async (req, res) => {
  try {
    const { userId } = req.params;
    const { spotifyData } = req.body;

    const updatedUser = await prisma.user.update({
      where: {
        user_id: userId
      },
      data: {
        linked_services: {
          set: {
            spotify: spotifyData
          }
        }
      }
    });
    return res.status(201).json(updatedUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Link a user to a LastFM account
routes.post("/:userId/lastfm", async (req, res) => {
  try {
    const { userId } = req.params;
    const { lastfmData } = req.body;

    const updatedUser = await prisma.user.update({
      where: {
        user_id: userId
      },
      data: {
        linked_services: {
          set: {
            lastfm: lastfmData
          }
        }
      }
    });
    return res.status(201).json(updatedUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Get a user's created boxes
routes.get("/:userId/boxes", async (req, res) => {
  try {
    const { userId } = req.params;
    const boxes = await prisma.box.findMany({
      where: {
        AND: [
          { creator_id: userId },
          { NOT: { is_deleted: true } }
        ]
      },
      select: {
        box_id: true,
        name: true
      }
    });
    return res.json(boxes);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Get a user's created folders
routes.get("/:userId/folders", async (req, res) => {
  try {
    const { userId } = req.params;
    const folders = await prisma.folder.findMany({
      where: {
        creator_id: userId
      }
    });
    return res.json(folders);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

export default routes;
