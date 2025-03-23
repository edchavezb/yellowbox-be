import { PrismaClient } from "@prisma/client";
import express from "express";
import cors from "cors";
import boxRoutes from "./routes/box";
import folderRoutes from "./routes/folder";
import userRoutes from "./routes/user"
import queueRoutes from "./routes/queue"
import spotifyRoutes from "./routes/spotify"
import boxArtistRoutes from "./routes/box/artists";
import boxAlbumRoutes from "./routes/box/albums";
import boxTrackRoutes from "./routes/box/tracks";
import boxPlaylistRoutes from "./routes/box/playlists";
import albumRoutes from "./routes/item/albums";
import artistRoutes from "./routes/item/artists";
import trackRoutes from "./routes/item/tracks";
import playlistRoutes from "./routes/item/playlists";

const prisma = new PrismaClient();

const app = express();
const port = process.env.PORT || 3333;

app.use(express.json());
app.use(express.raw({ type: "application/vnd.custom-type" }));
app.use(express.text({ type: "text/html" }));

app.use(express.json());
app.use(express.raw({ type: "application/vnd.custom-type" }));
app.use(express.text({ type: "text/html" }));
app.use(cors());

app.get("/api", async (req, res) => {
  res.json({ message: "You have reached the Yellowbox API." });
});

app.use("/api/boxes", boxRoutes);
app.use("/api/boxes", boxArtistRoutes);
app.use("/api/boxes", boxAlbumRoutes);
app.use("/api/boxes", boxTrackRoutes);
app.use("/api/boxes", boxPlaylistRoutes);
app.use("/api/items", albumRoutes);
app.use("/api/items", artistRoutes);
app.use("/api/items", trackRoutes);
app.use("/api/items", playlistRoutes);
app.use("/api/folders", folderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/users", queueRoutes);
app.use("/api/spotify", spotifyRoutes);

app.get("/", async (req, res) => {
  res.send(
    `
  <h1>Yellowbox REST API</h1>
  <h2>Navigate to a route</h2>
  `.trim(),
  );
});

app.listen(Number(port), "0.0.0.0", () => {
  console.log(`Example app listening at http://localhost:${port}`);
});