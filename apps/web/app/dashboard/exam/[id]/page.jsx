"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ExamPage() {
  const { id } = useParams();
  const router = useRouter();

  const [exam, setExam] = useState(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [time, setTime] = useState(0);
  const [loading, setLoading] = useState(true);

  // LOAD EXAM
  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/exam/${id}`);
        const data = await res.json();

        if (!data.success) return;

        setExam(data.exam);
        setTime(data.exam.duration * 60);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  // TIMER
  useEffect(() => {
    if (!time) return;

    const t = setInterval(() => {
      setTime((p) => {
        if (p <= 1) {
          clearInterval(t);
          handleSubmit(); // auto submit
          return 0;
        }
        return p - 1;
      });
    }, 1000);

    return () => clearInterval(t);
  }, [time]);

  // SUBMIT
  const handleSubmit = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/exam/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        examId: id,
        answers,
      }),
    });

    const data = await res.json();

    console.log("SUBMIT RESPONSE:", data);

    if (!data.success) {
      alert("Submit failed");
      return;
    }

    // SAFE ROUTING (FIX)
    const resultId = data.result?._id || data.resultId;

    if (!resultId) {
      alert("Result ID missing from backend");
      return;
    }

    router.push(`/result/${resultId}`);

  } catch (err) {
    console.log(err);
  }
};
 

  if (loading || !exam) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const q = exam.questions[current];

  return (
    <div className="min-h-screen bg-[#050816] text-white p-6">

      <h1 className="text-2xl font-bold mb-4">{exam.subject}</h1>

      <div className="bg-[#0B1020] p-6 rounded-xl">

        <h2 className="text-xl mb-4">
          Q{current + 1}. {q.question}
        </h2>

        {q.options.map((opt) => (
          <button
            key={opt}
            onClick={() =>
              setAnswers({
                ...answers,
                [q._id]: opt,
              })
            }
            className={`block w-full p-3 mb-2 border rounded ${
              answers[q._id] === opt ? "bg-blue-600" : ""
            }`}
          >
            {opt}
          </button>
        ))}

      </div>

      <div className="flex justify-between mt-5">

        <button
          disabled={current === 0}
          onClick={() => setCurrent((p) => p - 1)}
          className="px-4 py-2 bg-gray-700"
        >
          Prev
        </button>

        {current === exam.questions.length - 1 ? (
          <button onClick={handleSubmit} className="px-4 py-2 bg-green-600">
            Submit
          </button>
        ) : (
          <button onClick={() => setCurrent((p) => p + 1)} className="px-4 py-2 bg-blue-600">
            Next
          </button>
        )}

      </div>
    </div>
  );
}