"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ResultPage() {
  const { id } = useParams();
  const router = useRouter();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/exam/result/${id}`
        );

        const data = await res.json();

        console.log("RESULT API:", data);

        setResult(data.result || data);
      } catch (err) {
        console.log(err);
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
      <div className="min-h-screen flex items-center justify-center bg-[#050816] text-white">
        No Result Found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white p-10">

      <h1 className="text-3xl font-bold mb-6">Exam Result 📊</h1>

      <div className="grid gap-4">

        <div className="p-5 bg-green-600 rounded-xl">
          Correct: {result.correct}
        </div>

        <div className="p-5 bg-red-600 rounded-xl">
          Wrong: {result.wrong}
        </div>

        <div className="p-5 bg-gray-600 rounded-xl">
          Total: {result.total}
        </div>

        <div className="p-5 bg-blue-600 rounded-xl">
          Score: {result.score}
        </div>

      </div>

      <button
        onClick={() => router.push("/dashboard")}
        className="mt-6 px-6 py-3 bg-blue-600 rounded-xl"
      >
        Back
      </button>

    </div>
  );
}