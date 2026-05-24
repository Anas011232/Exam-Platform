import { ObjectId } from "mongodb";
import { getClient } from "../config/db.js";

// ================= START EXAM =================
export const startExam = async (req, res) => {
  try {
    const {
      subject,
      chapters,
      mcqCount,
      negativeMarking,
      duration,
    } = req.body;

    const db = getClient().db(process.env.DB_NAME);

    const questions = await db
      .collection("questions")
      .aggregate([
        {
          $match: {
            subject,
            chapter: { $in: chapters },
          },
        },
        { $sample: { size: mcqCount } },
      ])
      .toArray();

    const exam = {
      subject,
      chapters,
      mcqCount,
      negativeMarking,
      duration,
      questions,
      createdAt: new Date(),
    };

    const result = await db
      .collection("live_exams")
      .insertOne(exam);

    return res.json({
      success: true,
      examId: result.insertedId.toString(),
    });

  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Failed to start exam",
    });
  }
};

// ================= GET EXAM =================
export const getExam = async (req, res) => {
  try {
    const db = getClient().db(process.env.DB_NAME);

    const exam = await db
      .collection("live_exams")
      .findOne({
        _id: new ObjectId(req.params.id),
      });

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    return res.json({
      success: true,
      exam,
    });

  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ================= SUBMIT EXAM =================
export const submitExam = async (req, res) => {
  try {
    const { examId, answers } = req.body;

    const db = getClient().db(process.env.DB_NAME);

    const exam = await db
      .collection("live_exams")
      .findOne({
        _id: new ObjectId(examId),
      });

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    let correct = 0;
    let wrong = 0;
    let skip = 0;
    let score = 0;

    // 🔥 SOLUTION ARRAY
    const solvedQuestions = [];

    exam.questions.forEach((q) => {

      const userAns = answers?.[q._id];

      let status = "skip";

      // ================= SKIP =================
      if (!userAns) {
        skip++;
      }

      // ================= CORRECT =================
      else if (userAns === q.correctAnswer) {
        correct++;
        score += 1;
        status = "correct";
      }

      // ================= WRONG =================
      else {
        wrong++;
        status = "wrong";

        if (exam.negativeMarking) {
          score -= 0.25;
        }
      }

      // 🔥 SAVE SOLUTION DATA
      solvedQuestions.push({
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        userAnswer: userAns || null,
        explanation: q.explanation || "",
        chapter: q.chapter || "",
        topic: q.topic || "",
        status,
      });
    });

    // ================= RESULT DOC =================
    const resultDoc = {
      examId,
      subject: exam.subject,
      total: exam.questions.length,
      correct,
      wrong,
      skip,
      score,

      // 🔥 IMPORTANT
      solutions: solvedQuestions,

      createdAt: new Date(),
    };

    // ================= SAVE RESULT =================
    const saved = await db
      .collection("exam_results")
      .insertOne(resultDoc);

    return res.json({
      success: true,
      resultId: saved.insertedId.toString(),
      result: resultDoc,
    });

  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Failed to submit exam",
    });
  }
};

// ================= GET RESULT =================
export const getResult = async (req, res) => {
  try {
    const db = getClient().db(process.env.DB_NAME);

    const result = await db
      .collection("exam_results")
      .findOne({
        _id: new ObjectId(req.params.id),
      });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Result not found",
      });
    }

    return res.json({
      success: true,
      result,
    });

  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};