const express = require("express");
const router = express.Router();

const roomData = [
  { id: "1", name: "General", icon: "G", color: "#292CFF" },
  { id: "2", name: "Gaming", icon: "G", color: "#A805FF" },
];

router.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

router.get("/rooms", (req, res) => {
  res.json(roomData);
});

module.exports = router;
