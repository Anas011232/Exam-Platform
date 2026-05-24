"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ResultPage() {
  const { id } = useParams();
  const router = useRouter();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/exam/result/${id}`);
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

  // Trigger reveal animation after data loads
  useEffect(() => {
    if (!loading && result) {
      const t = setTimeout(() => setRevealed(true), 80);
      return () => clearTimeout(t);
    }
  }, [loading, result]);

  const accuracy =
    result?.total > 0
      ? Math.round((result.correct / result.total) * 100)
      : 0;

  const grade =
    accuracy >= 90 ? { label: "S", color: "#22d3ee", glow: "rgba(34,211,238,0.35)" } :
      accuracy >= 75 ? { label: "A", color: "#34d399", glow: "rgba(52,211,153,0.35)" } :
        accuracy >= 60 ? { label: "B", color: "#a78bfa", glow: "rgba(167,139,250,0.35)" } :
          accuracy >= 45 ? { label: "C", color: "#fbbf24", glow: "rgba(251,191,36,0.35)" } :
            { label: "D", color: "#fb7185", glow: "rgba(251,113,133,0.35)" };

  const scorePercent =
    result?.total > 0
      ? Math.min(100, Math.max(0, (result.score / result.total) * 100))
      : 0;

  /* ─── LOADING ──────────────────────────────────── */
  if (loading) {
    return (
      <>
        <style>{sharedStyles}</style>
        <div className="rp-root">
          <div className="orb orb-1" /><div className="orb orb-2" /><div className="grid-overlay" />
          <div className="rp-center">
            <div className="rp-loader">
              <div className="rp-loader-ring" />
              <p className="rp-loader-text">Calculating Results</p>
              <span className="rp-loader-sub">// processing exam data</span>
            </div>
          </div>
        </div>
      </>
    );
  }

  /* ─── NO RESULT ────────────────────────────────── */
  if (!result) {
    return (
      <>
        <style>{sharedStyles}</style>
        <div className="rp-root">
          <div className="orb orb-1" /><div className="orb orb-2" /><div className="grid-overlay" />
          <div className="rp-center">
            <div className="rp-empty">
              <span className="rp-empty-icon">⚠️</span>
              <h2 className="rp-empty-title">No Result Found</h2>
              <p className="rp-empty-sub">The exam result could not be loaded. Please try again.</p>
              <button className="btn-back" onClick={() => router.push("/dashboard")}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  /* ─── RESULT ───────────────────────────────────── */
  return (
    <>
      <style>{sharedStyles}</style>
      <div className="rp-root">
        <div className="orb orb-1" /><div className="orb orb-2" /><div className="orb orb-3" />
        <div className="grid-overlay" />

        {/* NAV */}
        <nav className="rp-nav">
          <div className="nav-logo">
            <div className="nav-logo-badge">⚡</div>
            <span>ExamBattle</span>
          </div>
          <span className="nav-tag">// RESULT REPORT</span>
        </nav>

        <main className={`rp-main${revealed ? " revealed" : ""}`}>

          {/* HEADER */}
          <div className="rp-header rp-reveal" style={{ "--delay": "0ms" }}>
            <p className="eyebrow">EXAM COMPLETE</p>
            <h1 className="rp-title">Your <span className="gradient-text">Performance</span> Report</h1>
            <p className="rp-sub">Here's a breakdown of your results.</p>
          </div>

          {/* HERO ROW: Grade + Score Ring */}
          <div className="hero-row rp-reveal" style={{ "--delay": "80ms" }}>

            {/* Grade Badge */}
            <div className="grade-card" style={{ "--grade-color": grade.color, "--grade-glow": grade.glow }}>
              <div className="grade-bg" />
              <p className="grade-eyebrow">RANK</p>
              <div className="grade-letter">{grade.label}</div>
              <p className="grade-desc">
                {grade.label === "S" ? "Outstanding" :
                  grade.label === "A" ? "Excellent" :
                    grade.label === "B" ? "Good" :
                      grade.label === "C" ? "Average" : "Needs Work"}
              </p>
            </div>

            {/* Score Ring */}
            <div className="score-ring-card">
              <div className="ring-wrap">
                <svg className="ring-svg" viewBox="0 0 120 120">
                  <circle className="ring-track" cx="60" cy="60" r="50" />
                  <circle
                    className="ring-fill"
                    cx="60" cy="60" r="50"
                    style={{
                      strokeDashoffset: `${314 - (314 * scorePercent) / 100}`,
                      stroke: grade.color,
                      filter: `drop-shadow(0 0 6px ${grade.color})`,
                    }}
                  />
                </svg>
                <div className="ring-center">
                  <span className="ring-score">{result.score}</span>
                  <span className="ring-total">/ {result.total}</span>
                </div>
              </div>
              <p className="ring-label">Total Score</p>
              <p className="ring-accuracy" style={{ color: grade.color }}>{accuracy}% accuracy</p>
            </div>

          </div>

          {/* STAT CARDS */}
          <div className="stats-grid rp-reveal" style={{ "--delay": "160ms" }}>
            {[
              { label: "Correct", value: result.correct, icon: "✓", color: "#34d399", glow: "rgba(52,211,153,0.2)", border: "rgba(52,211,153,0.35)" },
              { label: "Wrong", value: result.wrong, icon: "✗", color: "#fb7185", glow: "rgba(251,113,133,0.2)", border: "rgba(251,113,133,0.35)" },
              { label: "Total", value: result.total, icon: "#", color: "#94a3b8", glow: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.2)" },
              { label: "Score", value: result.score, icon: "★", color: "#22d3ee", glow: "rgba(34,211,238,0.2)", border: "rgba(34,211,238,0.35)" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="stat-card"
                style={{ "--sc": stat.color, "--sg": stat.glow, "--sb": stat.border }}
              >
                <div className="stat-card-glow" />
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
                <div className="stat-bar-wrap">
                  <div
                    className="stat-bar-fill"
                    style={{
                      width: result.total > 0
                        ? `${Math.round((stat.value / result.total) * 100)}%`
                        : "0%",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* ACCURACY BAR */}
          <div className="accuracy-section rp-reveal" style={{ "--delay": "240ms" }}>
            <div className="accuracy-header">
              <span className="accuracy-title">Accuracy Breakdown</span>
              <span className="accuracy-pct" style={{ color: grade.color }}>{accuracy}%</span>
            </div>
            <div className="accuracy-track">
              <div
                className="accuracy-fill"
                style={{
                  width: `${accuracy}%`,
                  background: `linear-gradient(90deg, ${grade.color}, ${grade.color}99)`,
                  boxShadow: `0 0 12px ${grade.glow}`,
                }}
              />
              <div
                className="accuracy-wrong"
                style={{
                  width: result.total > 0
                    ? `${Math.round((result.wrong / result.total) * 100)}%`
                    : "0%",
                }}
              />
            </div>
            <div className="accuracy-legend">
              <span className="legend-item legend-correct">Correct</span>
              <span className="legend-item legend-wrong">Wrong</span>
              <span className="legend-item legend-skip">Skipped</span>
            </div>
          </div>

          {/* CTA */}
          <div className="cta-row rp-reveal" style={{ "--delay": "320ms" }}>

            <button
              className="btn-solution"
              onClick={() => router.push(`/result/${id}/solutions`)}
            >
              View Solutions
            </button>

            <button className="btn-back" onClick={() => router.push("/dashboard")}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </button>

          </div>

        </main>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────
   SHARED STYLES
───────────────────────────────────────────────────── */
const sharedStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg-deep: #03040d;
    --surface: rgba(255,255,255,0.04);
    --surface-hover: rgba(255,255,255,0.07);
    --border: rgba(255,255,255,0.08);
    --border-lit: rgba(255,255,255,0.16);
    --cyan: #22d3ee;
    --violet: #a78bfa;
    --emerald: #34d399;
    --rose: #fb7185;
    --text: #e2e8f0;
    --text-muted: rgba(226,232,240,0.45);
    --font-display: 'Syne', sans-serif;
    --font-mono: 'JetBrains Mono', monospace;
  }

  .rp-root {
    min-height: 100vh;
    background: var(--bg-deep);
    color: var(--text);
    font-family: var(--font-display);
    position: relative;
    overflow-x: hidden;
  }

  .rp-root::before {
    content: '';
    position: fixed; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none; z-index: 0; opacity: 0.5;
  }

  .orb {
    position: fixed; border-radius: 50%;
    filter: blur(100px); pointer-events: none; z-index: 0;
    animation: orbFloat 12s ease-in-out infinite alternate;
  }
  .orb-1 { width: 500px; height: 500px; background: rgba(34,211,238,0.07); top:-10%; left:-10%; }
  .orb-2 { width: 600px; height: 600px; background: rgba(167,139,250,0.06); bottom:-15%; right:-10%; animation-delay:-4s; }
  .orb-3 { width: 300px; height: 300px; background: rgba(52,211,153,0.05); top:40%; left:50%; transform:translateX(-50%); animation-delay:-8s; }
  @keyframes orbFloat {
    from { transform: translate(0,0) scale(1); }
    to   { transform: translate(30px,20px) scale(1.05); }
  }

  .grid-overlay {
    position: fixed; inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none; z-index: 0;
  }

  /* ── NAV ─────────────────────── */
  .rp-nav {
    position: sticky; top: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 2rem; height: 64px;
    border-bottom: 1px solid var(--border);
    background: rgba(3,4,13,0.85);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
  }
  .nav-logo {
    display: flex; align-items: center; gap: 10px;
    font-weight: 800; font-size: 1.1rem; letter-spacing: -0.01em;
  }
  .nav-logo-badge {
    width: 32px; height: 32px; border-radius: 8px;
    background: linear-gradient(135deg, var(--cyan), var(--violet));
    display: flex; align-items: center; justify-content: center; font-size: 0.9rem;
  }
  .nav-logo span {
    background: linear-gradient(90deg, var(--cyan), var(--violet));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .nav-tag {
    font-family: var(--font-mono); font-size: 0.65rem;
    color: var(--text-muted); letter-spacing: 0.1em;
  }

  /* ── LAYOUTS ─────────────────── */
  .rp-center {
    position: relative; z-index: 1;
    min-height: calc(100vh - 64px);
    display: flex; align-items: center; justify-content: center; padding: 2rem;
  }

  .rp-main {
    position: relative; z-index: 1;
    max-width: 780px; margin: 0 auto;
    padding: 2.5rem 1.5rem 5rem;
  }

  /* ── REVEAL ANIMATION ─────────── */
  .rp-reveal {
    opacity: 0; transform: translateY(18px);
    transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.34,1.3,0.64,1);
    transition-delay: var(--delay, 0ms);
  }
  .rp-main.revealed .rp-reveal {
    opacity: 1; transform: translateY(0);
  }

  /* ── LOADING ─────────────────── */
  .rp-loader {
    display: flex; flex-direction: column; align-items: center; gap: 16px;
  }
  .rp-loader-ring {
    width: 52px; height: 52px; border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.06);
    border-top-color: var(--cyan);
    animation: spin 1s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .rp-loader-text {
    font-weight: 700; font-size: 1.1rem; letter-spacing: -0.01em;
  }
  .rp-loader-sub {
    font-family: var(--font-mono); font-size: 0.65rem;
    color: var(--text-muted); letter-spacing: 0.1em;
  }

  /* ── EMPTY ───────────────────── */
  .rp-empty {
    display: flex; flex-direction: column; align-items: center;
    gap: 12px; text-align: center; max-width: 360px;
  }
  .rp-empty-icon { font-size: 3rem; }
  .rp-empty-title { font-size: 1.3rem; font-weight: 800; }
  .rp-empty-sub { color: var(--text-muted); font-size: 0.85rem; line-height: 1.6; }

  /* ── HEADER ──────────────────── */
  .rp-header { margin-bottom: 2rem; }
  .eyebrow {
    font-family: var(--font-mono); font-size: 0.65rem;
    color: var(--cyan); letter-spacing: 0.18em; margin-bottom: 0.5rem; opacity: 0.85;
  }
  .rp-title {
    font-size: clamp(1.7rem, 5vw, 2.6rem);
    font-weight: 800; letter-spacing: -0.03em; line-height: 1.1; margin-bottom: 0.5rem;
  }
  .gradient-text {
    background: linear-gradient(90deg, var(--cyan), var(--violet));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .rp-sub { color: var(--text-muted); font-size: 0.875rem; }

  /* ── HERO ROW ────────────────── */
  .hero-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    margin-bottom: 14px;
  }
  @media (max-width: 520px) { .hero-row { grid-template-columns: 1fr; } }

  /* Grade */
  .grade-card {
    position: relative; overflow: hidden; isolation: isolate;
    border-radius: 16px; border: 1px solid var(--border);
    padding: 1.75rem 1.5rem;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 6px; text-align: center;
    transition: border-color 0.3s;
    border-color: color-mix(in srgb, var(--grade-color, #22d3ee) 40%, transparent);
    box-shadow: 0 0 40px var(--grade-glow, rgba(34,211,238,0.15));
  }
  .grade-bg {
    position: absolute; inset: 0;
    background: radial-gradient(ellipse at 50% 0%, var(--grade-glow, rgba(34,211,238,0.15)) 0%, transparent 70%);
    z-index: 0;
  }
  .grade-eyebrow {
    position: relative; font-family: var(--font-mono); font-size: 0.6rem;
    letter-spacing: 0.15em; color: var(--text-muted);
  }
  .grade-letter {
    position: relative;
    font-size: 5rem; font-weight: 800; line-height: 1;
    color: var(--grade-color, var(--cyan));
    filter: drop-shadow(0 0 20px var(--grade-glow, rgba(34,211,238,0.5)));
    letter-spacing: -0.05em;
  }
  .grade-desc {
    position: relative; font-size: 0.8rem; font-weight: 600;
    color: var(--grade-color, var(--cyan)); opacity: 0.8;
  }

  /* Score ring */
  .score-ring-card {
    border-radius: 16px; border: 1px solid var(--border);
    background: var(--surface);
    padding: 1.75rem 1.5rem;
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px;
  }
  .ring-wrap {
    position: relative; width: 120px; height: 120px; flex-shrink: 0;
  }
  .ring-svg {
    width: 120px; height: 120px;
    transform: rotate(-90deg);
  }
  .ring-track {
    fill: none; stroke: rgba(255,255,255,0.06); stroke-width: 8;
  }
  .ring-fill {
    fill: none; stroke-width: 8; stroke-linecap: round;
    stroke-dasharray: 314;
    transition: stroke-dashoffset 1s cubic-bezier(0.34,1.1,0.64,1);
  }
  .ring-center {
    position: absolute; inset: 0;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
  }
  .ring-score { font-size: 1.7rem; font-weight: 800; line-height: 1; letter-spacing: -0.03em; }
  .ring-total { font-size: 0.7rem; color: var(--text-muted); font-family: var(--font-mono); }
  .ring-label { font-size: 0.8rem; font-weight: 700; }
  .ring-accuracy { font-family: var(--font-mono); font-size: 0.72rem; font-weight: 700; }

  /* ── STAT CARDS ──────────────── */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    margin-bottom: 14px;
  }
  @media (min-width: 580px) { .stats-grid { grid-template-columns: repeat(4, 1fr); } }

  .stat-card {
    position: relative; overflow: hidden; isolation: isolate;
    border-radius: 14px; border: 1px solid var(--border);
    background: var(--surface);
    padding: 1.2rem 1rem;
    display: flex; flex-direction: column; gap: 4px;
    transition: transform 0.2s, border-color 0.2s;
    border-color: var(--sb);
  }
  .stat-card:hover { transform: translateY(-2px); background: var(--surface-hover); }
  .stat-card-glow {
    position: absolute; inset: 0;
    background: radial-gradient(ellipse at 0% 0%, var(--sg) 0%, transparent 70%);
    z-index: 0;
  }
  .stat-icon {
    position: relative; font-size: 0.75rem; font-weight: 700;
    font-family: var(--font-mono); color: var(--sc); letter-spacing: 0.05em;
    margin-bottom: 2px;
  }
  .stat-value {
    position: relative; font-size: 2rem; font-weight: 800;
    letter-spacing: -0.04em; line-height: 1; color: var(--sc);
    filter: drop-shadow(0 0 8px var(--sg));
  }
  .stat-label {
    position: relative; font-family: var(--font-mono);
    font-size: 0.62rem; letter-spacing: 0.1em; color: var(--text-muted); text-transform: uppercase;
  }
  .stat-bar-wrap {
    position: absolute; bottom: 0; left: 0; right: 0;
    height: 3px; background: rgba(255,255,255,0.04); border-radius: 0 0 14px 14px;
  }
  .stat-bar-fill {
    height: 100%; border-radius: 0 0 14px 14px;
    background: var(--sc);
    opacity: 0.6;
    transition: width 1.2s cubic-bezier(0.34,1.1,0.64,1);
  }

  /* ── ACCURACY BAR ────────────── */
  .accuracy-section {
    border-radius: 14px; border: 1px solid var(--border);
    background: var(--surface);
    padding: 1.25rem 1.25rem;
    margin-bottom: 2rem;
  }
  .accuracy-header {
    display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;
  }
  .accuracy-title { font-size: 0.85rem; font-weight: 700; }
  .accuracy-pct { font-family: var(--font-mono); font-size: 0.8rem; font-weight: 700; }
  .accuracy-track {
    height: 8px; background: rgba(255,255,255,0.05);
    border-radius: 999px; overflow: hidden;
    display: flex; margin-bottom: 10px;
  }
  .accuracy-fill {
    height: 100%; border-radius: 999px;
    transition: width 1.2s cubic-bezier(0.34,1.1,0.64,1);
  }
  .accuracy-wrong {
    height: 100%; background: rgba(251,113,133,0.5); border-radius: 999px;
    transition: width 1.2s cubic-bezier(0.34,1.1,0.64,1) 0.1s;
  }
  .accuracy-legend { display: flex; gap: 14px; }
  .legend-item {
    font-family: var(--font-mono); font-size: 0.6rem; letter-spacing: 0.08em;
    color: var(--text-muted); display: flex; align-items: center; gap: 5px;
  }
  .legend-item::before { content: ''; width: 8px; height: 8px; border-radius: 50%; }
  .legend-correct::before { background: var(--emerald); }
  .legend-wrong::before   { background: var(--rose); }
  .legend-skip::before    { background: rgba(255,255,255,0.15); }

  /* ── BACK BUTTON ─────────────── */
  .cta-row { display: flex; justify-content: flex-start; }
  .btn-back {
    display: flex; align-items: center; gap: 8px;
    padding: 0.7rem 1.4rem; border-radius: 10px;
    border: 1px solid var(--border-lit);
    background: var(--surface);
    color: var(--text);
    font-family: var(--font-display); font-size: 0.85rem; font-weight: 700;
    cursor: pointer; transition: all 0.2s ease;
    letter-spacing: -0.01em;
  }
  .btn-back:hover {
    background: var(--surface-hover); border-color: var(--cyan);
    color: var(--cyan); transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(34,211,238,0.15);
  }

  @media (max-width: 480px) {
    .rp-nav { padding: 0 1rem; }
    .rp-main { padding: 1.5rem 1rem 3.5rem; }
    .grade-letter { font-size: 3.8rem; }
  }

  .btn-solution {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0.7rem 1.4rem;
  border-radius: 10px;
  border: 1px solid rgba(34,211,238,0.35);
  background: linear-gradient(
    135deg,
    rgba(34,211,238,0.16),
    rgba(167,139,250,0.12)
  );
  color: #22d3ee;
  font-family: var(--font-display);
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s ease;
  letter-spacing: -0.01em;
}

.btn-solution:hover {
  transform: translateY(-2px);
  border-color: #22d3ee;
  box-shadow: 0 0 20px rgba(34,211,238,0.2);
}

.cta-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
`;