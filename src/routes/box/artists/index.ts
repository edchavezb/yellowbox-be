import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const routes = Router();

// Add an artist to a box
routes.post("/:boxId/artists", async (req, res) => {
  try {
    const { boxId } = req.params;
    const { spotifyId, spotifyUrl, spotifyUri, name, images, type, popularity, genres, boxPosition } = req.body;

    // Check if the artist already exists. If not create it.
    const artist = await prisma.artist.upsert({
      where: { spotifyId: spotifyId },
      update: {},
      create: {
        spotifyUrl,
        spotifyId,
        spotifyUri,
        name,
        images,
        type,
        popularity,
        genres
      }
    });

    const newBoxArtist = await prisma.boxArtist.create({
      data: {
        position: boxPosition,
        note: "",
        box: { connect: { boxId: boxId } },
        artist: { connect: { artistId: artist.artistId } }
      }
    });

    return res.status(201).json(newBoxArtist);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Reorder an artist in a box
routes.put("/:boxId/artists/:artistId/reorder", async (req, res) => {
  try {
    const { boxId, artistId } = req.params;
    const newPosition = parseInt(req.body.position);

    const targetArtist = await prisma.boxArtist.findUnique({
      where: { artistId_boxId: { boxId: boxId, artistId: artistId } },
      select: { position: true }
    });

    if (!targetArtist) {
      return res.status(404).json({ error: "Artist not found" });
    }

    await prisma.boxArtist.update({
      where: { artistId_boxId: { boxId: boxId, artistId: artistId } },
      data: { position: newPosition }
    });

    await prisma.boxArtist.updateMany({
      where: {
        boxId: boxId,
        artistId: { not: artistId },
        position: { gte: newPosition }
      },
      data: { position: { increment: 1 } }
    });

    return res.status(200).json({ message: "Artist reordered successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Update an artist's images
routes.put(":artistId/images", async (req, res) => {
  try {
    const { artistId } = req.params;
    const { images } = req.body;

    const updatedArtist = await prisma.artist.update({
      where: {
        artistId: artistId,
      },
      data: {
        images: images
      },
    });

    return res.status(200).json({ updatedArtist });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Delete an artist from a box
routes.delete("/:boxId/artists/:artistId", async (req, res) => {
  try {
    const { boxId, artistId } = req.params;

    const boxArtistCount = await prisma.boxArtist.count({
      where: { artistId: artistId }
    });

    await prisma.boxArtist.delete({
      where: { artistId_boxId: { boxId: boxId, artistId: artistId } },
    });

    if (boxArtistCount === 1) {
      await prisma.artist.delete({
        where: { artistId: artistId }
      });

      return res.status(200).json({ message: "Artist and its associated BoxArtist deleted successfully" });
    } else {
      return res.status(200).json({ message: "Only the associated BoxArtist deleted. Artist was not deleted." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Add an artist to a subsection
routes.post(":subsectionId/artists/:artistId", async (req, res) => {
  try {
    const { artistId, subsectionId, subsectionPosition } = req.params;

    // Create a record in the BoxSubsectionArtist table
    await prisma.boxSubsectionArtist.create({
      data: {
        position: parseInt(subsectionPosition),
        note: "",
        artist: { connect: { artistId: artistId } },
        boxSubsection: { connect: { subsectionId: parseInt(subsectionId) } }
      }
    });

    return res.status(201).json({ message: "Artist added to subsection successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Reorder an artist in a subsection
routes.put("/:subsectionId/artists/:artistId/reorder", async (req, res) => {
  try {
    const { subsectionId, artistId } = req.params;
    const newPosition = parseInt(req.body.position);

    // Get the target artist
    const targetArtist = await prisma.boxSubsectionArtist.findUnique({
      where: { artistId_boxSubsectionId: { boxSubsectionId: parseInt(subsectionId), artistId: artistId } },
      select: { position: true }
    });

    if (!targetArtist) {
      return res.status(404).json({ error: "Artist not found" });
    }

    // Update the position of the target artist
    await prisma.boxSubsectionArtist.update({
      where: { artistId_boxSubsectionId: { boxSubsectionId: parseInt(subsectionId), artistId: artistId } },
      data: { position: newPosition }
    });

    // Update the positions of other artists in the same subsection
    await prisma.boxSubsectionArtist.updateMany({
      where: {
        boxSubsectionId: parseInt(subsectionId),
        artistId: { not: artistId }, // Exclude the target artist
        position: { gte: newPosition } // Select artists with positions greater than or equal to the target position
      },
      data: { position: { increment: 1 } } // Increment the position of selected artists by 1
    });

    return res.status(200).json({ message: "Artist reordered successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Remove an artist from a subsection
routes.delete(":subsectionId/artists/:artistId", async (req, res) => {
  try {
    const { artistId, subsectionId } = req.params;

    // Delete the record from the BoxSubsectionArtist table
    await prisma.boxSubsectionArtist.delete({
      where: { artistId_boxSubsectionId: { artistId, boxSubsectionId: parseInt(subsectionId) } },
    });

    return res.status(200).json({ message: "Artist removed from subsection successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

export default routes;