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
      color: "from-cyan-400 via-blue-500 to-indigo-600",
      glow: "rgba(56,189,248,0.25)",
      accent: "#38bdf8",
      chapters: ["Vector", "Newton Law", "Work Power Energy", "Gravity", "Current Electricity"],
    },
    {
      name: "Chemistry",
      icon: "🧪",
      color: "from-pink-400 via-red-500 to-rose-600",
      glow: "rgba(244,63,94,0.25)",
      accent: "#fb7185",
      chapters: ["Porimangoto Roshayon", "Redox", "Organic", "Chemical Bond", "Electro Chemistry"],
    },
    {
      name: "Biology",
      icon: "🧬",
      color: "from-green-400 via-emerald-500 to-teal-600",
      glow: "rgba(52,211,153,0.25)",
      accent: "#34d399",
      chapters: ["Cell", "DNA", "Human Body", "Plant", "Genetics"],
    },
    {
      name: "Math",
      icon: "📘",
      color: "from-violet-400 via-purple-500 to-indigo-600",
      glow: "rgba(167,139,250,0.25)",
      accent: "#a78bfa",
      chapters: ["Algebra", "Trigonometry", "Calculus", "Probability", "Coordinate Geometry"],
    },
  ];

  const toggleChapter = (chapter) => {
    setSelectedChapters((prev) =>
      prev.includes(chapter)
        ? prev.filter((c) => c !== chapter)
        : [...prev, chapter]
    );
  };

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
        duration: time,
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

      if (!data.success) return alert(data.message || "Failed");

      router.push(`/dashboard/exam/${data.examId}`);
    } catch (err) {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
  try {
    await fetch("http://localhost:5000/api/auth/logout", {
      method: "POST",
      credentials: "include", // 🔥 VERY IMPORTANT
    });

    localStorage.clear();
    router.push("/login");
  } catch (err) {
    console.log("Logout error:", err);
  }
};
  const selectedSubjectData = subjects.find((s) => s.name === selectedSubject);

  const steps = [
    { label: "Subject", done: !!selectedSubject },
    { label: "Chapters", done: selectedChapters.length > 0 },
    { label: "Settings", done: false },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg-deep: #03040d;
          --bg-mid: #060914;
          --surface: rgba(255,255,255,0.04);
          --surface-hover: rgba(255,255,255,0.08);
          --border: rgba(255,255,255,0.08);
          --border-lit: rgba(255,255,255,0.18);
          --cyan: #22d3ee;
          --violet: #a78bfa;
          --emerald: #34d399;
          --rose: #fb7185;
          --text: #e2e8f0;
          --text-muted: rgba(226,232,240,0.45);
          --font-display: 'Syne', sans-serif;
          --font-mono: 'JetBrains Mono', monospace;
        }

        .db-root {
          min-height: 100vh;
          background: var(--bg-deep);
          color: var(--text);
          font-family: var(--font-display);
          position: relative;
          overflow-x: hidden;
        }

        /* ── NOISE OVERLAY ─────────────────────────── */
        .db-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
          opacity: 0.5;
        }

        /* ── AMBIENT ORBS ──────────────────────────── */
        .orb {
          position: fixed;
          border-radius: 50%;
          filter: blur(100px);
          pointer-events: none;
          z-index: 0;
          animation: orbFloat 12s ease-in-out infinite alternate;
        }
        .orb-1 { width: 500px; height: 500px; background: rgba(34,211,238,0.07); top: -10%; left: -10%; animation-delay: 0s; }
        .orb-2 { width: 600px; height: 600px; background: rgba(167,139,250,0.06); bottom: -15%; right: -10%; animation-delay: -4s; }
        .orb-3 { width: 300px; height: 300px; background: rgba(52,211,153,0.05); top: 40%; left: 50%; transform: translateX(-50%); animation-delay: -8s; }

        @keyframes orbFloat {
          from { transform: translate(0,0) scale(1); }
          to   { transform: translate(30px, 20px) scale(1.05); }
        }

        /* ── GRID LINES ────────────────────────────── */
        .grid-overlay {
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
          z-index: 0;
        }

        /* ── NAV ───────────────────────────────────── */
        .nav {
          position: sticky;
          top: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          height: 64px;
          border-bottom: 1px solid var(--border);
          background: rgba(3,4,13,0.85);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 800;
          font-size: 1.15rem;
          letter-spacing: -0.01em;
          color: var(--text);
        }

        .nav-logo-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px; height: 32px;
          background: linear-gradient(135deg, var(--cyan), var(--violet));
          border-radius: 8px;
          font-size: 0.9rem;
        }

        .nav-logo span {
          background: linear-gradient(90deg, var(--cyan), var(--violet));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .btn-logout {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 0.45rem 1rem;
          border-radius: 8px;
          border: 1px solid rgba(251,113,133,0.3);
          background: rgba(251,113,133,0.08);
          color: var(--rose);
          font-family: var(--font-display);
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          letter-spacing: 0.02em;
        }
        .btn-logout:hover {
          background: rgba(251,113,133,0.18);
          border-color: rgba(251,113,133,0.5);
          transform: translateY(-1px);
        }

        /* ── MAIN LAYOUT ───────────────────────────── */
        .main {
          position: relative;
          z-index: 1;
          max-width: 1100px;
          margin: 0 auto;
          padding: 2.5rem 1.5rem 4rem;
        }

        /* ── PAGE HEADER ───────────────────────────── */
        .page-header {
          margin-bottom: 2.5rem;
        }
        .page-header-eyebrow {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: var(--cyan);
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-bottom: 0.5rem;
          opacity: 0.8;
        }
        .page-header h1 {
          font-size: clamp(1.6rem, 4vw, 2.4rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.1;
          margin-bottom: 0.5rem;
        }
        .page-header p {
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        /* ── PROGRESS STEPS ────────────────────────── */
        .steps {
          display: flex;
          gap: 0;
          margin-bottom: 2.5rem;
        }
        .step {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.75rem;
          font-weight: 600;
          font-family: var(--font-mono);
          letter-spacing: 0.05em;
          padding: 0.4rem 1rem 0.4rem 0.8rem;
          border: 1px solid var(--border);
          background: var(--surface);
          color: var(--text-muted);
          position: relative;
          transition: all 0.3s ease;
        }
        .step:first-child { border-radius: 8px 0 0 8px; }
        .step:last-child  { border-radius: 0 8px 8px 0; }
        .step:not(:last-child) { border-right: none; }
        .step.done {
          background: rgba(34,211,238,0.08);
          border-color: rgba(34,211,238,0.3);
          color: var(--cyan);
        }
        .step-num {
          width: 18px; height: 18px;
          border-radius: 50%;
          border: 1px solid currentColor;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.6rem;
          flex-shrink: 0;
        }
        .step.done .step-num {
          background: var(--cyan);
          border-color: var(--cyan);
          color: var(--bg-deep);
        }

        /* ── SECTION HEADER ────────────────────────── */
        .section-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 1.25rem;
        }
        .section-header h2 {
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: -0.01em;
        }
        .section-tag {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          padding: 2px 8px;
          border-radius: 4px;
          background: rgba(255,255,255,0.06);
          border: 1px solid var(--border);
          color: var(--text-muted);
          letter-spacing: 0.05em;
        }

        /* ── SUBJECT CARDS ─────────────────────────── */
        .subjects-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 2.5rem;
        }
        @media (min-width: 640px) {
          .subjects-grid { grid-template-columns: repeat(4, 1fr); }
        }

        .subject-card {
          position: relative;
          padding: 1.4rem 1.25rem;
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
          border: 1px solid var(--border);
          background: var(--surface);
          overflow: hidden;
          isolation: isolate;
        }
        .subject-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 14px;
          opacity: 0;
          transition: opacity 0.3s;
        }
        .subject-card:hover {
          border-color: var(--border-lit);
          transform: translateY(-3px);
          background: var(--surface-hover);
        }
        .subject-card:hover::before { opacity: 1; }
        .subject-card.selected {
          transform: translateY(-3px) scale(1.01);
        }

        .subject-card-glow {
          position: absolute;
          inset: -1px;
          border-radius: 14px;
          opacity: 0;
          transition: opacity 0.3s;
          pointer-events: none;
        }
        .subject-card.selected .subject-card-glow,
        .subject-card:hover .subject-card-glow { opacity: 1; }

        .subject-card-bg {
          position: absolute;
          inset: 0;
          border-radius: 14px;
          opacity: 0.07;
          transition: opacity 0.3s;
        }
        .subject-card:hover .subject-card-bg,
        .subject-card.selected .subject-card-bg { opacity: 0.13; }

        .subject-icon {
          font-size: 2rem;
          margin-bottom: 0.75rem;
          display: block;
          filter: drop-shadow(0 0 12px currentColor);
          transition: transform 0.3s;
        }
        .subject-card:hover .subject-icon { transform: scale(1.1) rotate(-3deg); }

        .subject-name {
          font-size: 0.95rem;
          font-weight: 700;
          letter-spacing: -0.01em;
          margin-bottom: 0.2rem;
        }
        .subject-meta {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          color: var(--text-muted);
          letter-spacing: 0.05em;
        }

        .subject-check {
          position: absolute;
          top: 10px; right: 10px;
          width: 20px; height: 20px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.6rem;
          opacity: 0;
          transition: all 0.2s;
          background: var(--cyan);
          color: var(--bg-deep);
          font-weight: 800;
        }
        .subject-card.selected .subject-check { opacity: 1; transform: scale(1); }

        /* ── CHAPTERS ──────────────────────────────── */
        .chapters-section {
          margin-bottom: 2.5rem;
          animation: fadeSlideIn 0.3s ease;
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .chapters-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
        @media (min-width: 640px) {
          .chapters-grid { grid-template-columns: repeat(3, 1fr); }
        }

        .chapter-chip {
          padding: 0.7rem 1rem;
          border-radius: 10px;
          cursor: pointer;
          border: 1px solid var(--border);
          background: var(--surface);
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-muted);
          transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: flex;
          align-items: center;
          gap: 7px;
          position: relative;
          overflow: hidden;
        }
        .chapter-chip::before {
          content: '';
          width: 6px; height: 6px;
          border-radius: 50%;
          border: 1.5px solid currentColor;
          flex-shrink: 0;
          transition: all 0.2s;
        }
        .chapter-chip:hover {
          border-color: var(--border-lit);
          color: var(--text);
          transform: translateY(-1px);
          background: var(--surface-hover);
        }
        .chapter-chip.selected {
          background: rgba(52,211,153,0.1);
          border-color: rgba(52,211,153,0.45);
          color: var(--emerald);
          transform: translateY(-1px);
        }
        .chapter-chip.selected::before {
          background: var(--emerald);
          border-color: var(--emerald);
          box-shadow: 0 0 6px var(--emerald);
        }

        /* ── SETTINGS ──────────────────────────────── */
        .settings-section { margin-bottom: 2.5rem; }

        .settings-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
        }
        @media (min-width: 640px) {
          .settings-grid { grid-template-columns: repeat(3, 1fr); }
        }

        .settings-card {
          position: relative;
          padding: 0.9rem 1rem;
          border-radius: 12px;
          border: 1px solid var(--border);
          background: var(--surface);
          display: flex;
          flex-direction: column;
          gap: 4px;
          transition: border-color 0.2s;
        }
        .settings-card:focus-within {
          border-color: rgba(34,211,238,0.4);
        }

        .settings-label {
          font-family: var(--font-mono);
          font-size: 0.62rem;
          color: var(--text-muted);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .settings-select {
          background: transparent;
          border: none;
          outline: none;
          color: var(--text);
          font-family: var(--font-display);
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          width: 100%;
          -webkit-appearance: none;
          appearance: none;
        }
        .settings-select option {
          background: #0d1117;
          color: var(--text);
        }

        /* Toggle */
        .toggle-card {
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          user-select: none;
        }
        .toggle-card:hover { border-color: var(--border-lit); }
        .toggle-card.active {
          background: rgba(167,139,250,0.08);
          border-color: rgba(167,139,250,0.35);
        }

        .toggle-info { display: flex; flex-direction: column; gap: 2px; }
        .toggle-title {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--text);
        }
        .toggle-sub {
          font-family: var(--font-mono);
          font-size: 0.6rem;
          color: var(--text-muted);
          letter-spacing: 0.05em;
        }

        .toggle-switch {
          width: 42px; height: 24px;
          border-radius: 12px;
          background: rgba(255,255,255,0.08);
          border: 1px solid var(--border);
          position: relative;
          transition: all 0.3s;
          flex-shrink: 0;
        }
        .toggle-switch::after {
          content: '';
          position: absolute;
          top: 3px; left: 3px;
          width: 16px; height: 16px;
          border-radius: 50%;
          background: var(--text-muted);
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .toggle-card.active .toggle-switch {
          background: rgba(167,139,250,0.25);
          border-color: rgba(167,139,250,0.5);
        }
        .toggle-card.active .toggle-switch::after {
          transform: translateX(18px);
          background: var(--violet);
          box-shadow: 0 0 8px var(--violet);
        }

        /* ── CTA BUTTON ────────────────────────────── */
        .btn-start {
          width: 100%;
          padding: 1rem 2rem;
          border-radius: 14px;
          border: none;
          cursor: pointer;
          font-family: var(--font-display);
          font-size: 1rem;
          font-weight: 800;
          letter-spacing: -0.01em;
          color: var(--bg-deep);
          background: linear-gradient(135deg, var(--cyan) 0%, #6366f1 100%);
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          isolation: isolate;
        }
        .btn-start::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .btn-start::after {
          content: '';
          position: absolute;
          inset: -2px;
          background: linear-gradient(135deg, var(--cyan), #6366f1);
          border-radius: 16px;
          z-index: -1;
          opacity: 0;
          filter: blur(12px);
          transition: opacity 0.3s;
        }
        .btn-start:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(34,211,238,0.3);
        }
        .btn-start:not(:disabled):hover::before { opacity: 1; }
        .btn-start:not(:disabled):hover::after  { opacity: 0.6; }
        .btn-start:not(:disabled):active { transform: translateY(0); }
        .btn-start:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-start-inner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        /* Loading spinner */
        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(3,4,13,0.3);
          border-top-color: var(--bg-deep);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── DIVIDER ───────────────────────────────── */
        .section-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--border), transparent);
          margin: 2rem 0;
        }

        /* ── RESPONSIVE TWEAKS ─────────────────────── */
        @media (max-width: 480px) {
          .nav { padding: 0 1rem; }
          .main { padding: 1.5rem 1rem 3rem; }
          .steps { flex-wrap: wrap; gap: 4px; }
          .step { border-radius: 6px !important; border-right: 1px solid var(--border) !important; font-size: 0.68rem; }
        }
      `}</style>

      <div className="db-root">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="grid-overlay" />

        {/* NAV */}
        <nav className="nav">
          <div className="nav-logo">
            <div className="nav-logo-badge">⚡</div>
            <span>ExamBattle</span>
          </div>
          <button onClick={handleLogout} className="btn-logout">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16,17 21,12 16,7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </nav>

        <main className="main">

          {/* PAGE HEADER */}
          <div className="page-header">
            <p className="page-header-eyebrow">// EXAM CONFIGURATION</p>
            <h1>Build Your <span style={{ background: "linear-gradient(90deg, var(--cyan), var(--violet))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Battle Plan</span></h1>
            <p>Select subject, chapters, and settings to launch your exam.</p>
          </div>

          {/* STEP INDICATOR */}
          <div className="steps">
            {steps.map((step, i) => (
              <div key={step.label} className={`step${step.done ? " done" : ""}`}>
                <div className="step-num">{step.done ? "✓" : i + 1}</div>
                {step.label}
              </div>
            ))}
          </div>

          {/* SUBJECTS */}
          <div>
            <div className="section-header">
              <h2>Choose Subject</h2>
              {selectedSubject && (
                <span className="section-tag">{selectedSubject} selected</span>
              )}
            </div>

            <div className="subjects-grid">
              {subjects.map((s) => (
                <div
                  key={s.name}
                  onClick={() => { setSelectedSubject(s.name); setSelectedChapters([]); }}
                  className={`subject-card${selectedSubject === s.name ? " selected" : ""}`}
                  style={selectedSubject === s.name ? { borderColor: s.accent, boxShadow: `0 0 0 1px ${s.accent}40, 0 8px 32px ${s.glow}` } : {}}
                >
                  <div
                    className="subject-card-bg"
                    style={{ background: `linear-gradient(135deg, ${s.glow}, transparent)` }}
                  />
                  <div className="subject-check">✓</div>
                  <span className="subject-icon">{s.icon}</span>
                  <p className="subject-name">{s.name}</p>
                  <p className="subject-meta">{s.chapters.length} chapters</p>
                </div>
              ))}
            </div>
          </div>

          <div className="section-divider" />

          {/* CHAPTERS */}
          {selectedSubject && (
            <div className="chapters-section">
              <div className="section-header">
                <h2>Select Chapters</h2>
                {selectedChapters.length > 0 && (
                  <span className="section-tag">{selectedChapters.length} of {selectedSubjectData?.chapters.length} selected</span>
                )}
              </div>
              <div className="chapters-grid">
                {selectedSubjectData?.chapters.map((ch) => (
                  <div
                    key={ch}
                    onClick={() => toggleChapter(ch)}
                    className={`chapter-chip${selectedChapters.includes(ch) ? " selected" : ""}`}
                  >
                    {ch}
                  </div>
                ))}
              </div>
              <div className="section-divider" />
            </div>
          )}

          {/* SETTINGS */}
          <div className="settings-section">
            <div className="section-header">
              <h2>Exam Settings</h2>
            </div>
            <div className="settings-grid">
              <div className="settings-card">
                <span className="settings-label">Questions</span>
                <select
                  value={mcqCount}
                  onChange={(e) => setMcqCount(Number(e.target.value))}
                  className="settings-select"
                >
                  <option value={30}>30 MCQs</option>
                  <option value={40}>40 MCQs</option>
                  <option value={50}>50 MCQs</option>
                </select>
              </div>

              <div className="settings-card">
                <span className="settings-label">Duration</span>
                <select
                  value={time}
                  onChange={(e) => setTime(Number(e.target.value))}
                  className="settings-select"
                >
                  <option value={30}>30 Minutes</option>
                  <option value={60}>60 Minutes</option>
                  <option value={90}>90 Minutes</option>
                </select>
              </div>

              <div
                className={`settings-card toggle-card${negativeMarking ? " active" : ""}`}
                onClick={() => setNegativeMarking(!negativeMarking)}
              >
                <div className="toggle-info">
                  <span className="toggle-title">Negative Marking</span>
                  <span className="toggle-sub">−0.25 per wrong answer</span>
                </div>
                <div className="toggle-switch" />
              </div>
            </div>
          </div>

          {/* START BUTTON */}
          <button
            onClick={handleStartExam}
            disabled={loading}
            className="btn-start"
          >
            <div className="btn-start-inner">
              {loading ? (
                <>
                  <div className="spinner" />
                  Initializing Exam...
                </>
              ) : (
                <>
                  Launch Exam
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </div>
          </button>

        </main>
      </div>
    </>
  );
}