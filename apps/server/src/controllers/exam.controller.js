
// ================= START EXAM =================
import { ObjectId } from "mongodb";
import { getClient } from "../config/db.js";

export const startExam = async (req, res) => {
  try {
    const { subject, chapters, mcqCount, negativeMarking, duration } = req.body;

    const db = getClient().db(process.env.DB_NAME);

    const questions = await db.collection("questions")
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

    const result = await db.collection("live_exams").insertOne(exam);

    return res.json({
      success: true,
      examId: result.insertedId.toString(),
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
};
// ================= GET EXAM =================
export const getExam = async (req, res) => {
  try {
    const db = getClient().db(process.env.DB_NAME);

    const exam = await db.collection("live_exams").findOne({
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
    res.status(500).json({ success: false });
  }
};


// ================= SUBMIT EXAM =================
export const submitExam = async (req, res) => {
  try {
    const { examId, answers } = req.body;

    const db = getClient().db(process.env.DB_NAME);

    const exam = await db.collection("live_exams").findOne({
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
    let score = 0;

    exam.questions.forEach((q) => {
      const userAns = answers?.[q._id];

      if (!userAns) return;

      if (userAns === q.correctAnswer) {
        correct += 1;
        score += 1;
      } else {
        wrong += 1;
        if (exam.negativeMarking) score -= 0.25;
      }
    });

    const result = {
      examId,
      subject: exam.subject,
      total: exam.questions.length,
      correct,
      wrong,
      skipped: exam.questions.length - (correct + wrong),
      score,
      createdAt: new Date(),
    };

    const insertResult = await db.collection("exam_result").insertOne(result);

    return res.json({
      success: true,
      result: {
        _id: insertResult.insertedId.toString(),
        ...result,
      },
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
};

// ================= GET RESULT =================
export const getResult = async (req, res) => {
  try {
    const db = getClient().db(process.env.DB_NAME);

    const result = await db.collection("exam_result").findOne({
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
    res.status(500).json({ success: false });
  }
};