import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const routes = Router();

// Add a playlist to a box
routes.post("/:boxId/playlists", async (req, res) => {
  try {
    const { boxId } = req.params;
    const { spotifyId, spotifyUrl, spotifyUri, name, description, ownerName, ownerUri, images, type, totalTracks, boxPosition } = req.body;

    // Check if the playlist already exists. If not create it.
    const playlist = await prisma.playlist.upsert({
      where: { spotifyId: spotifyId },
      update: {},
      create: {
        spotifyUrl,
        spotifyId,
        spotifyUri,
        name,
        description,
        ownerName,
        ownerUri,
        images,
        type,
        totalTracks
      }
    });

    const newBoxPlaylist = await prisma.boxPlaylist.create({
      data: {
        position: boxPosition,
        note: "",
        box: { connect: { boxId: boxId } },
        playlist: { connect: { playlistId: playlist.playlistId } }
      }
    });

    return res.status(201).json(newBoxPlaylist);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Reorder a playlist in a box
routes.put("/:boxId/playlists/:playlistId/reorder", async (req, res) => {
  try {
    const { boxId, playlistId } = req.params;
    const newPosition = parseInt(req.body.position);

    const targetPlaylist = await prisma.boxPlaylist.findUnique({
      where: { playlistId_boxId: { boxId: boxId, playlistId: playlistId } },
      select: { position: true }
    });

    if (!targetPlaylist) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    await prisma.boxPlaylist.update({
      where: { playlistId_boxId: { boxId: boxId, playlistId: playlistId } },
      data: { position: newPosition }
    });

    await prisma.boxPlaylist.updateMany({
      where: {
        boxId: boxId,
        playlistId: { not: playlistId },
        position: { gte: newPosition }
      },
      data: { position: { increment: 1 } }
    });

    return res.status(200).json({ message: "Playlist reordered successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Update a playlist's images
routes.put(":playlistId/images", async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { images } = req.body;

    const updatedPlaylist = await prisma.playlist.update({
      where: {
        playlistId: playlistId,
      },
      data: {
        images
      },
    });

    return res.status(200).json({ updatedPlaylist });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Delete a playlist from a box
routes.delete("/:boxId/playlists/:playlistId", async (req, res) => {
  try {
    const { boxId, playlistId } = req.params;

    const boxPlaylistCount = await prisma.boxPlaylist.count({
      where: { playlistId: playlistId }
    });

    await prisma.boxPlaylist.delete({
      where: { playlistId_boxId: { boxId: boxId, playlistId: playlistId } },
    });

    if (boxPlaylistCount === 1) {
      await prisma.playlist.delete({
        where: { playlistId: playlistId }
      });

      return res.status(200).json({ message: "Playlist and its associated BoxPlaylist deleted successfully" });
    } else {
      return res.status(200).json({ message: "Only the associated BoxPlaylist deleted. Playlist was not deleted." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Add a track to a subsection
routes.post(":subsectionId/playlists/:playlistId", async (req, res) => {
  try {
    const { playlistId, subsectionId, subsectionPosition } = req.params;

    // Create a record in the BoxSubsectionTrack table
    await prisma.boxSubsectionPlaylist.create({
      data: {
        position: parseInt(subsectionPosition),
        note: "",
        playlist: { connect: { playlistId: playlistId } },
        boxSubsection: { connect: { subsectionId: parseInt(subsectionId) } }
      }
    });

    return res.status(201).json({ message: "Track added to subsection successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Reorder a playlist in a subsection
routes.put("/:subsectionId/playlists/:playlistId/reorder", async (req, res) => {
  try {
    const { subsectionId, playlistId } = req.params;
    const newPosition = parseInt(req.body.position);

    // Get the target playlist
    const targetPlaylist = await prisma.boxSubsectionPlaylist.findUnique({
      where: { playlistId_boxSubsectionId: { boxSubsectionId: parseInt(subsectionId), playlistId: playlistId } },
      select: { position: true }
    });

    if (!targetPlaylist) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    // Update the position of the target playlist
    await prisma.boxSubsectionPlaylist.update({
      where: { playlistId_boxSubsectionId: { boxSubsectionId: parseInt(subsectionId), playlistId: playlistId } },
      data: { position: newPosition }
    });

    // Update the positions of other playlists in the same subsection
    await prisma.boxSubsectionPlaylist.updateMany({
      where: {
        boxSubsectionId: parseInt(subsectionId),
        playlistId: { not: playlistId }, // Exclude the target playlist
        position: { gte: newPosition } // Select playlists with positions greater than or equal to the target position
      },
      data: { position: { increment: 1 } } // Increment the position of selected playlists by 1
    });

    return res.status(200).json({ message: "Playlist reordered successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Remove a track from a subsection
routes.delete(":subsectionId/playlists/:playlistId", async (req, res) => {
  try {
    const { playlistId, subsectionId } = req.params;

    // Delete the record from the BoxSubsectionTrack table
    await prisma.boxSubsectionPlaylist.delete({
      where: { playlistId_boxSubsectionId: { boxSubsectionId: parseInt(subsectionId), playlistId: playlistId } },
    });

    return res.status(200).json({ message: "Track removed from subsection successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

export default routes;