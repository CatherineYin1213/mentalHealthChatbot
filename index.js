import cors from "cors";
import path from "path";
import url, { fileURLToPath } from "url";
import express from "express";
import ImageKit from "imagekit";
import dotenv from "dotenv";
import Chat from "./models/chat.js";
import UserChats from "./models/userChats.js";
import mongoose from "mongoose";
import { requireAuth } from "@clerk/express";

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log(err);
  }
};

const imagekit = new ImageKit({
  urlEndpoint: process.env.IMAGE_KIT_ENDPOINT,
  publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
});

app.get("/api/upload", (req, res) => {
  const result = imagekit.getAuthenticationParameters();
  res.send(result);
});

// app.get(
//   "/api/test",
//   requireAuth({ signInUrl: process.env.CLIENT_URL + "/sign-in" }),
//   (req, res) => {
//     const userId = req.auth?.userId;
//     console.log("API /api/test was called!");
//     console.log("Authenticated User ID:", req.auth?.userId || "No user ID");
//     res.send("Success!");
//   }
// );

app.post(
  "/api/chats",
  requireAuth({ signInUrl: process.env.CLIENT_URL + "/sign-in" }),
  async (req, res) => {
    const userId = req.auth?.userId;
    const { text } = req.body;
    try {
      // CREATE A CHAT
      const newChat = new Chat({
        userId: userId,
        history: [{ role: "user", parts: [{ text }] }],
      });

      const savedChat = await newChat.save();
      // CHECK IF USERCHATS EXISTS
      const userChats = await UserChats.find({ userId: userId });
      if (!userChats.length) {
        const newUserChats = new UserChats({
          userId: userId,
          chats: [{ _id: savedChat._id, title: text.substring(0, 40) }],
        });
        await newUserChats.save();
      } else {
        //if exist, push new chat to userChats
        await UserChats.updateOne(
          { userId: userId },
          {
            $push: {
              chats: { _id: savedChat._id, title: text.substring(0, 40) },
            },
          }
        );
        res.status(201).send(newChat._id);
      }
    } catch (err) {
      console.log(err);
      res.status(500).send("Error creating chat!");
    }
  }
);

app.get("/api/userchats", requireAuth(), async (req, res) => {
  const userId = req.auth?.userId;
  try {
    const userChats = await UserChats.find({ userId });
    // console.log(userChats);
    res.status(200).send(userChats[0]?.chats);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching user chats!");
  }
});

app.get("/api/chats/:id", requireAuth(), async (req, res) => {
  const userId = req.auth?.userId;
  try {
    const chat = await Chat.findOne({ _id: req.params.id, userId });
    // console.log(userChats);
    res.status(200).send(chat);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching chats!");
  }
});

app.put("/api/chats/:id", requireAuth(), async (req, res) => {
  const userId = req.auth?.userId;
  const { question, answer, img } = req.body;
  const newItems = [
    ...(question
      ? [
          {
            role: "user",
            parts: [{ text: question }],
            ...(img && { img }),
          },
        ]
      : []),
    { role: "model", parts: [{ text: answer }] },
  ];
  try {
    const updatedChat = await Chat.updateOne(
      { _id: req.params.id, userId },
      {
        $push: {
          history: {
            $each: newItems,
            $position: 0, // Add at the beginning of the array
            $slice: -50, // Keep only the last 50 items (for pagination)
          },
        },
      }
    );
    res.status(200).send(chat);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error adding conversation!");
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(401).send("Unauthenticated!");
});

app.use(express.static(path.join(__dirname, "client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/dist", "index.html"));
});

app.listen(port, () => {
  connect();
  console.log(`Server is running on port ${port}`);
});
