import { Router } from "express";
import boxService from "../../../services/box/boxService";
import trackService from "../../../services/boxItem/trackService";

const routes = Router();

// Add a track to a box
routes.post("/:boxId/tracks", async (req, res) => {
  try {
    const { boxId } = req.params;
    const trackData = req.body.newTrack;

    const trackInBox = await trackService.checkTrackInBox(boxId, trackData.spotifyId);
    if (trackInBox) {
      return res.status(400).json({ error: "Item already in box" });
    }

    const newTrack = await trackService.createTrack(trackData);
    const maxTrackPosition = await trackService.getMaxBoxTrackPosition(boxId);
    const newTrackPosition = (maxTrackPosition || 0) + 1;
    const newBoxTrack = await trackService.createBoxTrack(boxId, newTrack.spotifyId, newTrackPosition);

    return res.status(201).json(newBoxTrack);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Reorder a track in a box
routes.put("/:boxId/tracks/:boxTrackId/reorder", async (req, res) => {
  try {
    const { boxId, boxTrackId } = req.params;
    const { destinationId } = req.body;

    const targetTrack = await trackService.getTrackInBox(boxTrackId);
    const destinationAlbum = await trackService.getTrackInBox(destinationId);

    if (!targetTrack || !destinationAlbum) {
      return res.status(404).json({ error: "Track not found" });
    }

    const newPosition = destinationAlbum.position
    await trackService.updateBoxTrackPosition(targetTrack.boxTrackId, newPosition);

    return res.status(200).json({ message: "Track reordered successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Delete a track from a box
routes.delete("/:boxId/tracks/:boxTrackId", async (req, res) => {
  try {
    const { boxId, boxTrackId } = req.params;

    const track = await trackService.getTrackInBox(boxTrackId);

    const boxTrackCount = await trackService.getTrackBoxCount(track!.trackId);
    await trackService.deleteBoxTrack(boxTrackId);

    if (boxTrackCount === 1) {
      await trackService.deleteTrack(track!.trackId);
    }

    const updatedBox = await boxService.getBoxById(boxId);

    return res.status(201).json(updatedBox);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Add a track to a subsection
routes.post("/:boxId/subsections/:subsectionId/tracks", async (req, res) => {
  try {
    const { boxId, subsectionId } = req.params;
    const { boxTrackId } = req.body;

    // Check if the track is a valid boxTrack
    const trackInBox = await trackService.getTrackInBox(boxTrackId);
    if (!trackInBox) {
      return res.status(404).json({ error: "Track not found" });
    }

    // Check if the track is already in the subsection
    const trackInSubsection = await trackService.checkTrackInSubsection(subsectionId, boxTrackId);
    if (trackInSubsection) {
      return res.status(400).json({ error: "Track already in subsection" });
    }

    const boxTrack = await trackService.getTrackInBox(boxTrackId);
    const maxTrackPosition = await trackService.getMaxSubsectionTrackPosition(subsectionId);
    const newTrackPosition = (maxTrackPosition || 0) + 1;
    await trackService.createBoxSubsectionTrack(subsectionId, boxTrack!.boxTrackId, newTrackPosition);

    const updatedBox = await boxService.getBoxById(boxId);

    return res.status(201).json(updatedBox);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Reorder a track in a subsection
routes.put("/:boxId/subsections/:subsectionId/tracks/:boxTrackId/reorder", async (req, res) => {
  try {
    const { subsectionId, boxTrackId } = req.params;
    const { destinationId } = req.body;

    const trackInSubsection = await trackService.checkTrackInSubsection(subsectionId, boxTrackId);
    const destinationTrack = await trackService.getTrackInSubsection(subsectionId, destinationId);

    if (!trackInSubsection || !destinationTrack) {
      return res.status(404).json({ error: "Track not found" });
    }

    const newPosition = destinationTrack.position
    await trackService.updateSubsectionTrackPosition(subsectionId, boxTrackId, newPosition);

    return res.status(200).json({ message: "Track reordered successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Move a track to a different subsection
routes.put("/:boxId/subsections/:subsectionId/tracks/:boxTrackId/move", async (req, res) => {
  try {
    const { boxId, boxTrackId, subsectionId } = req.params;
    const { destinationSubsectionId } = req.body;

    // Check if the track is a valid boxTrack
    const trackInBox = await trackService.getTrackInBox(boxTrackId);
    if (!trackInBox) {
      return res.status(404).json({ error: "Track not found" });
    }

    // Check if the track is in the current subsection
    const trackInSubsection = await trackService.checkTrackInSubsection(subsectionId, boxTrackId);
    if (!trackInSubsection) {
      return res.status(404).json({ error: "Track not found in the current subsection" });
    }

    // Check if the track is already in the destination subsection
    const trackInDestinationSubsection = await trackService.checkTrackInSubsection(destinationSubsectionId, boxTrackId);
    if (trackInDestinationSubsection) {
      return res.status(400).json({ error: "Track already in the destination subsection" });
    }

    // Remove the track from the current subsection
    await trackService.deleteBoxSubsectionTrack(subsectionId, boxTrackId);

    // Get the max position in the destination subsection
    const maxTrackPosition = await trackService.getMaxSubsectionTrackPosition(destinationSubsectionId);
    const newTrackPosition = (maxTrackPosition || 0) + 1;

    // Add the track to the destination subsection
    await trackService.createBoxSubsectionTrack(destinationSubsectionId, boxTrackId, newTrackPosition);

    const updatedBox = await boxService.getBoxById(boxId);

    return res.status(200).json(updatedBox);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Remove a track from a subsection
routes.delete("/:boxId/subsections/:subsectionId/tracks/:boxTrackId", async (req, res) => {
  try {
    const { boxId, boxTrackId, subsectionId } = req.params;

    // Check if the track is already in the subsection
    const trackInSubsection = await trackService.checkTrackInSubsection(subsectionId, boxTrackId);
    if (!trackInSubsection) {
      return res.status(400).json({ error: "Track not in subsection" });
    }

    await trackService.deleteBoxSubsectionTrack(subsectionId, boxTrackId);
    const updatedBox = await boxService.getBoxById(boxId);

    return res.status(200).json(updatedBox);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Update a track note
routes.put("/:boxId/tracks/:boxTrackId/note", async (req, res) => {
  try {
    const { boxTrackId } = req.params;
    const { note } = req.body;
    const updatedNote = await trackService.updateBoxTrackNote(boxTrackId, note);

    return res.status(200).json({ updatedNote });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Update a track note in a subsection
routes.put("/:boxId/subsections/:subsectionId/tracks/:boxTrackId/note", async (req, res) => {
  try {
    const { boxTrackId, subsectionId } = req.params;
    const { note } = req.body;
    const updatedNote = await trackService.updateBoxSubsectionTrackNote(
      boxTrackId,
      subsectionId,
      note
    );

    return res.status(200).json({ updatedNote });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

export default routes;