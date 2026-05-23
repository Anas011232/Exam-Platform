import express from "express";
import {
  startExam,
  getExam,
  getResult,
  submitExam,
} from "../controllers/exam.controller.js";

const router = express.Router();

// ✅ IMPORTANT: specific routes first
router.get("/result/:id", getResult);
router.post("/submit", submitExam);

// general route last
router.get("/:id", getExam);

router.post("/start", startExam);

export default router;