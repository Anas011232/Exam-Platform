const express = require("express");
const cors = require("cors");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes (later add)
app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

module.exports = app;