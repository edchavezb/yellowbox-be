import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const routes = Router();

// Add a track to a box
routes.post("/:boxId/tracks", async (req, res) => {
  try {
    const { boxId } = req.params;
    const { spotifyUrl, spotifyId, spotifyUri, name, artists, albumName, albumId, albumImages, durationMs, explicit, popularity, type, boxPosition } = req.body;

    // Create the track
    const newTrack = await prisma.track.create({
      data: {
        spotifyUrl,
        spotifyId,
        spotifyUri,
        name,
        artists,
        albumName,
        albumId,
        albumImages,
        durationMs,
        explicit,
        popularity,
        type
      },
    });

    // Link the track to the box with additional data in the intersection table
    const newBoxTrack = await prisma.boxTrack.create({
      data: {
        position: boxPosition,
        note: "",
        box: { connect: { boxId: boxId } },
        track: { connect: { trackId: newTrack.trackId } },
      },
    });

    return res.status(201).json(newBoxTrack);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Reorder a track in a box
routes.put("/:boxId/reorderTrack/:trackId", async (req, res) => {
  try {
    const { boxId, trackId } = req.params;
    const newPosition = parseInt(req.body.position);

    // Get the target track
    const targetTrack = await prisma.boxTrack.findUnique({
      where: { trackId_boxId: { boxId: boxId, trackId: trackId } },
      select: { position: true }
    });

    if (!targetTrack) {
      return res.status(404).json({ error: "Track not found" });
    }

    // Update the position of the target track
    await prisma.boxTrack.update({
      where: { trackId_boxId: { boxId: boxId, trackId: trackId } },
      data: { position: newPosition }
    });

    // Update the positions of other tracks in the same box
    await prisma.boxTrack.updateMany({
      where: {
        boxId: boxId,
        trackId: { not: trackId }, // Exclude the target track
        position: { gte: newPosition } // Select tracks with positions greater than or equal to the target position
      },
      data: { position: { increment: 1 } } // Increment the position of selected tracks by 1
    });

    return res.status(200).json({ message: "Track reordered successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});


// Update a track's images
routes.put(":trackId/images", async (req, res) => {
  try {
    const { trackId } = req.params;
    const { images } = req.body;

    const updatedBox = await prisma.track.update({
      where: {
        trackId: trackId,
      },
      data: {
        albumImages: images
      },
    });

    return res.status(200).json({ updatedBox });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Delete a track from a box
routes.delete("/:boxId/tracks/:trackId", async (req, res) => {
  try {
    const { boxId, trackId } = req.params;

    // Count the number of BoxTrack records for the specified trackId
    const boxTrackCount = await prisma.boxTrack.count({
      where: { trackId: trackId }
    });

    await prisma.boxTrack.delete({
      where: { trackId_boxId: { boxId: boxId, trackId: trackId } },
    });

    // If the count is 1, delete the Track
    if (boxTrackCount === 1) {
      await prisma.track.delete({
        where: { trackId: trackId }
      });

      return res.status(200).json({ message: "Track and its associated BoxTrack deleted successfully" });
    } else {
      return res.status(200).json({ message: "Only the associated BoxTrack deleted. Track was not deleted." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Add a track to a subsection
routes.post(":subsectionId/tracks/:trackId", async (req, res) => {
  try {
    const { trackId, subsectionId, subsectionPosition } = req.params;

    // Create a record in the BoxSubsectionTrack table
    await prisma.boxSubsectionTrack.create({
      data: {
        position: parseInt(subsectionPosition),
        note: "",
        track: { connect: { trackId: trackId } },
        boxSubsection: { connect: { subsectionId: parseInt(subsectionId) } }
      }
    });

    return res.status(201).json({ message: "Track added to subsection successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Remove a track from a subsection
routes.delete(":subsectionId/tracks/:trackId", async (req, res) => {
  try {
    const { trackId, subsectionId } = req.params;

    // Delete the record from the BoxSubsectionTrack table
    await prisma.boxSubsectionTrack.delete({
      where: { trackId_boxSubsectionId: { boxSubsectionId: parseInt(subsectionId), trackId: trackId } },
    });

    return res.status(200).json({ message: "Track removed from subsection successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

export default routes;