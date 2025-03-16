import { Router } from "express";
import authenticate from "../../middleware/autenticate"
import { Prisma, PrismaClient } from "@prisma/client";
import { BoxCreateDTO, SpotifyAccountDTO, UserCreateDTO } from "../../types/interfaces";
import userService from "../../services/user/userService";
import boxService from "../../services/box/boxService";
import folderService from "../../services/folder/folderService";
import albumService from "../../services/boxItem/albumService";
import artistService from "../../services/boxItem/artistService";
import playlistService from "../../services/boxItem/playlistService";
import trackService from "../../services/boxItem/trackService";
import axios from "axios";
import subsectionService from "../../services/box/subsectionService";

const prisma = new PrismaClient();
const routes = Router();

// Create a new box with the same contents but a different userId
routes.post("/:userId/migrate-box/:boxId", async (req, res) => {
  try {
    const { userId, boxId } = req.params;

    // Fetch the box data from the external endpoint
    const response = await axios.get(`https://expressjs-mongoose-production-156f.up.railway.app/api/boxes/?boxId=${boxId}`);
    const boxData = response.data.boxData;

    const highestUserBoxPosition = await boxService.getMaxPositionDashboard(userId);

    // Create the new box
    const userBox: BoxCreateDTO = {
      name: boxData.name,
      description: boxData.description,
      isPublic: boxData.public || true,
      creatorId: userId,
      position: (highestUserBoxPosition ?? 0) + 1
    };
    const newBox = await boxService.createBox(userBox);

    // Add artists to the new box
    for (const artist of boxData.artists) {
      const artistData = {
        spotifyId: artist.id,
        name: artist.name,
        images: artist.images.map((image: any) => ({
          width: image.width,
          height: image.height,
          url: image.url
        })),
        genres: artist.genres,
        type: artist.type,
      };

      const newArtist = await artistService.createArtist(artistData);
      const maxArtistPosition = await artistService.getMaxBoxArtistPosition(newBox.boxId);
      const newArtistPosition = (maxArtistPosition || 0) + 1;
      await artistService.createBoxArtist(newBox.boxId, newArtist.spotifyId, newArtistPosition);
    }

    // Add albums to the new box
    for (const album of boxData.albums) {
      const albumData = {
        spotifyId: album.id,
        name: album.name,
        images: album.images.map((image: any) => ({
          width: image.width,
          height: image.height,
          url: image.url
        })),
        releaseDate: album.release_date,
        totalTracks: album.total_tracks,
        uri: album.uri,
        artists: album.artists.map((artist: any) => ({
          spotifyId: artist.id,
          name: artist.name
        })),
        type: album.type,
        albumType: album.album_type
      };

      const newAlbum = await albumService.createAlbum(albumData);
      const maxAlbumPosition = await albumService.getMaxBoxAlbumPosition(newBox.boxId);
      const newAlbumPosition = (maxAlbumPosition || 0) + 1;
      await albumService.createBoxAlbum(newBox.boxId, newAlbum.spotifyId, newAlbumPosition);
    }

    // Add tracks to the new box
    for (const track of boxData.tracks) {
      const trackData = {
        spotifyId: track.id,
        name: track.name,
        artists: track.artists.map((artist: any) => ({
          spotifyId: artist.id,
          name: artist.name
        })),
        albumName: track.album.name,
        albumId: track.album.id,
        albumReleaseDate: track.album.release_date,
        albumImages: track.album.images.map((image: any) => ({
          width: image.width,
          height: image.height,
          url: image.url
        })),
        duration: track.duration_ms,
        explicit: track.explicit,
        type: track.type
      };

      const newTrack = await trackService.createTrack(trackData);
      const maxTrackPosition = await trackService.getMaxBoxTrackPosition(newBox.boxId);
      const newTrackPosition = (maxTrackPosition || 0) + 1;
      await trackService.createBoxTrack(newBox.boxId, newTrack.spotifyId, newTrackPosition);
    }

    // Add playlists to the new box
    for (const playlist of boxData.playlists) {
      const playlistData = {
        spotifyId: playlist.id,
        name: playlist.name,
        description: playlist.description,
        ownerDisplayName: playlist.owner.display_name,
        ownerId: playlist.owner.id,
        images: playlist.images.map((image: any) => ({
          width: image.width,
          height: image.height,
          url: image.url
        })),
        type: playlist.type,
        totalTracks: playlist.tracks.total,
      };

      const newPlaylist = await playlistService.createPlaylist(playlistData);
      const maxPlaylistPosition = await playlistService.getMaxBoxPlaylistPosition(newBox.boxId);
      const newPlaylistPosition = (maxPlaylistPosition || 0) + 1;
      await playlistService.createBoxPlaylist(newBox.boxId, newPlaylist.spotifyId, newPlaylistPosition);
    }

    // Process notes and add them to the corresponding box items
    for (const note of boxData.notes) {
      const { itemId, noteText } = note;

      // Check if the itemId exists in the artists table
      const boxArtist = await prisma.boxArtist.findFirst({
        where: {
          artistId: itemId,
          boxId: newBox.boxId
        }
      });

      if (boxArtist) {
        await prisma.boxArtist.update({
          where: { boxArtistId: boxArtist.boxArtistId },
          data: { note: noteText }
        });
        continue;
      }

      // Check if the itemId exists in the albums table
      const boxAlbum = await prisma.boxAlbum.findFirst({
        where: {
          albumId: itemId,
          boxId: newBox.boxId
        }
      });

      if (boxAlbum) {
        await prisma.boxAlbum.update({
          where: { boxAlbumId: boxAlbum.boxAlbumId },
          data: { note: noteText }
        });
        continue;
      }

      // Check if the itemId exists in the tracks table
      const boxTrack = await prisma.boxTrack.findFirst({
        where: {
          trackId: itemId,
          boxId: newBox.boxId
        }
      });

      if (boxTrack) {
        await prisma.boxTrack.update({
          where: { boxTrackId: boxTrack.boxTrackId },
          data: { note: noteText }
        });
        continue;
      }

      // Check if the itemId exists in the playlists table
      const boxPlaylist = await prisma.boxPlaylist.findFirst({
        where: {
          playlistId: itemId,
          boxId: newBox.boxId
        }
      });

      if (boxPlaylist) {
        await prisma.boxPlaylist.update({
          where: { boxPlaylistId: boxPlaylist.boxPlaylistId },
          data: { note: noteText }
        });
        continue;
      }
    }

    return res.status(201).json("Box migrated successfully.");
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

routes.post("/:userId/migrate-subsections/:boxId", async (req, res) => {
  try {
    const { boxId } = req.params;
    const { destinationBoxId } = req.body;

    // Fetch the box data from the external endpoint
    const response = await axios.get(`https://expressjs-mongoose-production-156f.up.railway.app/api/boxes/?boxId=${boxId}`);
    const boxData = response.data.boxData;
    
    // Process subsections and add them to the new box
    boxData.subSections.forEach(async (subsection: any, index: number) => {
      const { type, name, items } = subsection;

      // Create the new subsection
      const newSubsection = await subsectionService.createSubsection(
        destinationBoxId,
        {
          itemType: type,
          name,
          position: index
        }
      );

      // Add items to the new subsection
      items.forEach(async (item: { id: string }, index: number) => {
        const { id } = item;
        if (type === "artists") {
          const boxArtist = await prisma.boxArtist.findFirst({
            where: {
              artistId: id,
              boxId: destinationBoxId
            }
          });
          if (boxArtist) {
            await artistService.createBoxSubsectionArtist(newSubsection.subsectionId, boxArtist.boxArtistId, index);
          }
        } else if (type === "albums") {
          const boxAlbum = await prisma.boxAlbum.findFirst({
            where: {
              albumId: id,
              boxId: destinationBoxId
            }
          });
          if (boxAlbum) {
            await albumService.createBoxSubsectionAlbum(newSubsection.subsectionId, boxAlbum.boxAlbumId, index);
          }
        } else if (type === "tracks") {
          const boxTrack = await prisma.boxTrack.findFirst({
            where: {
              trackId: id,
              boxId: destinationBoxId
            }
          });
          if (boxTrack) {
            await trackService.createBoxSubsectionTrack(newSubsection.subsectionId, boxTrack.boxTrackId, index);
          }
        } else if (type === "playlists") {
          const boxPlaylist = await prisma.boxPlaylist.findFirst({
            where: {
              playlistId: id,
              boxId: destinationBoxId
            }
          });
          if (boxPlaylist) {
            await playlistService.createBoxSubsectionPlaylist(newSubsection.subsectionId, boxPlaylist.boxPlaylistId, index);
          }
        }
      });
    });
    return res.status(201).json("Subsections migrated successfully.");
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// TESTED
// Get the authenticated user's data
routes.get("/me", authenticate, async (req, res) => {
  res.status(200).json({ appUser: req.user });
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
