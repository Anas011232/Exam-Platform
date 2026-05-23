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

  /* ─── Loading ─── */
  if (loading) {
    return (
      <>
        <style>{globalStyles}</style>
        <div className="screen-center" style={{ background: "var(--bg)" }}>
          <div className="loader-ring" />
          <p className="loader-text">Fetching your results…</p>
        </div>
      </>
    );
  }

  /* ─── No Result ─── */
  if (!result) {
    return (
      <>
        <style>{globalStyles}</style>
        <div className="screen-center" style={{ background: "var(--bg)" }}>
          <div className="empty-card">
            <span className="empty-icon">📭</span>
            <h2 className="empty-title">No Result Found</h2>
            <p className="empty-sub">
              We couldn't locate a result for this exam session.
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              className="btn-primary"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </>
    );
  }

  /* ─── Result ─── */
  const stats = [
    { label: "Correct", value: result.correct, color: "var(--green)", icon: "✓" },
    { label: "Wrong",   value: result.wrong,   color: "var(--red)",   icon: "✗" },
    { label: "Skipped", value: result.skip,    color: "var(--amber)", icon: "–" },
  ];

  return (
    <>
      <style>{globalStyles}</style>

      {/* Ambient blobs */}
      <div className="blob blob-a" aria-hidden="true" />
      <div className="blob blob-b" aria-hidden="true" />

      <main className="page-wrapper">
        <div className="result-container">

          {/* ── Header ── */}
          <header className="result-header">
            <span className="trophy-badge">🏆</span>
            <h1 className="result-title">Exam Complete</h1>
            <p className="result-subject">{result.subject}</p>
          </header>

          {/* ── Score ring ── */}
          <div className="score-ring-wrap">
            <svg className="score-ring" viewBox="0 0 160 160">
              <circle
                cx="80" cy="80" r="68"
                fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12"
              />
              <circle
                cx="80" cy="80" r="68"
                fill="none"
                stroke="url(#scoreGrad)"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray="427"
                strokeDashoffset="106"   /* adjust per score percentage */
                transform="rotate(-90 80 80)"
                className="ring-progress"
              />
              <defs>
                <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%"   stopColor="#4DFFA4" />
                  <stop offset="100%" stopColor="#00C6FF" />
                </linearGradient>
              </defs>
            </svg>
            <div className="score-inner">
              <span className="score-value">{result.score}</span>
              <span className="score-label">Score</span>
            </div>
          </div>

          {/* ── Stat chips ── */}
          <div className="stats-grid">
            {stats.map(({ label, value, color, icon }) => (
              <div key={label} className="stat-chip">
                <span className="stat-icon" style={{ color }}>{icon}</span>
                <span className="stat-num" style={{ color }}>{value}</span>
                <span className="stat-label">{label}</span>
              </div>
            ))}
          </div>

          {/* ── Divider ── */}
          <div className="divider" />

          {/* ── Meta row ── */}
          <div className="meta-row">
            <span className="meta-tag">📚 {result.subject}</span>
          </div>

          {/* ── CTA ── */}
          <button
            onClick={() => router.push("/dashboard")}
            className="btn-primary btn-full"
          >
            Back to Dashboard
          </button>

        </div>
      </main>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
   All styles in one tagged-template string so this remains a
   single-file drop-in for Next.js (no extra CSS file needed).
───────────────────────────────────────────────────────────── */
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --bg:      #05070f;
    --surface: rgba(255,255,255,0.04);
    --border:  rgba(255,255,255,0.08);
    --text:    #e8ecf4;
    --muted:   #6b7280;
    --green:   #4DFFA4;
    --red:     #FF6B8A;
    --amber:   #FFD166;
    --accent:  #00C6FF;
    --font-display: 'Syne', sans-serif;
    --font-body:    'DM Sans', sans-serif;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-body);
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }

  /* ── Ambient blobs ── */
  .blob {
    position: fixed;
    border-radius: 50%;
    filter: blur(120px);
    pointer-events: none;
    z-index: 0;
    opacity: 0.18;
    animation: drift 18s ease-in-out infinite alternate;
  }
  .blob-a {
    width: 520px; height: 520px;
    background: radial-gradient(circle, #00C6FF, transparent 70%);
    top: -180px; left: -120px;
  }
  .blob-b {
    width: 460px; height: 460px;
    background: radial-gradient(circle, #4DFFA4, transparent 70%);
    bottom: -140px; right: -100px;
    animation-delay: -9s;
  }
  @keyframes drift {
    from { transform: translate(0, 0) scale(1); }
    to   { transform: translate(40px, 30px) scale(1.08); }
  }

  /* ── Layout helpers ── */
  .screen-center {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    padding: 24px;
    position: relative;
    z-index: 1;
  }

  .page-wrapper {
    position: relative;
    z-index: 1;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 32px 16px;
  }

  /* ── Result card ── */
  .result-container {
    width: 100%;
    max-width: 480px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 28px;
    padding: 40px 32px 36px;
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    box-shadow:
      0 0 0 1px rgba(255,255,255,0.05) inset,
      0 32px 80px rgba(0,0,0,0.6),
      0 0 60px rgba(0,198,255,0.06);
    animation: fadeUp 0.55s cubic-bezier(.22,1,.36,1) both;
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Header ── */
  .result-header {
    text-align: center;
    margin-bottom: 32px;
  }
  .trophy-badge {
    display: inline-block;
    font-size: 48px;
    line-height: 1;
    margin-bottom: 14px;
    filter: drop-shadow(0 0 18px rgba(255,209,102,0.5));
    animation: float 3.5s ease-in-out infinite;
  }
  @keyframes float {
    0%,100% { transform: translateY(0); }
    50%      { transform: translateY(-8px); }
  }
  .result-title {
    font-family: var(--font-display);
    font-size: clamp(1.6rem, 5vw, 2rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    background: linear-gradient(135deg, #fff 30%, var(--accent));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 6px;
  }
  .result-subject {
    font-size: 0.85rem;
    color: var(--muted);
    font-weight: 400;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  /* ── Score ring ── */
  .score-ring-wrap {
    position: relative;
    width: 160px;
    height: 160px;
    margin: 0 auto 32px;
  }
  .score-ring {
    width: 160px;
    height: 160px;
  }
  .ring-progress {
    transition: stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1);
  }
  .score-inner {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
  }
  .score-value {
    font-family: var(--font-display);
    font-size: 2.6rem;
    font-weight: 800;
    line-height: 1;
    background: linear-gradient(135deg, var(--green), var(--accent));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .score-label {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: var(--muted);
  }

  /* ── Stats grid ── */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-bottom: 28px;
  }
  .stat-chip {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 18px 8px;
    border-radius: 16px;
    background: rgba(255,255,255,0.03);
    border: 1px solid var(--border);
    transition: transform 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease;
  }
  .stat-chip:hover {
    transform: translateY(-3px);
    border-color: rgba(255,255,255,0.15);
    box-shadow: 0 8px 24px rgba(0,0,0,0.3);
  }
  .stat-icon {
    font-size: 1.1rem;
    font-weight: 700;
    line-height: 1;
  }
  .stat-num {
    font-family: var(--font-display);
    font-size: 1.5rem;
    font-weight: 800;
    line-height: 1;
  }
  .stat-label {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--muted);
    font-weight: 500;
  }

  /* ── Divider ── */
  .divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--border), transparent);
    margin-bottom: 20px;
  }

  /* ── Meta row ── */
  .meta-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 28px;
  }
  .meta-tag {
    font-size: 0.78rem;
    padding: 6px 14px;
    border-radius: 999px;
    background: rgba(255,255,255,0.05);
    border: 1px solid var(--border);
    color: var(--muted);
    letter-spacing: 0.04em;
  }

  /* ── Buttons ── */
  .btn-primary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 15px 28px;
    border-radius: 14px;
    border: none;
    cursor: pointer;
    font-family: var(--font-display);
    font-size: 0.95rem;
    font-weight: 700;
    letter-spacing: 0.02em;
    color: #05070f;
    background: linear-gradient(135deg, var(--green) 0%, var(--accent) 100%);
    box-shadow: 0 4px 24px rgba(0,198,255,0.25);
    transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s;
    position: relative;
    overflow: hidden;
  }
  .btn-primary::after {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(255,255,255,0);
    transition: background 0.2s;
    border-radius: inherit;
  }
  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(0,198,255,0.38);
  }
  .btn-primary:hover::after {
    background: rgba(255,255,255,0.08);
  }
  .btn-primary:active {
    transform: translateY(0);
  }
  .btn-full { width: 100%; }

  /* ── Loader ── */
  .loader-ring {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    border: 3px solid rgba(255,255,255,0.08);
    border-top-color: var(--accent);
    animation: spin 0.85s linear infinite;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  .loader-text {
    font-size: 0.9rem;
    color: var(--muted);
    letter-spacing: 0.06em;
    font-weight: 400;
    animation: pulse 2s ease-in-out infinite;
  }
  @keyframes pulse {
    0%,100% { opacity: 0.6; }
    50%      { opacity: 1; }
  }

  /* ── Empty card ── */
  .empty-card {
    max-width: 360px;
    width: 100%;
    text-align: center;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 24px;
    padding: 48px 32px;
    backdrop-filter: blur(20px);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    animation: fadeUp 0.45s cubic-bezier(.22,1,.36,1) both;
  }
  .empty-icon {
    font-size: 3rem;
    margin-bottom: 4px;
  }
  .empty-title {
    font-family: var(--font-display);
    font-size: 1.35rem;
    font-weight: 700;
    color: var(--text);
  }
  .empty-sub {
    font-size: 0.85rem;
    color: var(--muted);
    line-height: 1.6;
    margin-bottom: 8px;
  }

  /* ── Responsive ── */
  @media (max-width: 420px) {
    .result-container { padding: 28px 20px 28px; border-radius: 20px; }
    .score-ring-wrap  { width: 130px; height: 130px; }
    .score-ring       { width: 130px; height: 130px; }
    .score-value      { font-size: 2rem; }
    .stat-num         { font-size: 1.25rem; }
    .stats-grid       { gap: 8px; }
    .stat-chip        { padding: 14px 6px; border-radius: 12px; }
  }
`;