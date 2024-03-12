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
routes.get("/check-username/:username", async (req, res) => {
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
        firebaseId: userData.firebaseId,
        username: userData.username,
        firstName: userData.firstName,
        lastName: userData.lastName,
        imageUrl: userData.image,
        linkedServices: userData.services
      }
    });

    // Use the userId to create user billing and user account management data
    await prisma.$transaction([
      prisma.userBilling.create({
        data: {
          userId: newUser.userId
        }
      }),
      prisma.userAccountManagementData.create({
        data: {
          userId: newUser.userId,
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

// Delete a user
routes.delete("/", authenticate, async (req, res) => {
  try {
    await prisma.user.delete({
      where: {
        userId: req.user.userId
      }
    });

    return res.status(201).json({message: "User deleted successfully."});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Update a user's name information
routes.put("/:userId/name", async (req, res) => {
  try {
    const { userId } = req.params;
    const {firstName, lastName} = req.body;

    const updatedUser = await prisma.user.update({
      where: {
        userId: userId
      },
      data: {
        firstName: firstName,
        lastName: lastName
      }
    });
    return res.status(201).json(updatedUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// UNTESTED
// Set a user's image URL
routes.put("/:userId/image", async (req, res) => {
  try {
    const { userId } = req.params;
    const { imageUrl } = req.body;

    const updatedUser = await prisma.user.update({
      where: {
        userId: userId
      },
      data: {
        imageUrl: imageUrl
      }
    });
    return res.status(201).json(updatedUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Set a user's email address as verified
routes.put("/:userId/verify-email", async (req, res) => {
  try {
    const { userId } = req.params;

    const updatedUser = await prisma.userAccountManagementData.update({
      where: {
        userId: userId
      },
      data: {
        emailVerified: true
      }
    });
    return res.status(201).json(updatedUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// UNTESTED
// Link a user to a Spotify account
routes.post("/:userId/link-account/spotify", async (req, res) => {
  try {
    const { userId } = req.params;
    const { spotifyData } = req.body;

    const updatedUser = await prisma.user.update({
      where: {
        userId: userId
      },
      data: {
        linkedServices: {
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

// UNTESTED
// Link a user to a LastFM account
routes.post("/:userId/link-account/lastfm", async (req, res) => {
  try {
    const { userId } = req.params;
    const { lastfmData } = req.body;

    const updatedUser = await prisma.user.update({
      where: {
        userId: userId
      },
      data: {
        linkedServices: {
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
          { creatorId: userId },
          { NOT: { isDeleted: true } }
        ]
      },
      select: {
        boxId: true,
        name: true
      }
    });
    return res.json(boxes);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// UNTESTED
// Get a user's created folders
routes.get("/:userId/folders", async (req, res) => {
  try {
    const { userId } = req.params;
    const folders = await prisma.folder.findMany({
      where: {
        creatorId: userId
      }
    });
    return res.json(folders);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// UNTESTED
// Reorder user boxes
routes.put("/:userId/reorder-boxes", async (req, res) => {
  try {
    const { userId } = req.params;
    const { boxId, newPosition } = req.body;

    // Get the box to be reordered
    const boxToReorder = await prisma.box.findUnique({
      where: {
        boxId: boxId
      }
    });

    if (!boxToReorder) {
      return res.status(404).json({ message: "Box not found." });
    }

    // Update the position of the box to be reordered
    const updatedBox = await prisma.box.update({
      where: {
        boxId: boxId
      },
      data: {
        position: newPosition
      }
    });

    // Increment the position of other boxes with the same creatorId
    await prisma.box.updateMany({
      where: {
        creatorId: userId,
        position: {
          gte: newPosition
        },
        boxId: {
          not: boxId
        }
      },
      data: {
        position: {
          increment: 1
        }
      }
    });

    // Return the updated box
    return res.status(200).json(updatedBox);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

export default routes;
