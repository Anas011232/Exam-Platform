"use client";

import { useState } from "react";

export default function DashboardPage() {
  const [active, setActive] = useState("dashboard");

  const stats = [
    { title: "Total Exams", value: "24" },
    { title: "Attempted", value: "12" },
    { title: "Avg Score", value: "78%" },
    { title: "Rank", value: "#5" },
  ];

  const exams = [
    { name: "Math Chapter Test", score: "85%", date: "Today" },
    { name: "Physics Mock Test", score: "72%", date: "Yesterday" },
    { name: "Chemistry Quiz", score: "90%", date: "2 days ago" },
  ];

  const leaderboard = [
    { name: "Rahim", score: 98 },
    { name: "Karim", score: 95 },
    { name: "Sakib", score: 92 },
    { name: "You", score: 88 },
  ];

  return (
    <div className="min-h-screen bg-[#070A12] text-white flex">

      {/* Sidebar */}
      <div className="w-64 bg-[#0C1220] border-r border-white/10 p-5">
        <h1 className="text-2xl font-bold mb-8">Exam Platform</h1>

        {[
          "dashboard",
          "exams",
          "results",
          "leaderboard",
          "settings",
        ].map((item) => (
          <div
            key={item}
            onClick={() => setActive(item)}
            className={`p-3 rounded-lg cursor-pointer mb-2 transition ${
              active === item
                ? "bg-blue-600"
                : "hover:bg-white/10"
            }`}
          >
            {item.toUpperCase()}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">

        {/* Top Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Dashboard</h2>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm text-gray-400">Welcome</p>
              <p className="font-semibold">Student</p>
            </div>

            <div className="w-10 h-10 bg-blue-600 rounded-full"></div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <div
              key={i}
              className="bg-[#0C1220] p-5 rounded-xl border border-white/10 hover:scale-105 transition"
            >
              <p className="text-gray-400">{s.title}</p>
              <h3 className="text-2xl font-bold mt-2">{s.value}</h3>
            </div>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Exams */}
          <div className="lg:col-span-2 bg-[#0C1220] p-5 rounded-xl border border-white/10">
            <h3 className="text-xl font-semibold mb-4">
              Recent Exams
            </h3>

            {exams.map((e, i) => (
              <div
                key={i}
                className="flex justify-between items-center p-3 border-b border-white/10"
              >
                <div>
                  <p className="font-medium">{e.name}</p>
                  <p className="text-sm text-gray-400">{e.date}</p>
                </div>
                <span className="text-green-400 font-bold">
                  {e.score}
                </span>
              </div>
            ))}
          </div>

          {/* Leaderboard */}
          <div className="bg-[#0C1220] p-5 rounded-xl border border-white/10">
            <h3 className="text-xl font-semibold mb-4">
              Leaderboard
            </h3>

            {leaderboard.map((l, i) => (
              <div
                key={i}
                className="flex justify-between p-2 border-b border-white/10"
              >
                <span>{l.name}</span>
                <span className="text-blue-400">{l.score}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}