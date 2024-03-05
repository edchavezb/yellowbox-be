import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const routes = Router();

// Add an album to a box
routes.post("/:boxId/albums", async (req, res) => {
  try {
    const { boxId } = req.params;
    const { spotifyId, spotifyUrl, spotifyUri, name, images, type, albumType, artists, releaseDate, totalTracks, boxPosition } = req.body;

    // Check if the artist already exists. If not create it.
    const album = await prisma.album.upsert({
      where: { spotifyId: spotifyId },
      update: {},
      create: {
        spotifyUrl,
        spotifyId,
        spotifyUri,
        name,
        images,
        type,
        albumType,
        artists,
        releaseDate,
        totalTracks
      }
    });

    const newBoxAlbum = await prisma.boxAlbum.create({
      data: {
        position: boxPosition,
        note: "",
        box: { connect: { boxId: boxId } },
        album: { connect: { albumId: album.albumId } }
      }
    });

    return res.status(201).json(newBoxAlbum);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Reorder an album in a box
routes.put("/:boxId/reorderAlbum/:albumId", async (req, res) => {
  try {
    const { boxId, albumId } = req.params;
    const newPosition = parseInt(req.body.position);

    const targetAlbum = await prisma.boxAlbum.findUnique({
      where: { albumId_boxId: { boxId: boxId, albumId: albumId } },
      select: { position: true }
    });

    if (!targetAlbum) {
      return res.status(404).json({ error: "Album not found" });
    }

    await prisma.boxAlbum.update({
      where: { albumId_boxId: { boxId: boxId, albumId: albumId } },
      data: { position: newPosition }
    });

    await prisma.boxAlbum.updateMany({
      where: {
        boxId: boxId,
        albumId: { not: albumId },
        position: { gte: newPosition }
      },
      data: { position: { increment: 1 } }
    });

    return res.status(200).json({ message: "Album reordered successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Update an album's images
routes.put(":albumId/images", async (req, res) => {
  try {
    const { albumId } = req.params;
    const { images } = req.body;

    const updatedAlbum = await prisma.album.update({
      where: {
        albumId: albumId,
      },
      data: {
        images: images
      },
    });

    return res.status(200).json({ updatedAlbum });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Delete an album from a box
routes.delete("/:boxId/albums/:albumId", async (req, res) => {
  try {
    const { boxId, albumId } = req.params;

    const boxAlbumCount = await prisma.boxAlbum.count({
      where: { albumId: albumId }
    });

    await prisma.boxAlbum.delete({
      where: { albumId_boxId: { boxId: boxId, albumId: albumId } },
    });

    if (boxAlbumCount === 1) {
      await prisma.album.delete({
        where: { albumId: albumId }
      });

      return res.status(200).json({ message: "Album and its associated BoxAlbum deleted successfully" });
    } else {
      return res.status(200).json({ message: "Only the associated BoxAlbum deleted. Album was not deleted." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Add an album to a subsection
routes.post(":subsectionId/albums/:albumId", async (req, res) => {
  try {
    const { albumId, subsectionId, subsectionPosition } = req.params;

    // Create a record in the BoxSubsectionAlbum table
    await prisma.boxSubsectionAlbum.create({
      data: {
        position: parseInt(subsectionPosition),
        note: "",
        album: { connect: { albumId: albumId } },
        boxSubsection: { connect: { subsectionId: parseInt(subsectionId) } }
      }
    });

    return res.status(201).json({ message: "Album added to subsection successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Remove an album from a subsection
routes.delete(":subsectionId/albums/:albumId", async (req, res) => {
  try {
    const { albumId, subsectionId } = req.params;

    // Delete the record from the BoxSubsectionAlbum table
    await prisma.boxSubsectionAlbum.delete({
      where: { albumId_boxSubsectionId: { albumId, boxSubsectionId: parseInt(subsectionId) } },
    });

    return res.status(200).json({ message: "Album removed from subsection successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

export default routes;