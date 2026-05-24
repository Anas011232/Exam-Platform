"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

// ── Inject global styles once ──────────────────────────────────────────────
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:        #03050f;
    --surface:   #080d1e;
    --glass:     rgba(12, 20, 45, 0.72);
    --border:    rgba(99, 179, 237, 0.12);
    --border-hi: rgba(99, 179, 237, 0.35);
    --cyan:      #38bdf8;
    --cyan-dim:  rgba(56, 189, 248, 0.15);
    --indigo:    #818cf8;
    --green:     #34d399;
    --green-dim: rgba(52, 211, 153, 0.15);
    --red:       #f87171;
    --text:      #e2e8f0;
    --muted:     #64748b;
    --font-ui:   'Syne', sans-serif;
    --font-mono: 'JetBrains Mono', monospace;
  }

  body { background: var(--bg); color: var(--text); font-family: var(--font-ui); }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border-hi); border-radius: 4px; }

  /* Noise overlay */
  .exam-root::before {
    content: '';
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.035'/%3E%3C/svg%3E");
    opacity: 0.4;
  }

  /* Radial ambient glows */
  .exam-root::after {
    content: '';
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background:
      radial-gradient(ellipse 60% 50% at 10% 0%, rgba(56,189,248,0.07) 0%, transparent 70%),
      radial-gradient(ellipse 50% 40% at 90% 100%, rgba(129,140,248,0.07) 0%, transparent 70%);
  }

  /* Card glass */
  .glass-card {
    background: var(--glass);
    border: 1px solid var(--border);
    backdrop-filter: blur(20px) saturate(1.4);
    -webkit-backdrop-filter: blur(20px) saturate(1.4);
    border-radius: 16px;
  }

  /* Option button */
  .opt-btn {
    position: relative; width: 100%;
    background: rgba(8,13,30,0.6);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 14px 18px;
    color: var(--text);
    font-family: var(--font-ui);
    font-size: 0.95rem;
    font-weight: 500;
    text-align: left;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s, transform 0.15s, box-shadow 0.2s;
    display: flex; align-items: center; gap: 14px;
    overflow: hidden;
  }
  .opt-btn::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, var(--cyan-dim), transparent 60%);
    opacity: 0; transition: opacity 0.2s;
    border-radius: inherit;
  }
  .opt-btn:hover { border-color: var(--border-hi); transform: translateX(3px); box-shadow: 0 4px 20px rgba(56,189,248,0.08); }
  .opt-btn:hover::before { opacity: 1; }
  .opt-btn.selected {
    border-color: var(--cyan);
    background: rgba(56,189,248,0.1);
    box-shadow: 0 0 0 1px var(--cyan), 0 4px 24px rgba(56,189,248,0.15);
  }
  .opt-btn.selected::before { opacity: 1; }

  /* Nav buttons */
  .nav-btn {
    font-family: var(--font-ui);
    font-size: 0.875rem; font-weight: 700; letter-spacing: 0.04em;
    padding: 12px 28px; border-radius: 10px; border: none;
    cursor: pointer; transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
    text-transform: uppercase;
  }
  .nav-btn:disabled { opacity: 0.3; cursor: not-allowed; transform: none !important; }
  .nav-btn:not(:disabled):hover { transform: translateY(-2px); }
  .nav-btn-prev {
    background: rgba(255,255,255,0.05);
    border: 1px solid var(--border); color: var(--muted);
  }
  .nav-btn-prev:not(:disabled):hover { border-color: var(--border-hi); color: var(--text); }
  .nav-btn-next {
    background: linear-gradient(135deg, #1d4ed8, #3b82f6);
    color: #fff;
    box-shadow: 0 4px 15px rgba(59,130,246,0.35);
  }
  .nav-btn-next:hover { box-shadow: 0 6px 20px rgba(59,130,246,0.5); }
  .nav-btn-submit {
    background: linear-gradient(135deg, #065f46, #10b981);
    color: #fff;
    box-shadow: 0 4px 15px rgba(16,185,129,0.35);
  }
  .nav-btn-submit:hover { box-shadow: 0 6px 20px rgba(16,185,129,0.5); }

  /* Progress dots */
  .q-dot {
    width: 8px; height: 8px; border-radius: 50%;
    border: 1px solid var(--border);
    background: transparent;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s, transform 0.15s;
    flex-shrink: 0;
  }
  .q-dot.answered { background: rgba(52,211,153,0.7); border-color: var(--green); }
  .q-dot.current  { background: var(--cyan); border-color: var(--cyan); transform: scale(1.35); }
  .q-dot:hover    { border-color: var(--border-hi); }

  /* Timer ring */
  .timer-ring { transition: stroke-dashoffset 1s linear; }

  /* Pulse animation for low time */
  @keyframes pulse-red {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }
  .time-critical { animation: pulse-red 1s infinite; color: var(--red) !important; }

  /* Fade-in for questions */
  @keyframes fadeSlide {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .fade-in { animation: fadeSlide 0.3s ease forwards; }

  /* Loading pulse */
  @keyframes shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
  .shimmer {
    background: linear-gradient(90deg, var(--surface) 25%, rgba(56,189,248,0.06) 50%, var(--surface) 75%);
    background-size: 800px 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 8px;
  }

  /* ── Anti-copy protection ──────────────────────────────────────────────── */

  /* Disable text selection everywhere on the exam root */
  .exam-root {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  /* Prevent mobile long-press callout (iOS Safari) */
  .exam-root {
    -webkit-touch-callout: none;
  }

  /* Prevent tap highlight flash on mobile that could expose selection */
  .exam-root * {
    -webkit-tap-highlight-color: transparent;
  }

  /* Responsive */
  @media (max-width: 640px) {
    .exam-layout { padding: 12px !important; }
    .question-card { padding: 20px !important; }
    .header-bar { flex-direction: column; gap: 12px; align-items: flex-start !important; }
    .nav-btn { padding: 11px 20px; }
  }
`;

// ── Inject styles helper ──────────────────────────────────────────────────
function useGlobalStyles(css) {
  useEffect(() => {
    const id = "exam-premium-styles";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = css;
    document.head.appendChild(style);
    return () => document.getElementById(id)?.remove();
  }, []);
}

// ── Anti-copy hook ────────────────────────────────────────────────────────
// Attaches all copy/selection-prevention listeners to the exam root element.
// Returns a ref callback to attach to the container div.
function useAntiCopy() {
  const [containerRef, setContainerRef] = useState(null);

  useEffect(() => {
    if (!containerRef) return;

    // Block right-click context menu
    const onContextMenu = (e) => e.preventDefault();

    // Block copy, cut, paste at the DOM level
    const onCopy = (e) => e.preventDefault();
    const onCut  = (e) => e.preventDefault();

    // Block keyboard shortcuts: Ctrl+C, Ctrl+X, Ctrl+A, Ctrl+U
    // Uses keydown so it fires before the browser acts on the shortcut.
    // We check both e.ctrlKey (Windows/Linux) and e.metaKey (Mac ⌘).
    const BLOCKED_KEYS = new Set(["c", "x", "a", "u"]);
    const onKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && BLOCKED_KEYS.has(e.key.toLowerCase())) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    // Prevent mouse-drag selection from being initiated
    // selectstart fires right before the browser starts a text selection.
    const onSelectStart = (e) => e.preventDefault();

    containerRef.addEventListener("contextmenu",  onContextMenu,  true);
    containerRef.addEventListener("copy",         onCopy,         true);
    containerRef.addEventListener("cut",          onCut,          true);
    containerRef.addEventListener("keydown",      onKeyDown,      true);
    containerRef.addEventListener("selectstart",  onSelectStart,  true);

    return () => {
      containerRef.removeEventListener("contextmenu",  onContextMenu,  true);
      containerRef.removeEventListener("copy",         onCopy,         true);
      containerRef.removeEventListener("cut",          onCut,          true);
      containerRef.removeEventListener("keydown",      onKeyDown,      true);
      containerRef.removeEventListener("selectstart",  onSelectStart,  true);
    };
  }, [containerRef]);

  // Return a stable ref-setter callback
  return setContainerRef;
}

// ── Timer display component ───────────────────────────────────────────────
function TimerDisplay({ time, totalTime }) {
  const mins = Math.floor(time / 60);
  const secs = time % 60;
  const pct = totalTime > 0 ? time / totalTime : 1;
  const isCritical = time < 60;
  const radius = 22;
  const circ = 2 * Math.PI * radius;
  const offset = circ * (1 - pct);

  const color = isCritical ? "#f87171" : pct > 0.5 ? "#38bdf8" : "#fbbf24";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <svg width={56} height={56} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={28} cy={28} r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={3} />
        <circle
          className="timer-ring"
          cx={28} cy={28} r={radius}
          fill="none"
          stroke={color}
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ filter: `drop-shadow(0 0 4px ${color})` }}
        />
      </svg>
      <div style={{ lineHeight: 1 }}>
        <div
          className={isCritical ? "time-critical" : ""}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "1.35rem",
            fontWeight: 600,
            color: isCritical ? "var(--red)" : "var(--text)",
            letterSpacing: "0.05em",
          }}
        >
          {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
        </div>
        <div style={{ fontSize: "0.65rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 2 }}>
          remaining
        </div>
      </div>
    </div>
  );
}

// ── Option label letters ──────────────────────────────────────────────────
const LABELS = ["A", "B", "C", "D", "E"];

// ── Main component ────────────────────────────────────────────────────────
export default function ExamPage() {
  const { id } = useParams();
  const router = useRouter();

  const [exam, setExam] = useState(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [time, setTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [totalTime, setTotalTime] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  useGlobalStyles(GLOBAL_STYLES);

  // Attach anti-copy protection to the exam root container
  const antiCopyRef = useAntiCopy();

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
        setTotalTime(data.exam.duration * 60);
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
        if (p <= 1) { clearInterval(t); handleSubmit(); return 0; }
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
        body: JSON.stringify({ examId: id, answers }),
      });
      const data = await res.json();
      console.log("SUBMIT RESPONSE:", data);
      if (!data.success) { alert("Submit failed"); return; }
      const resultId = data.result?._id || data.resultId;
      if (!resultId) { alert("Result ID missing from backend"); return; }
      router.push(`/result/${resultId}`);
    } catch (err) {
      console.log(err);
    }
  };

  const goTo = (idx) => {
    setCurrent(idx);
    setAnimKey((k) => k + 1);
  };

  // ── Loading State ────────────────────────────────────────────────────────
  if (loading || !exam) {
    return (
      // antiCopyRef is attached here too so protection is active during loading
      <div ref={antiCopyRef} className="exam-root" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, zIndex: 1 }}>
          {/* Spinner */}
          <div style={{ position: "relative", width: 64, height: 64 }}>
            <svg width={64} height={64} style={{ animation: "spin 1.2s linear infinite" }}>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              <circle cx={32} cy={32} r={26} fill="none" stroke="rgba(56,189,248,0.12)" strokeWidth={3} />
              <circle cx={32} cy={32} r={26} fill="none" stroke="var(--cyan)" strokeWidth={3}
                strokeLinecap="round" strokeDasharray="60 100"
                style={{ filter: "drop-shadow(0 0 6px var(--cyan))" }} />
            </svg>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: "1.1rem", color: "var(--text)", letterSpacing: "0.06em" }}>
              LOADING EXAM
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--muted)", marginTop: 6, letterSpacing: "0.08em" }}>
              Fetching questions...
            </div>
          </div>
          {/* Shimmer bars */}
          <div style={{ width: 280, display: "flex", flexDirection: "column", gap: 10 }}>
            {[100, 75, 88].map((w, i) => (
              <div key={i} className="shimmer" style={{ height: 12, width: `${w}%` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const q = exam.questions[current];
  const answeredCount = Object.keys(answers).length;
  const totalQ = exam.questions.length;
  const progressPct = (answeredCount / totalQ) * 100;

  return (
    // antiCopyRef attaches all event listeners to this top-level exam container
    <div ref={antiCopyRef} className="exam-root" style={{ minHeight: "100vh", position: "relative" }}>
      <div
        className="exam-layout"
        style={{
          position: "relative", zIndex: 1,
          maxWidth: 860, margin: "0 auto",
          padding: "20px 20px 40px",
          display: "flex", flexDirection: "column", gap: 20,
          minHeight: "100vh",
        }}
      >
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div
          className="glass-card header-bar"
          style={{
            padding: "16px 24px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            gap: 16,
          }}
        >
          {/* Subject + progress */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              {/* Dot accent */}
              <span style={{
                width: 8, height: 8, borderRadius: "50%",
                background: "var(--cyan)",
                boxShadow: "0 0 8px var(--cyan)",
                flexShrink: 0,
              }} />
              <h1 style={{
                fontFamily: "var(--font-ui)", fontWeight: 800,
                fontSize: "clamp(1rem, 2.5vw, 1.3rem)",
                color: "var(--text)", letterSpacing: "0.02em",
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}>
                {exam.subject}
              </h1>
            </div>
            {/* Progress bar */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                flex: 1, height: 4, borderRadius: 4,
                background: "rgba(255,255,255,0.06)",
                overflow: "hidden",
              }}>
                <div style={{
                  height: "100%", borderRadius: 4,
                  width: `${progressPct}%`,
                  background: "linear-gradient(90deg, var(--cyan), var(--indigo))",
                  boxShadow: "0 0 8px rgba(56,189,248,0.5)",
                  transition: "width 0.4s ease",
                }} />
              </div>
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: "0.72rem",
                color: "var(--muted)", whiteSpace: "nowrap",
              }}>
                {answeredCount}/{totalQ} answered
              </span>
            </div>
          </div>

          {/* Timer */}
          <TimerDisplay time={time} totalTime={totalTime} />
        </div>

        {/* ── Question dots navigation ────────────────────────────────────── */}
        <div className="glass-card" style={{ padding: "14px 20px" }}>
          <div style={{
            display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center",
          }}>
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: "0.65rem",
              color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em",
              marginRight: 4, flexShrink: 0,
            }}>
              Questions
            </span>
            {exam.questions.map((qItem, i) => (
              <button
                key={i}
                className={`q-dot ${i === current ? "current" : answers[qItem._id] ? "answered" : ""}`}
                onClick={() => goTo(i)}
                title={`Question ${i + 1}`}
              />
            ))}
            {/* Legend */}
            <div style={{ marginLeft: "auto", display: "flex", gap: 14, flexShrink: 0 }}>
              {[
                { color: "var(--cyan)", label: "Current" },
                { color: "rgba(52,211,153,0.7)", label: "Done" },
                { color: "rgba(255,255,255,0.12)", label: "Skipped" },
              ].map(({ color, label }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: color, display: "inline-block" }} />
                  <span style={{ fontSize: "0.65rem", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Question card ────────────────────────────────────────────────── */}
        <div
          key={animKey}
          className="glass-card question-card fade-in"
          style={{
            padding: "32px 28px",
            flex: 1,
            display: "flex", flexDirection: "column", gap: 24,
          }}
        >
          {/* Question header */}
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            {/* Q number badge */}
            <div style={{
              flexShrink: 0,
              width: 44, height: 44, borderRadius: 10,
              border: "1px solid var(--border-hi)",
              background: "rgba(56,189,248,0.08)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "var(--font-mono)", fontWeight: 600,
              fontSize: "0.8rem", color: "var(--cyan)",
              letterSpacing: "0.04em",
            }}>
              {String(current + 1).padStart(2, "0")}
            </div>

            <div style={{ flex: 1 }}>
              {/* Category chip */}
              <div style={{ marginBottom: 10 }}>
                <span style={{
                  fontFamily: "var(--font-mono)", fontSize: "0.65rem",
                  textTransform: "uppercase", letterSpacing: "0.12em",
                  color: "var(--cyan)",
                  background: "rgba(56,189,248,0.08)",
                  border: "1px solid rgba(56,189,248,0.2)",
                  padding: "3px 10px", borderRadius: 6,
                }}>
                  Question {current + 1} of {totalQ}
                </span>
              </div>

              {/* Question text */}
              <p style={{
                fontFamily: "var(--font-ui)", fontWeight: 600,
                fontSize: "clamp(1rem, 2.5vw, 1.15rem)",
                lineHeight: 1.65, color: "var(--text)",
              }}>
                {q.question}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: "var(--border)" }} />

          {/* Options */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {q.options.map((opt, i) => (
              <button
                key={opt}
                className={`opt-btn ${answers[q._id] === opt ? "selected" : ""}`}
                onClick={() => setAnswers({ ...answers, [q._id]: opt })}
              >
                {/* Label circle */}
                <span style={{
                  flexShrink: 0, width: 28, height: 28, borderRadius: 7,
                  border: `1px solid ${answers[q._id] === opt ? "var(--cyan)" : "var(--border-hi)"}`,
                  background: answers[q._id] === opt ? "rgba(56,189,248,0.2)" : "rgba(255,255,255,0.03)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--font-mono)", fontSize: "0.72rem", fontWeight: 600,
                  color: answers[q._id] === opt ? "var(--cyan)" : "var(--muted)",
                  transition: "all 0.2s",
                  zIndex: 1, position: "relative",
                }}>
                  {LABELS[i] || i + 1}
                </span>
                <span style={{ zIndex: 1, position: "relative", lineHeight: 1.5 }}>{opt}</span>

                {/* Selected checkmark */}
                {answers[q._id] === opt && (
                  <span style={{
                    marginLeft: "auto", zIndex: 1, position: "relative",
                    color: "var(--cyan)", fontSize: "1rem",
                    filter: "drop-shadow(0 0 4px var(--cyan))",
                  }}>
                    ✓
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── Navigation bar ───────────────────────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <button
            className="nav-btn nav-btn-prev"
            disabled={current === 0}
            onClick={() => goTo(current - 1)}
          >
            ← Prev
          </button>

          {/* Center: answered indicator */}
          <div style={{ textAlign: "center" }}>
            <div style={{
              fontFamily: "var(--font-mono)", fontSize: "0.7rem",
              color: "var(--muted)", letterSpacing: "0.06em",
            }}>
              {answeredCount} of {totalQ} answered
            </div>
            {answeredCount < totalQ && (
              <div style={{ fontSize: "0.62rem", color: "rgba(251,191,36,0.7)", marginTop: 2, fontFamily: "var(--font-mono)" }}>
                {totalQ - answeredCount} unanswered
              </div>
            )}
          </div>

          {current === exam.questions.length - 1 ? (
            <button className="nav-btn nav-btn-submit" onClick={handleSubmit}>
              Submit Exam ✓
            </button>
          ) : (
            <button className="nav-btn nav-btn-next" onClick={() => goTo(current + 1)}>
              Next →
            </button>
          )}
        </div>

        {/* ── Footer watermark ─────────────────────────────────────────────── */}
        <div style={{ textAlign: "center", marginTop: 4 }}>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: "0.62rem",
            color: "rgba(100,116,139,0.4)", letterSpacing: "0.12em", textTransform: "uppercase",
          }}>
            Secure Exam Environment · Do not refresh
          </span>
        </div>
      </div>
    </div>
  );
}