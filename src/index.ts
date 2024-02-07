import { PrismaClient } from "@prisma/client";
import express from "express";
import cors from "cors";
import boxRoutes from "./routes/box";
import folderRoutes from "./routes/folder";
import userRoutes from "./routes/user"
import spotifyRoutes from "./routes/spotify"
import boxArtists from "./routes/box/artists";
import boxAlbums from "./routes/box/albums";
import boxTracks from "./routes/box/tracks";
import boxPlaylists from "./routes/box/playlists";

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
app.use("/api/boxes", boxArtists);
app.use("/api/boxes", boxAlbums);
app.use("/api/boxes", boxTracks);
app.use("/api/boxes", boxPlaylists);
app.use("/api/folders", folderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/spotify", spotifyRoutes);

// app.get("/todos", async (req, res) => {
//   const todos = await prisma.todo.findMany({
//     orderBy: { createdAt: "desc" },
//   });

//   res.json(todos);
// });

// app.post("/todos", async (req, res) => {
//   const todo = await prisma.todo.create({
//     data: {
//       completed: false,
//       createdAt: new Date(),
//       text: req.body.text ?? "Empty todo",
//     },
//   });

//   return res.json(todo);
// });

// app.get("/todos/:id", async (req, res) => {
//   const id = req.params.id;
//   const todo = await prisma.todo.findUnique({
//     where: { id },
//   });

//   return res.json(todo);
// });

// app.put("/todos/:id", async (req, res) => {
//   const id = req.params.id;
//   const todo = await prisma.todo.update({
//     where: { id },
//     data: req.body,
//   });

//   return res.json(todo);
// });

// app.delete("/todos/:id", async (req, res) => {
//   const id = req.params.id;
//   await prisma.todo.delete({
//     where: { id },
//   });

//   return res.send({ status: "ok" });
// });

app.get("/", async (req, res) => {
  res.send(
    `
  <h1>Todo REST API</h1>
  <h2>Available Routes</h2>
  <pre>
    GET, POST /todos
    GET, PUT, DELETE /todos/:id
  </pre>
  `.trim(),
  );
});

app.listen(Number(port), "0.0.0.0", () => {
  console.log(`Example app listening at http://localhost:${port}`);
});