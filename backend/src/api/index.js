const express = require("express");
const router = express.Router();

const roomData = [
  { id: "1", name: "Gaming", icon: "🎮" },
  { id: "2", name: "Technology", icon: "💻" },
  { id: "3", name: "Music", icon: "🎵" },
  { id: "4", name: "Movies", icon: "🎬" },
  { id: "5", name: "Books", icon: "📚" },
];

router.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

router.get("/rooms", (req, res) => {
  res.json(roomData);
});

module.exports = router;
