"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const COLORS = {
  bg: "#080C14",
  bgCard: "#0D1220",
  bgGlass: "rgba(255,255,255,0.04)",
  border: "rgba(255,255,255,0.08)",
  borderBright: "rgba(99,179,237,0.3)",
  primary: "#3B82F6",
  primaryGlow: "rgba(59,130,246,0.4)",
  accent: "#06B6D4",
  accentGlow: "rgba(6,182,212,0.3)",
  gold: "#F59E0B",
  goldGlow: "rgba(245,158,11,0.3)",
  purple: "#8B5CF6",
  purpleGlow: "rgba(139,92,246,0.3)",
  green: "#10B981",
  greenGlow: "rgba(16,185,129,0.3)",
  red: "#EF4444",
  text: "#F1F5F9",
  textMuted: "#94A3B8",
  textDim: "#475569",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap');
  
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  
  html { overflow-x: hidden; }
  body { background: ${COLORS.bg}; color: ${COLORS.text}; font-family: 'DM Sans', sans-serif; overflow-x: hidden; width: 100%; }
  
  .syne { font-family: 'Syne', sans-serif; }
  
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: ${COLORS.bg}; }
  ::-webkit-scrollbar-thumb { background: ${COLORS.primary}; border-radius: 2px; }

  .btn-primary {
    background: linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent});
    color: #fff;
    border: none;
    padding: 14px 32px;
    border-radius: 12px;
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 15px;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    letter-spacing: 0.3px;
    white-space: nowrap;
    max-width: 100%;
  }
  .btn-primary::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, #60A5FA, #22D3EE);
    opacity: 0;
    transition: opacity 0.3s;
  }
  .btn-primary:hover::before { opacity: 1; }
  .btn-primary span { position: relative; z-index: 1; }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 30px ${COLORS.primaryGlow}; }

  .btn-ghost {
    background: transparent;
    color: ${COLORS.text};
    border: 1.5px solid ${COLORS.border};
    padding: 13px 30px;
    border-radius: 12px;
    font-family: 'Syne', sans-serif;
    font-weight: 600;
    font-size: 15px;
    cursor: pointer;
    transition: all 0.3s ease;
    white-space: nowrap;
    max-width: 100%;
  }
  .btn-ghost:hover {
    border-color: ${COLORS.primary};
    color: ${COLORS.primary};
    background: rgba(59,130,246,0.06);
    transform: translateY(-2px);
  }

  .glass-card {
    background: ${COLORS.bgGlass};
    border: 1px solid ${COLORS.border};
    border-radius: 20px;
    backdrop-filter: blur(12px);
    transition: all 0.35s ease;
  }
  .glass-card:hover {
    border-color: rgba(59,130,246,0.25);
    background: rgba(255,255,255,0.06);
    transform: translateY(-4px);
    box-shadow: 0 20px 60px rgba(0,0,0,0.4);
  }

  .glow-text {
    background: linear-gradient(135deg, #60A5FA, #22D3EE, #A78BFA);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .gradient-border {
    position: relative;
  }
  .gradient-border::before {
    content: '';
    position: absolute;
    inset: -1px;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(135deg, ${COLORS.primary}, ${COLORS.purple}, ${COLORS.accent});
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.3s;
  }
  .gradient-border:hover::before { opacity: 1; }

  .fade-in {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.7s ease, transform 0.7s ease;
  }
  .fade-in.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .section-tag {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(59,130,246,0.1);
    border: 1px solid rgba(59,130,246,0.2);
    border-radius: 100px;
    padding: 6px 16px;
    font-size: 12px;
    font-weight: 600;
    color: ${COLORS.primary};
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 20px;
  }

  .noise-overlay {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    opacity: 0.025;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
    background-size: 150px;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-12px); }
  }
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 20px rgba(59,130,246,0.3); }
    50% { box-shadow: 0 0 40px rgba(59,130,246,0.6); }
  }
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes ticker {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes battle-pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.05); opacity: 0.85; }
  }

  .float-anim { animation: float 4s ease-in-out infinite; }
  .pulse-glow { animation: pulse-glow 2.5s ease-in-out infinite; }

  .nav-link {
    color: ${COLORS.textMuted};
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    transition: color 0.2s;
    cursor: pointer;
  }
  .nav-link:hover { color: ${COLORS.text}; }

  .feature-icon {
    width: 52px;
    height: 52px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    margin-bottom: 20px;
    flex-shrink: 0;
  }

  .rank-badge {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 14px;
    flex-shrink: 0;
  }

  .progress-bar {
    height: 6px;
    border-radius: 3px;
    background: rgba(255,255,255,0.08);
    overflow: hidden;
  }
  .progress-fill {
    height: 100%;
    border-radius: 3px;
    transition: width 1.5s ease;
  }

  .ticker-wrap {
    overflow: hidden;
    white-space: nowrap;
  }
  .ticker-inner {
    display: inline-flex;
    animation: ticker 20s linear infinite;
    gap: 0;
  }
  .ticker-inner:hover { animation-play-state: paused; }

  .step-connector {
    position: absolute;
    top: 50%;
    right: -50%;
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, ${COLORS.primary}, transparent);
  }

  /* ── Floating hero cards: hide on small screens ── */
  .hero-float-card {
    display: flex;
  }

  /* ── Footer grid ── */
  .footer-grid {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 48px;
    margin-bottom: 52px;
  }

  /* ── Analytics two-col layout ── */
  .analytics-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: center;
  }

  /* ── Nav links ── */
  .nav-links { display: flex; align-items: center; gap: 36px; }

  /* ── Features grid ── */
  .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }

  /* ── Categories grid ── */
  .categories-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }

  /* ── Steps grid ── */
  .steps-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; position: relative; }

  /* ── Pricing grid ── */
  .pricing-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; max-width: 800px; margin: 0 auto; }

  /* ── Testimonials grid ── */
  .testimonials-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }

  /* ── Hero CTAs ── */
  .hero-ctas { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }

  /* ── Hero trust indicators ── */
  .hero-trust { display: flex; gap: 40px; justify-content: center; margin-top: 56px; flex-wrap: wrap; }

  /* ── Battle inner layout ── */
  .battle-inner { display: flex; align-items: center; justify-content: space-between; gap: 48px; }
  .battle-mock { display: block; flex-shrink: 0; width: 320px; }

  /* ══════════════════════════════════════════
     TABLET: 481px – 1024px
  ══════════════════════════════════════════ */
  @media (max-width: 1024px) {
    .footer-grid {
      grid-template-columns: 1fr 1fr;
      gap: 36px;
    }
    .analytics-grid {
      grid-template-columns: 1fr;
      gap: 40px;
    }
    .battle-inner {
      flex-direction: column;
      text-align: center;
    }
    .battle-mock {
      width: 100%;
      max-width: 420px;
      margin: 0 auto;
    }
    .features-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    .categories-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  /* ══════════════════════════════════════════
     MOBILE: ≤ 480px
  ══════════════════════════════════════════ */
  @media (max-width: 480px) {
    /* Nav */
    .nav-links { display: none; }
    .nav-btn-group { gap: 8px !important; }
    .nav-btn-group .btn-ghost { display: none; }
    .nav-btn-group .btn-primary { padding: 9px 16px !important; font-size: 12px !important; }

    /* Hero */
    .hero-title { font-size: clamp(1.9rem, 8vw, 2.4rem) !important; letter-spacing: -1px !important; }
    .hero-subtitle { font-size: 0.95rem !important; }
    .hero-ctas { flex-direction: column; align-items: center; width: 100%; }
    .hero-ctas .btn-primary,
    .hero-ctas .btn-ghost { width: 100%; max-width: 340px; text-align: center; justify-content: center; font-size: 14px !important; padding: 14px 24px !important; }
    .hero-trust { gap: 20px; margin-top: 40px; }
    .hero-trust-item .trust-val { font-size: 1.4rem !important; }
    .hero-float-card { display: none !important; }

    /* Section headings */
    .section-h2 { font-size: clamp(1.5rem, 7vw, 2rem) !important; letter-spacing: -0.5px !important; }

    /* Grids → 1 column */
    .features-grid { grid-template-columns: 1fr !important; }
    .categories-grid { grid-template-columns: 1fr !important; }
    .steps-grid { grid-template-columns: 1fr !important; }
    .pricing-grid { grid-template-columns: 1fr !important; }
    .testimonials-grid { grid-template-columns: 1fr !important; }

    /* Battle section */
    .battle-inner { flex-direction: column; text-align: center; }
    .battle-mock { width: 100% !important; max-width: 100% !important; }
    .battle-tags { justify-content: center; }
    .battle-h2 { font-size: clamp(1.5rem, 7vw, 2rem) !important; letter-spacing: -0.5px !important; }

    /* Battle CTA button */
    .battle-cta { width: 100% !important; }

    /* Leaderboard */
    .lb-row-name { font-size: 13px !important; }

    /* Analytics */
    .analytics-grid { grid-template-columns: 1fr; gap: 32px; }

    /* Footer */
    .footer-grid { grid-template-columns: 1fr; gap: 32px; }
    .footer-social { flex-wrap: wrap; }

    /* Pricing heading */
    .pricing-amount { font-size: clamp(2rem, 10vw, 2.8rem) !important; }

    /* Section padding */
    .section-pad-mobile { padding: 64px 0 !important; }

    /* Testimonial text */
    .testimonial-text { font-size: 13px !important; }

    /* Steps: hide arrows */
    .step-arrow { display: none !important; }

    /* Buttons in full-width contexts */
    .btn-full-mobile { width: 100% !important; text-align: center; }

    /* Trust bar ticker items: tighten */
    .ticker-inner > div > div { padding: 0 24px !important; }
  }

  /* ══════════════════════════════════════════
     SMALL MOBILE: ≤ 360px
  ══════════════════════════════════════════ */
  @media (max-width: 360px) {
    .hero-title { font-size: 1.75rem !important; }
    .section-h2 { font-size: 1.4rem !important; }
    .battle-h2 { font-size: 1.4rem !important; }
  }

  /* ══════════════════════════════════════════
     TABLET MID: 481px – 768px
  ══════════════════════════════════════════ */
  @media (min-width: 481px) and (max-width: 768px) {
    .hero-title { font-size: clamp(2.2rem, 6vw, 3rem) !important; }
    .section-h2 { font-size: clamp(1.6rem, 5vw, 2.2rem) !important; }
    .features-grid { grid-template-columns: repeat(2, 1fr); }
    .steps-grid { grid-template-columns: 1fr !important; }
    .pricing-grid { grid-template-columns: 1fr !important; }
    .footer-grid { grid-template-columns: 1fr 1fr; gap: 28px; }
    .hero-float-card { display: none !important; }
    .step-arrow { display: none !important; }
    .battle-h2 { font-size: clamp(1.6rem, 5vw, 2.2rem) !important; }
  }
`;

// ── Icons (SVG inline) ──────────────────────────────────────────────
const Icon = ({ name, size = 20, color = "currentColor" }) => {
  const icons = {
    brain: <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
    bolt: <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
    chart: <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
    book: <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
    trophy: <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M8 21h8m-4-4v4M7 3H5a2 2 0 00-2 2v3a4 4 0 004 4h.254M17 3h2a2 2 0 012 2v3a4 4 0 01-4 4h-.254M7 3h10l-1 8H8L7 3z" /></svg>,
    history: <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    star: <svg width={size} height={size} fill={color} viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>,
    check: <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>,
    arrow: <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>,
    users: <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
    shield: <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
    zap: <svg width={size} height={size} fill={color} viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
    target: <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth="1.8"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>,
    play: <svg width={size} height={size} fill={color} viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>,
  };
  return icons[name] || null;
};

// ── Reusable Components ─────────────────────────────────────────────
const Badge = ({ children, color = COLORS.primary }) => (
  <span style={{
    background: `${color}18`,
    color,
    border: `1px solid ${color}30`,
    borderRadius: 8,
    padding: "3px 10px",
    fontSize: 11,
    fontWeight: 700,
    fontFamily: "'Syne', sans-serif",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
  }}>{children}</span>
);

const StarRating = ({ n = 5 }) => (
  <div style={{ display: "flex", gap: 3 }}>
    {[...Array(n)].map((_, i) => (
      <Icon key={i} name="star" size={14} color={COLORS.gold} />
    ))}
  </div>
);

// ── Section wrapper with fade-in ────────────────────────────────────
const Section = ({ children, style, className = "" }) => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) el.classList.add("visible"); },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={`fade-in ${className}`} style={style}>
      {children}
    </div>
  );
};

// ── MAIN COMPONENT ──────────────────────────────────────────────────
export default function ExamPlatformHomepage() {
  const [navScrolled, setNavScrolled] = useState(false);
  const [progressVisible, setProgressVisible] = useState(false);
  const progressRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setNavScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const el = progressRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setProgressVisible(true);
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const features = [
    { icon: "brain", color: COLORS.primary, bg: "rgba(59,130,246,0.12)", title: "Smart MCQ Practice", desc: "Adaptive AI selects questions based on your weak areas and learning pace for maximum efficiency." },
    { icon: "bolt", color: COLORS.accent, bg: "rgba(6,182,212,0.12)", title: "Real-Time Battle Mode", desc: "Compete live against other students in timed MCQ battles. Sharpen reflexes under pressure." },
    { icon: "chart", color: COLORS.purple, bg: "rgba(139,92,246,0.12)", title: "AI Performance Analytics", desc: "Deep insights into accuracy, speed, topic mastery, and personalized improvement roadmaps." },
    { icon: "book", color: COLORS.gold, bg: "rgba(245,158,11,0.12)", title: "Chapter-wise Exams", desc: "Organized by chapter and topic across all HSC subjects for structured, focused preparation." },
    { icon: "trophy", color: COLORS.green, bg: "rgba(16,185,129,0.12)", title: "Leaderboard System", desc: "Weekly and all-time rankings. Compete nationally and see where you stand among top performers." },
    { icon: "history", color: "#F472B6", bg: "rgba(244,114,182,0.12)", title: "Exam History Tracking", desc: "Review every past attempt with detailed breakdowns of time spent, accuracy, and topic coverage." },
  ];

  const categories = [
    { name: "Physics", emoji: "⚛️", color: COLORS.primary, q: "1,240 Q" },
    { name: "Chemistry", emoji: "🧪", color: COLORS.green, q: "1,180 Q" },
    { name: "Mathematics", emoji: "∑", color: COLORS.gold, q: "2,100 Q" },
    { name: "Biology", emoji: "🧬", color: "#F472B6", q: "980 Q" },
    { name: "ICT", emoji: "💻", color: COLORS.purple, q: "760 Q" },
    { name: "English", emoji: "📝", color: COLORS.accent, q: "640 Q" },
  ];

  const leaderboard = [
    { rank: 1, name: "Arafat Hossain", score: 9840, badge: "🥇", class: "Science '25", change: "+12" },
    { rank: 2, name: "Nusrat Jahan", score: 9620, badge: "🥈", class: "Science '25", change: "+5" },
    { rank: 3, name: "Mehedi Islam", score: 9410, badge: "🥉", class: "Science '25", change: "+8" },
    { rank: 4, name: "Tania Akter", score: 9280, badge: "", class: "Commerce '25", change: "+3" },
    { rank: 5, name: "Rakib Hassan", score: 9150, badge: "", class: "Science '25", change: "+15" },
  ];

  const testimonials = [
    { name: "Sadia Islam", class: "HSC 2024 — GPA 5.0", avatar: "SI", result: "Physics: 40→92", color: COLORS.primary, text: "ExamBattle made me stop dreading physics. The battle mode is insanely addictive — I'd do 3 rounds at midnight without realizing it. My marks jumped from 40 to 92." },
    { name: "Tanvir Ahmed", class: "HSC 2024 — A+", avatar: "TA", result: "Overall: 68%→94%", color: COLORS.accent, text: "The AI analytics literally showed me I was wasting time on easy questions. Fixed that habit, focused on weak chapters, and hit A+ for the first time." },
    { name: "Farhana Begum", class: "HSC 2025 Candidate", avatar: "FB", result: "Accuracy: 55%→88%", color: COLORS.purple, text: "I love the leaderboard — it made studying feel competitive. Coming from rank #340 to rank #12 in 3 months felt unreal. This platform is genuinely different." },
    { name: "Rashed Khan", class: "HSC 2024 — GPA 4.9", avatar: "RK", result: "Math: 58→97", color: COLORS.gold, text: "Chapter-wise exams helped me fix gaps I didn't even know existed. The explanations after wrong answers are detailed and actually teach you." },
  ];

  const steps = [
    { num: "01", icon: "users", color: COLORS.primary, title: "Create Your Account", desc: "Sign up free in under 30 seconds. No credit card required. Start with the full feature set immediately." },
    { num: "02", icon: "book", color: COLORS.accent, title: "Practice & Compete", desc: "Tackle chapter exams, join live battles, and let AI guide your study sessions toward your weaknesses." },
    { num: "03", icon: "trophy", color: COLORS.gold, title: "Improve & Dominate", desc: "Watch your accuracy climb, see your rank rise, and walk into your HSC exam with unshakeable confidence." },
  ];

  const analytics = [
    { subject: "Physics", pct: 88, color: COLORS.primary },
    { subject: "Chemistry", pct: 74, color: COLORS.green },
    { subject: "Mathematics", pct: 92, color: COLORS.gold },
    { subject: "Biology", pct: 61, color: "#F472B6" },
    { subject: "ICT", pct: 95, color: COLORS.purple },
  ];

  const s = {
    wrap: { maxWidth: 1200, margin: "0 auto", padding: "0 24px" },
    sectionPad: { padding: "100px 0" },
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="noise-overlay" />

      {/* ── NAVBAR ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "0 16px",
        background: navScrolled ? "rgba(8,12,20,0.92)" : "transparent",
        backdropFilter: navScrolled ? "blur(20px)" : "none",
        borderBottom: navScrolled ? `1px solid ${COLORS.border}` : "none",
        transition: "all 0.4s ease",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
          <div className="syne" style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.5px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", flexShrink: 0 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
              ⚡
            </div>
            <span className="glow-text">ExamBattle</span>
          </div>

          <div className="nav-links">
            {["Features", "Exams", "Pricing", "Leaderboard"].map(l => (
              <span key={l} className="nav-link">{l}</span>
            ))}
          </div>

          <div className="nav-btn-group" style={{ display: "flex", gap: 12, alignItems: "center" }}>

            <Link href="/login">
              <button className="btn-ghost" style={{ padding: "9px 20px", fontSize: 13 }}>
                <span>Log In</span>
              </button>
            </Link>

            <Link href="/register">
              <button
                className="btn-primary"
                style={{
                  fontSize: 14,
                  padding: "12px 22px",
                  borderRadius: 10,
                }}
              >
                <span>🚀 Start Free</span>
              </button>
            </Link>


          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", overflow: "hidden", paddingTop: 80 }}>
        {/* BG blobs */}
        <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, ${COLORS.primaryGlow} 0%, transparent 70%)`, top: -100, left: -150, filter: "blur(60px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${COLORS.accentGlow} 0%, transparent 70%)`, bottom: 0, right: -100, filter: "blur(60px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(circle, ${COLORS.purpleGlow} 0%, transparent 70%)`, top: "40%", left: "50%", filter: "blur(80px)", pointerEvents: "none" }} />

        {/* Grid lines */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${COLORS.border} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.border} 1px, transparent 1px)`, backgroundSize: "60px 60px", opacity: 0.4, pointerEvents: "none" }} />

        <div style={{ ...s.wrap, position: "relative", zIndex: 1, textAlign: "center", padding: "60px 20px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.25)", borderRadius: 100, padding: "8px 18px", marginBottom: 32, fontSize: 13, color: COLORS.accent, fontWeight: 600, flexWrap: "wrap", justifyContent: "center" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.green, display: "inline-block", animation: "pulse-glow 2s infinite", flexShrink: 0 }} />
            Now live — Battle Mode Season 3 has started!
          </div>

          <h1 className="syne hero-title" style={{ fontSize: "clamp(2.2rem, 6vw, 5.2rem)", fontWeight: 800, lineHeight: 1.1, marginBottom: 24, letterSpacing: "-2px" }}>
            The Smartest Way to<br />
            <span className="glow-text">Dominate Your HSC</span>
          </h1>

          <p className="hero-subtitle" style={{ fontSize: "clamp(0.95rem, 2vw, 1.2rem)", color: COLORS.textMuted, maxWidth: 580, margin: "0 auto 44px", lineHeight: 1.7, fontWeight: 400 }}>
            10,000+ MCQs. AI-powered analytics. Real-time battle mode. Join 50,000+ students who are studying smarter — and ranking higher.
          </p>

          <div className="hero-ctas">
            <button className="btn-primary" style={{ fontSize: "clamp(13px, 3vw, 16px)", padding: "16px 40px" }}>
              <span>🚀 Start Free — No Card Needed</span>
            </button>
            <button className="btn-ghost" style={{ fontSize: "clamp(13px, 3vw, 16px)", padding: "16px 36px", display: "flex", alignItems: "center", gap: 10, justifyContent: "center" }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name="play" size={14} color="#fff" />
              </div>
              Watch Demo
            </button>
          </div>

          {/* Trust indicators */}
          <div className="hero-trust">
            {[
              { val: "50K+", label: "Students enrolled" },
              { val: "10K+", label: "Questions available" },
              { val: "95%", label: "Improvement rate" },
              { val: "4.9★", label: "Average rating" },
            ].map(({ val, label }) => (
              <div key={label} className="hero-trust-item" style={{ textAlign: "center" }}>
                <div className="syne trust-val" style={{ fontSize: "clamp(1.3rem, 4vw, 1.8rem)", fontWeight: 800, background: `linear-gradient(135deg, #fff, ${COLORS.textMuted})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{val}</div>
                <div style={{ fontSize: 12, color: COLORS.textDim, marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Floating cards — hidden on mobile via CSS class */}
          <div className="hero-float-card float-anim" style={{ position: "absolute", left: "6%", top: "28%", background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: "14px 18px", alignItems: "center", gap: 12, backdropFilter: "blur(12px)", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
            <div style={{ fontSize: 24 }}>⚡</div>
            <div>
              <div style={{ fontSize: 11, color: COLORS.textDim }}>Live Battle</div>
              <div className="syne" style={{ fontSize: 14, fontWeight: 700, color: COLORS.accent }}>243 active now</div>
            </div>
          </div>
          <div className="hero-float-card float-anim" style={{ position: "absolute", right: "6%", top: "38%", background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: "14px 18px", alignItems: "center", gap: 12, backdropFilter: "blur(12px)", boxShadow: "0 20px 60px rgba(0,0,0,0.5)", animationDelay: "1s" }}>
            <div style={{ fontSize: 24 }}>📈</div>
            <div>
              <div style={{ fontSize: 11, color: COLORS.textDim }}>Rank Change</div>
              <div className="syne" style={{ fontSize: 14, fontWeight: 700, color: COLORS.green }}>+128 this week</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <div style={{ borderTop: `1px solid ${COLORS.border}`, borderBottom: `1px solid ${COLORS.border}`, padding: "0", overflow: "hidden", background: "rgba(255,255,255,0.02)" }}>
        <div className="ticker-wrap" style={{ padding: "18px 0" }}>
          <div className="ticker-inner">
            {[...Array(2)].map((_, ri) => (
              <div key={ri} style={{ display: "flex", gap: 0 }}>
                {[
                  { icon: "👥", val: "50,000+ Students", col: COLORS.primary },
                  { icon: "❓", val: "10,000+ Questions", col: COLORS.accent },
                  { icon: "📊", val: "95% See Improvement", col: COLORS.green },
                  { icon: "⚔️", val: "5M+ Battle Rounds", col: COLORS.gold },
                  { icon: "🏆", val: "1K+ Top Rankers", col: COLORS.purple },
                  { icon: "⭐", val: "4.9/5 Average Rating", col: "#F472B6" },
                  { icon: "📚", val: "6 HSC Subjects", col: COLORS.accent },
                  { icon: "🤖", val: "AI-Powered Engine", col: COLORS.primary },
                ].map(({ icon, val, col }, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 40px", whiteSpace: "nowrap", borderRight: `1px solid ${COLORS.border}` }}>
                    <span style={{ fontSize: 16 }}>{icon}</span>
                    <span className="syne" style={{ fontSize: 13, fontWeight: 700, color: col }}>{val}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FEATURES ── */}
      <section className="section-pad-mobile" style={s.sectionPad}>
        <div style={s.wrap}>
          <Section style={{ textAlign: "center", marginBottom: 60 }}>
            <div className="section-tag">✨ Platform Features</div>
            <h2 className="syne section-h2" style={{ fontSize: "clamp(1.6rem, 3.5vw, 3rem)", fontWeight: 800, letterSpacing: "-1px", marginBottom: 16 }}>
              Everything You Need to <span className="glow-text">Ace HSC</span>
            </h2>
            <p style={{ color: COLORS.textMuted, maxWidth: 520, margin: "0 auto", lineHeight: 1.7, fontSize: "clamp(0.875rem, 2vw, 1rem)" }}>
              Not just a question bank. A full preparation ecosystem built for serious students.
            </p>
          </Section>

          <div className="features-grid">
            {features.map((f, i) => (
              <Section key={f.title} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="glass-card gradient-border" style={{ padding: 28, height: "100%", cursor: "default" }}>
                  <div className="feature-icon" style={{ background: f.bg }}>
                    <Icon name={f.icon} size={24} color={f.color} />
                  </div>
                  <h3 className="syne" style={{ fontSize: "clamp(15px, 2vw, 17px)", fontWeight: 700, marginBottom: 10, letterSpacing: "-0.3px" }}>{f.title}</h3>
                  <p style={{ color: COLORS.textMuted, fontSize: "clamp(13px, 1.5vw, 14px)", lineHeight: 1.7 }}>{f.desc}</p>
                </div>
              </Section>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section-pad-mobile" style={{ ...s.sectionPad, background: "rgba(255,255,255,0.015)", borderTop: `1px solid ${COLORS.border}`, borderBottom: `1px solid ${COLORS.border}` }}>
        <div style={s.wrap}>
          <Section style={{ textAlign: "center", marginBottom: 60 }}>
            <div className="section-tag">🗺 How It Works</div>
            <h2 className="syne section-h2" style={{ fontSize: "clamp(1.6rem, 3.5vw, 3rem)", fontWeight: 800, letterSpacing: "-1px" }}>
              From Signup to <span className="glow-text">Top Rank</span>
            </h2>
          </Section>

          <div className="steps-grid">
            {steps.map((step, i) => (
              <Section key={step.num} style={{ animationDelay: `${i * 0.15}s`, position: "relative" }}>
                <div className="glass-card" style={{ padding: "clamp(20px, 4vw, 32px)", textAlign: "center", height: "100%" }}>
                  <div className="syne" style={{ fontSize: "clamp(40px, 8vw, 64px)", fontWeight: 900, color: `${step.color}18`, lineHeight: 1, marginBottom: -10 }}>{step.num}</div>
                  <div style={{ width: 56, height: 56, borderRadius: 16, background: `${step.color}18`, border: `1px solid ${step.color}30`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                    <Icon name={step.icon} size={24} color={step.color} />
                  </div>
                  <h3 className="syne" style={{ fontSize: "clamp(15px, 2vw, 18px)", fontWeight: 700, marginBottom: 12 }}>{step.title}</h3>
                  <p style={{ color: COLORS.textMuted, fontSize: "clamp(13px, 1.5vw, 14px)", lineHeight: 1.7 }}>{step.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="step-arrow" style={{ position: "absolute", top: "50%", right: -12, transform: "translateY(-50%)", color: COLORS.textDim, fontSize: 22, zIndex: 1 }}>→</div>
                )}
              </Section>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXAM CATEGORIES ── */}
      <section className="section-pad-mobile" style={s.sectionPad}>
        <div style={s.wrap}>
          <Section style={{ textAlign: "center", marginBottom: 60 }}>
            <div className="section-tag">📚 Exam Categories</div>
            <h2 className="syne section-h2" style={{ fontSize: "clamp(1.6rem, 3.5vw, 3rem)", fontWeight: 800, letterSpacing: "-1px" }}>
              All HSC Subjects, <span className="glow-text">One Platform</span>
            </h2>
          </Section>

          <div className="categories-grid">
            {categories.map((cat, i) => (
              <Section key={cat.name} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="glass-card gradient-border" style={{ padding: "clamp(18px, 3vw, 28px) clamp(16px, 3vw, 24px)", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "clamp(10px, 2vw, 16px)" }}>
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: `${cat.color}15`, border: `1px solid ${cat.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                      {cat.emoji}
                    </div>
                    <div>
                      <div className="syne" style={{ fontSize: "clamp(14px, 2vw, 16px)", fontWeight: 700, marginBottom: 4 }}>{cat.name}</div>
                      <div style={{ fontSize: 12, color: cat.color, fontWeight: 600 }}>{cat.q}</div>
                    </div>
                  </div>
                  <div style={{ color: COLORS.textDim, fontSize: 20, flexShrink: 0 }}>→</div>
                </div>
              </Section>
            ))}
          </div>
        </div>
      </section>

      {/* ── BATTLE MODE ── */}
      <section className="section-pad-mobile" style={{ ...s.sectionPad, background: `linear-gradient(135deg, rgba(239,68,68,0.06), rgba(245,158,11,0.06))`, borderTop: `1px solid ${COLORS.border}`, borderBottom: `1px solid ${COLORS.border}` }}>
        <div style={s.wrap}>
          <Section>
            <div style={{ borderRadius: 28, overflow: "hidden", background: `linear-gradient(135deg, rgba(239,68,68,0.08), rgba(245,158,11,0.08))`, border: "1px solid rgba(239,68,68,0.2)", padding: "clamp(32px, 5vw, 60px) clamp(20px, 4vw, 48px)" }}>
              <div className="battle-inner">
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 100, padding: "7px 18px", marginBottom: 24, fontSize: 12, color: "#EF4444", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>
                    ⚔️ Battle Mode
                  </div>
                  <h2 className="syne battle-h2" style={{ fontSize: "clamp(1.6rem, 3vw, 2.8rem)", fontWeight: 800, letterSpacing: "-1px", marginBottom: 20, lineHeight: 1.15 }}>
                    Real-Time MCQ Battles.<br />
                    <span style={{ background: "linear-gradient(135deg, #EF4444, #F59E0B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Only the Sharp Survive.</span>
                  </h2>
                  <p style={{ color: COLORS.textMuted, lineHeight: 1.8, marginBottom: 32, maxWidth: 480, fontSize: "clamp(13px, 2vw, 15px)" }}>
                    Go head-to-head with students across Bangladesh. 20 MCQs. 90 seconds. Pure pressure. The leaderboard doesn't lie — and neither does your GPA.
                  </p>
                  <div className="battle-tags" style={{ display: "flex", gap: 20, flexWrap: "wrap", marginBottom: 36 }}>
                    {["Live matchmaking", "Anti-cheat system", "ELO-based ranking", "Instant results"].map(tag => (
                      <div key={tag} style={{ display: "flex", alignItems: "center", gap: 6, color: COLORS.textMuted, fontSize: 13 }}>
                        <Icon name="check" size={14} color="#EF4444" /> {tag}
                      </div>
                    ))}
                  </div>
                  <button className="btn-primary battle-cta" style={{ background: "linear-gradient(135deg, #EF4444, #F59E0B)", fontSize: "clamp(13px, 2vw, 15px)", padding: "14px 36px", animation: "battle-pulse 2s ease-in-out infinite" }}>
                    <span>⚔️ Enter Battle Arena</span>
                  </button>
                </div>

                {/* Mock battle UI */}
                <div className="battle-mock">
                  <div style={{ background: COLORS.bgCard, borderRadius: 20, border: `1px solid rgba(239,68,68,0.2)`, padding: 24, boxShadow: "0 30px 80px rgba(239,68,68,0.15)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 24, marginBottom: 4 }}>🧑‍💻</div>
                        <div className="syne" style={{ fontSize: 13, fontWeight: 700 }}>You</div>
                        <div style={{ fontSize: 11, color: COLORS.green }}>7/10 ✓</div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: "6px 14px", color: "#EF4444" }} className="syne">
                          <span style={{ fontSize: 18, fontWeight: 800 }}>VS</span>
                        </div>
                        <div style={{ marginTop: 8, fontSize: 11, color: COLORS.textDim }}>⏱ 0:38 left</div>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 24, marginBottom: 4 }}>👤</div>
                        <div className="syne" style={{ fontSize: 13, fontWeight: 700 }}>Rafiq</div>
                        <div style={{ fontSize: 11, color: COLORS.gold }}>6/10 ✓</div>
                      </div>
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "14px 16px", marginBottom: 14 }}>
                      <div style={{ fontSize: 12, color: COLORS.textDim, marginBottom: 8 }}>Q.8 — Physics</div>
                      <div style={{ fontSize: 13, color: COLORS.text, lineHeight: 1.6 }}>The unit of electric field intensity is —</div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      {["N/C", "V/m²", "C/N", "J/C"].map((opt, i) => (
                        <div key={i} style={{ background: i === 0 ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.04)", border: `1px solid ${i === 0 ? COLORS.green : COLORS.border}`, borderRadius: 8, padding: "8px 12px", fontSize: 12, textAlign: "center", color: i === 0 ? COLORS.green : COLORS.textMuted, fontWeight: 600 }}>
                          {opt}
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 11, color: COLORS.textDim }}>
                        <span>Time pressure</span><span style={{ color: "#EF4444" }}>38%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: "38%", background: "linear-gradient(90deg, #EF4444, #F59E0B)" }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Section>
        </div>
      </section>

      {/* ── LEADERBOARD ── */}
      <section className="section-pad-mobile" style={s.sectionPad}>
        <div style={s.wrap}>
          <Section style={{ textAlign: "center", marginBottom: 60 }}>
            <div className="section-tag">🏆 Leaderboard</div>
            <h2 className="syne section-h2" style={{ fontSize: "clamp(1.6rem, 3.5vw, 3rem)", fontWeight: 800, letterSpacing: "-1px" }}>
              Top Performers <span className="glow-text">This Week</span>
            </h2>
            <p style={{ color: COLORS.textMuted, marginTop: 12, fontSize: "clamp(13px, 2vw, 15px)" }}>Updated every 24 hours. Could your name be here?</p>
          </Section>

          <div style={{ maxWidth: 700, margin: "0 auto" }}>
            {leaderboard.map((user, i) => (
              <Section key={user.name} style={{ marginBottom: 12, animationDelay: `${i * 0.1}s` }}>
                <div className="glass-card" style={{ padding: "18px clamp(14px, 3vw, 24px)", display: "flex", alignItems: "center", gap: "clamp(10px, 2vw, 18px)", background: i === 0 ? "rgba(245,158,11,0.06)" : COLORS.bgGlass, borderColor: i === 0 ? "rgba(245,158,11,0.2)" : COLORS.border }}>
                  <div className="rank-badge" style={{ background: i === 0 ? "rgba(245,158,11,0.2)" : i === 1 ? "rgba(203,213,225,0.1)" : i === 2 ? "rgba(180,83,9,0.2)" : "rgba(255,255,255,0.05)", color: i === 0 ? COLORS.gold : i < 3 ? "#CBD5E1" : COLORS.textDim }}>
                    {user.badge || `#${user.rank}`}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="syne lb-row-name" style={{ fontWeight: 700, fontSize: "clamp(13px, 2vw, 15px)", marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</div>
                    <div style={{ fontSize: 12, color: COLORS.textDim }}>{user.class}</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div className="syne" style={{ fontSize: "clamp(14px, 2vw, 16px)", fontWeight: 800, color: i === 0 ? COLORS.gold : COLORS.text }}>{user.score.toLocaleString()}</div>
                    <div style={{ fontSize: 11, color: COLORS.green, fontWeight: 600 }}>{user.change} pts</div>
                  </div>
                </div>
              </Section>
            ))}
          </div>

          <Section style={{ textAlign: "center", marginTop: 36 }}>
            <button className="btn-ghost btn-full-mobile">View Full Leaderboard →</button>
          </Section>
        </div>
      </section>

      {/* ── PERFORMANCE ANALYTICS ── */}
      <section ref={progressRef} className="section-pad-mobile" style={{ ...s.sectionPad, background: "rgba(255,255,255,0.015)", borderTop: `1px solid ${COLORS.border}`, borderBottom: `1px solid ${COLORS.border}` }}>
        <div style={s.wrap}>
          <div className="analytics-grid">
            <Section>
              <div className="section-tag">📈 Analytics</div>
              <h2 className="syne section-h2" style={{ fontSize: "clamp(1.6rem, 3vw, 2.8rem)", fontWeight: 800, letterSpacing: "-1px", marginBottom: 20, lineHeight: 1.2 }}>
                Know Exactly <span className="glow-text">Where to Improve</span>
              </h2>
              <p style={{ color: COLORS.textMuted, lineHeight: 1.8, marginBottom: 32, fontSize: "clamp(13px, 2vw, 15px)" }}>
                Our AI tracks every answer, spot patterns in your mistakes, and shows you the exact topics costing you marks — before the exam does.
              </p>
              {[
                { label: "Accuracy trend over 30 days", icon: "📊" },
                { label: "Topic-wise weakness map", icon: "🗺" },
                { label: "Speed improvement tracking", icon: "⚡" },
                { label: "Comparison with top students", icon: "👥" },
              ].map(item => (
                <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
                  <span style={{ color: COLORS.textMuted, fontSize: "clamp(13px, 1.5vw, 14px)" }}>{item.label}</span>
                </div>
              ))}
            </Section>

            <Section style={{ animationDelay: "0.2s" }}>
              <div className="glass-card" style={{ padding: "clamp(20px, 3vw, 32px)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, flexWrap: "wrap", gap: 10 }}>
                  <div className="syne" style={{ fontWeight: 700, fontSize: 16 }}>Subject Accuracy</div>
                  <Badge color={COLORS.green}>↑ 12% this month</Badge>
                </div>
                {analytics.map(item => (
                  <div key={item.subject} style={{ marginBottom: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontSize: 13, color: COLORS.textMuted }}>{item.subject}</span>
                      <span className="syne" style={{ fontSize: 13, fontWeight: 700, color: item.color }}>{item.pct}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: progressVisible ? `${item.pct}%` : "0%", background: `linear-gradient(90deg, ${item.color}, ${item.color}88)` }} />
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: 24, padding: "14px 16px", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 12 }}>
                  <div style={{ fontSize: 12, color: COLORS.textDim, marginBottom: 4 }}>AI Insight</div>
                  <div style={{ fontSize: 13, color: COLORS.text, lineHeight: 1.6 }}>⚡ Focus on <strong style={{ color: COLORS.gold }}>Biology Chapter 5</strong> — you've missed 60% of those questions in the last 7 days.</div>
                </div>
              </div>
            </Section>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="section-pad-mobile" style={s.sectionPad}>
        <div style={s.wrap}>
          <Section style={{ textAlign: "center", marginBottom: 60 }}>
            <div className="section-tag">💬 Student Reviews</div>
            <h2 className="syne section-h2" style={{ fontSize: "clamp(1.6rem, 3.5vw, 3rem)", fontWeight: 800, letterSpacing: "-1px" }}>
              Real Students. <span className="glow-text">Real Results.</span>
            </h2>
          </Section>

          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <Section key={t.name} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="glass-card" style={{ padding: "clamp(20px, 3vw, 28px)", height: "100%" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18, flexWrap: "wrap", gap: 8 }}>
                    <StarRating />
                    <Badge color={t.color}>{t.result}</Badge>
                  </div>
                  <p className="testimonial-text" style={{ color: COLORS.text, lineHeight: 1.75, fontSize: "clamp(13px, 1.5vw, 14px)", marginBottom: 24 }}>
                    "{t.text}"
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 42, height: 42, borderRadius: "50%", background: `linear-gradient(135deg, ${t.color}, ${t.color}88)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "#fff", fontFamily: "'Syne', sans-serif", flexShrink: 0 }}>
                      {t.avatar}
                    </div>
                    <div>
                      <div className="syne" style={{ fontSize: 14, fontWeight: 700 }}>{t.name}</div>
                      <div style={{ fontSize: 12, color: COLORS.textDim }}>{t.class}</div>
                    </div>
                  </div>
                </div>
              </Section>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="section-pad-mobile" style={{ ...s.sectionPad, background: "rgba(255,255,255,0.015)", borderTop: `1px solid ${COLORS.border}`, borderBottom: `1px solid ${COLORS.border}` }}>
        <div style={s.wrap}>
          <Section style={{ textAlign: "center", marginBottom: 60 }}>
            <div className="section-tag">💰 Pricing</div>
            <h2 className="syne section-h2" style={{ fontSize: "clamp(1.6rem, 3.5vw, 3rem)", fontWeight: 800, letterSpacing: "-1px" }}>
              Simple, <span className="glow-text">Honest Pricing</span>
            </h2>
            <p style={{ color: COLORS.textMuted, marginTop: 12, fontSize: "clamp(13px, 2vw, 15px)" }}>Start free. Upgrade only when you need more.</p>
          </Section>

          <div className="pricing-grid">
            {/* Free */}
            <Section>
              <div className="glass-card" style={{ padding: "clamp(24px, 4vw, 36px)", height: "100%" }}>
                <div style={{ marginBottom: 28 }}>
                  <div className="syne" style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Free</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 8 }}>
                    <span className="syne pricing-amount" style={{ fontSize: "clamp(2rem, 8vw, 2.75rem)", fontWeight: 900, color: COLORS.text }}>৳0</span>
                    <span style={{ color: COLORS.textDim, fontSize: 14 }}>/forever</span>
                  </div>
                  <p style={{ color: COLORS.textMuted, fontSize: 14 }}>Perfect for getting started</p>
                </div>
                {["500 MCQ questions", "3 chapter exams/day", "Basic analytics", "Leaderboard access", "Battle mode (5/day)"].map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                    <Icon name="check" size={16} color={COLORS.green} />
                    <span style={{ fontSize: "clamp(13px, 1.5vw, 14px)", color: COLORS.textMuted }}>{f}</span>
                  </div>
                ))}
                <button className="btn-ghost" style={{ width: "100%", marginTop: 28, textAlign: "center" }}>Start Free</button>
              </div>
            </Section>

            {/* Premium */}
            <Section style={{ animationDelay: "0.15s" }}>
              <div style={{ borderRadius: 20, padding: "clamp(24px, 4vw, 36px)", height: "100%", background: `linear-gradient(135deg, rgba(59,130,246,0.12), rgba(139,92,246,0.1))`, border: `1px solid rgba(59,130,246,0.25)`, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 16, right: 16 }}>
                  <Badge color={COLORS.gold}>Most Popular</Badge>
                </div>
                <div style={{ marginBottom: 28 }}>
                  <div className="syne" style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Premium</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 8 }}>
                    <span className="syne glow-text pricing-amount" style={{ fontSize: "clamp(2rem, 8vw, 2.75rem)", fontWeight: 900 }}>৳299</span>
                    <span style={{ color: COLORS.textDim, fontSize: 14 }}>/month</span>
                  </div>
                  <p style={{ color: COLORS.textMuted, fontSize: 14 }}>For serious exam warriors</p>
                </div>
                {["10,000+ MCQ questions", "Unlimited exams", "Full AI analytics", "Priority leaderboard badge", "Unlimited battles", "Weak topic AI recommendations", "PDF answer sheets", "24/7 support"].map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                    <Icon name="check" size={16} color={COLORS.primary} />
                    <span style={{ fontSize: "clamp(13px, 1.5vw, 14px)", color: COLORS.text }}>{f}</span>
                  </div>
                ))}
                <button className="btn-primary" style={{ width: "100%", marginTop: 28, textAlign: "center" }}>
                  <span>Upgrade to Premium</span>
                </button>
              </div>
            </Section>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="section-pad-mobile" style={{ ...s.sectionPad, position: "relative", overflow: "hidden", textAlign: "center" }}>
        <div style={{ position: "absolute", width: 700, height: 700, borderRadius: "50%", background: `radial-gradient(circle, ${COLORS.primaryGlow} 0%, transparent 65%)`, top: "50%", left: "50%", transform: "translate(-50%, -50%)", filter: "blur(80px)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, ...s.wrap, padding: "0 20px" }}>
          <Section>
            <div style={{ fontSize: 64, marginBottom: 24 }}>🎯</div>
            <h2 className="syne section-h2" style={{ fontSize: "clamp(1.7rem, 4vw, 3.5rem)", fontWeight: 800, letterSpacing: "-1.5px", marginBottom: 20, lineHeight: 1.1 }}>
              Your GPA Doesn't Have<br />
              <span className="glow-text">to Be a Guessing Game.</span>
            </h2>
            <p style={{ color: COLORS.textMuted, fontSize: "clamp(14px, 2vw, 16px)", maxWidth: 520, margin: "0 auto 44px", lineHeight: 1.8 }}>
              50,000 students are already using ExamBattle to prepare smarter. The top rank is taken. Second rank is still available. Don't wait.
            </p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <button className="btn-primary pulse-glow" style={{ fontSize: "clamp(13px, 2vw, 16px)", padding: "16px 44px" }}>
                <span>🚀 Start Your Journey Free</span>
              </button>
              <button className="btn-ghost" style={{ fontSize: "clamp(13px, 2vw, 16px)", padding: "16px 36px" }}>
                Explore All Features →
              </button>
            </div>
            <div style={{ marginTop: 28, color: COLORS.textDim, fontSize: 13 }}>
              No credit card. No commitment. Cancel anytime. ✓
            </div>
          </Section>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: `1px solid ${COLORS.border}`, padding: "60px 20px 36px", background: "rgba(0,0,0,0.3)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="footer-grid">
            <div>
              <div className="syne" style={{ fontSize: 20, fontWeight: 800, display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>⚡</div>
                <span className="glow-text">ExamBattle</span>
              </div>
              <p style={{ color: COLORS.textDim, fontSize: 13, lineHeight: 1.8, maxWidth: 260 }}>
                The premier HSC preparation platform in Bangladesh. Study smart. Rank high. Win.
              </p>
              <div className="footer-social" style={{ display: "flex", gap: 12, marginTop: 20 }}>
                {["𝕏", "f", "in", "▶"].map((icon, i) => (
                  <div key={i} style={{ width: 36, height: 36, borderRadius: 10, background: COLORS.bgGlass, border: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: COLORS.textMuted, fontSize: 14, fontWeight: 700, transition: "all 0.2s", flexShrink: 0 }}>
                    {icon}
                  </div>
                ))}
              </div>
            </div>
            {[
              { title: "Product", links: ["Features", "Exams", "Battle Mode", "Leaderboard", "Analytics"] },
              { title: "Company", links: ["About Us", "Careers", "Blog", "Press"] },
              { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Contact"] },
            ].map(col => (
              <div key={col.title}>
                <div className="syne" style={{ fontSize: 12, fontWeight: 700, color: COLORS.textDim, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 20 }}>{col.title}</div>
                {col.links.map(link => (
                  <div key={link} style={{ color: COLORS.textMuted, fontSize: 13, marginBottom: 12, cursor: "pointer", transition: "color 0.2s" }}
                    onMouseEnter={e => e.target.style.color = COLORS.text}
                    onMouseLeave={e => e.target.style.color = COLORS.textMuted}>
                    {link}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: 28, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <span style={{ color: COLORS.textDim, fontSize: 13 }}>© 2025 ExamBattle. All rights reserved. Made with ⚡ for HSC students.</span>
            <span style={{ color: COLORS.textDim, fontSize: 13 }}>Bangladesh 🇧🇩</span>
          </div>
        </div>
      </footer>
    </>
  );
}