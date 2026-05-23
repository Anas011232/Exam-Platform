"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

export default function ResultPage() {
  const { id } = useParams();
  const router = useRouter();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        // ❌ localStorage REMOVE (BUG FIX)
        const res = await axios.get(
          `http://localhost:5000/api/exam/${data.examId}`
        );

        if (res.data?.result) {
          setResult(res.data.result);
        } else {
          setResult(null);
        }

      } catch (err) {
        console.log("RESULT LOAD ERROR:", err);
        setResult(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050816] text-white">
        Loading Result...
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#050816] text-white">
        <h2 className="text-xl">No Result Found</h2>

        <button
          onClick={() => router.push("/dashboard")}
          className="mt-4 px-6 py-3 bg-blue-600 rounded-xl"
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white p-6">

      <div className="max-w-3xl mx-auto">

        <h1 className="text-3xl font-bold mb-6 text-center">
          🎯 Exam Result
        </h1>

        <div className="bg-[#0B1020] p-6 rounded-2xl border border-white/10">

          <p>Score: <b className="text-green-400">{result.score}</b></p>
          <p>Correct: {result.correct}</p>
          <p>Wrong: {result.wrong}</p>
          <p>Skip: {result.skip}</p>

          <p className="text-gray-400 mt-4">
            Subject: {result.subject}
          </p>

        </div>

        <button
          onClick={() => router.push("/dashboard")}
          className="mt-6 w-full bg-blue-600 py-3 rounded-xl"
        >
          Back to Dashboard
        </button>

      </div>
    </div>
  );
}