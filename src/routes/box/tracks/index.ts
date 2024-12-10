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
    const newBoxTrack = await trackService.createBoxTrack(boxId, newTrack.itemId, newTrackPosition);

    return res.status(201).json(newBoxTrack);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Reorder a track in a box
routes.put("/:boxId/tracks/:trackId/reorder", async (req, res) => {
  try {
    const { boxId, trackId } = req.params;
    const newPosition = parseInt(req.body.newPosition);

    const targetTrack = await trackService.getTrackInBox(boxId, trackId);

    if (!targetTrack) {
      return res.status(404).json({ error: "Track not found" });
    }

    await trackService.updateBoxTrackPosition(targetTrack.boxTrackId, newPosition);
    await trackService.updateSubsequentBoxTrackPositions(boxId, trackId, newPosition);

    return res.status(200).json({ message: "Track reordered successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Delete a track from a box
routes.delete("/:boxId/tracks/:trackId", async (req, res) => {
  try {
    const { boxId, trackId } = req.params;

    const boxTrackCount = await trackService.getTrackBoxCount(trackId);
    await trackService.deleteBoxTrack(boxId, trackId);

    if (boxTrackCount === 1) {
      await trackService.deleteTrack(trackId);
    }

    const updatedBox = await trackService.getBoxWithTracks(boxId);
    const updatedTracks = updatedBox!.tracks.map(item => ({ note: item.note, position: item.position, subsections: item.subsections, ...item.track }));

    return res.status(201).json(updatedTracks);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Add a track to a subsection
routes.post("/:boxId/subsections/:subsectionId/tracks", async (req, res) => {
  try {
    const { boxId, subsectionId } = req.params;
    const { itemId } = req.body;

    const boxTrack = await trackService.getTrackInBox(boxId, itemId);
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
    const newPosition = parseInt(req.body.newPosition);

    const trackInSubsection = await trackService.checkTrackInSubsection(subsectionId, boxTrackId);

    if (!trackInSubsection) {
      return res.status(404).json({ error: "Track not found" });
    }

    await trackService.updateSubsectionTrackPosition(subsectionId, boxTrackId, newPosition);
    await trackService.updateSubsequentSubsectionTrackPositions(subsectionId, boxTrackId, newPosition);

    return res.status(200).json({ message: "Track reordered successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Remove a track from a subsection
routes.delete("/:boxId/subsections/:subsectionId/tracks/:boxTrackId", async (req, res) => {
  try {
    const { boxTrackId, subsectionId } = req.params;
    await trackService.deleteBoxSubsectionTrack(subsectionId, boxTrackId);

    return res.status(200).json({ message: "Track removed from subsection successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

export default routes;