"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedChapters, setSelectedChapters] = useState([]);
  const [mcqCount, setMcqCount] = useState(30);
  const [negativeMarking, setNegativeMarking] = useState(false);
  const [time, setTime] = useState(30);
  const [loading, setLoading] = useState(false);

  const subjects = [
    {
      name: "Physics",
      icon: "⚛️",
      color: "from-cyan-500 to-blue-600",
      chapters: [
        "Vector",
        "Newton Law",
        "Work Power Energy",
        "Gravity",
        "Current Electricity",
      ],
    },
    {
      name: "Chemistry",
      icon: "🧪",
      color: "from-pink-500 to-red-600",
      chapters: [
        "Porimangoto Roshayon",
        "Redox",
        "Organic",
        "Chemical Bond",
        "Electro Chemistry",
      ],
    },
    {
      name: "Biology",
      icon: "🧬",
      color: "from-green-500 to-emerald-600",
      chapters: ["Cell", "DNA", "Human Body", "Plant", "Genetics"],
    },
    {
      name: "Math",
      icon: "📘",
      color: "from-violet-500 to-indigo-600",
      chapters: [
        "Algebra",
        "Trigonometry",
        "Calculus",
        "Probability",
        "Coordinate Geometry",
      ],
    },
  ];

  // =========================
  // chapter toggle
  // =========================
  const toggleChapter = (chapter) => {
    if (selectedChapters.includes(chapter)) {
      setSelectedChapters(selectedChapters.filter((c) => c !== chapter));
    } else {
      setSelectedChapters([...selectedChapters, chapter]);
    }
  };

  // =========================
  // START EXAM (REAL FIX)
  // =========================
  const handleStartExam = async () => {
    if (!selectedSubject) return alert("Select Subject");
    if (selectedChapters.length === 0) return alert("Select Chapter");

    try {
      setLoading(true);

      const payload = {
        subject: selectedSubject,
        chapters: selectedChapters,
        mcqCount,
        negativeMarking,
        duration: time, // IMPORTANT FIX
      };

      const res = await fetch("http://localhost:5000/api/exam/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      console.log("EXAM CREATED:", data);

      if (!data.success) {
        return alert(data.message || "Failed to start exam");
      }

      // redirect to real exam
      router.push(`/dashboard/exam/${data.examId}`);

    } catch (error) {
      console.log(error);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white">

      {/* ================= NAVBAR ================= */}
      <div className="flex justify-between items-center p-6 border-b border-white/10">
        <h1 className="text-2xl font-black text-blue-400">
          ExamBattle
        </h1>

        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg"
        >
          Logout
        </button>
      </div>

      {/* ================= BODY ================= */}
      <div className="max-w-6xl mx-auto p-6">

        {/* SUBJECTS */}
        <h2 className="text-2xl font-bold mb-4">
          Select Subject
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {subjects.map((s) => (
            <div
              key={s.name}
              onClick={() => {
                setSelectedSubject(s.name);
                setSelectedChapters([]);
              }}
              className={`p-4 rounded-xl cursor-pointer border ${
                selectedSubject === s.name
                  ? "border-blue-500 bg-blue-500/20"
                  : "border-white/10"
              }`}
            >
              <div className="text-3xl">{s.icon}</div>
              <p className="font-bold">{s.name}</p>
            </div>
          ))}
        </div>

        {/* CHAPTERS */}
        {selectedSubject && (
          <>
            <h2 className="text-xl font-bold mb-3">
              Select Chapters
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              {subjects
                .find((s) => s.name === selectedSubject)
                .chapters.map((ch) => (
                  <div
                    key={ch}
                    onClick={() => toggleChapter(ch)}
                    className={`p-3 rounded-lg cursor-pointer border ${
                      selectedChapters.includes(ch)
                        ? "bg-green-600"
                        : "bg-white/5"
                    }`}
                  >
                    {ch}
                  </div>
                ))}
            </div>
          </>
        )}

        {/* CONFIG */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">

          <select
            value={mcqCount}
            onChange={(e) => setMcqCount(Number(e.target.value))}
            className="p-3 bg-black border rounded"
          >
            <option value={30}>30 MCQ</option>
            <option value={40}>40 MCQ</option>
            <option value={50}>50 MCQ</option>
          </select>

          <select
            value={time}
            onChange={(e) => setTime(Number(e.target.value))}
            className="p-3 bg-black border rounded"
          >
            <option value={30}>30 Min</option>
            <option value={60}>60 Min</option>
            <option value={90}>90 Min</option>
          </select>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={negativeMarking}
              onChange={() =>
                setNegativeMarking(!negativeMarking)
              }
            />
            Negative Marking (-0.25)
          </label>
        </div>

        {/* START BUTTON */}
        <button
          onClick={handleStartExam}
          disabled={loading}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold text-lg"
        >
          {loading ? "Starting Exam..." : "Start Exam 🚀"}
        </button>
      </div>
    </div>
  );
}