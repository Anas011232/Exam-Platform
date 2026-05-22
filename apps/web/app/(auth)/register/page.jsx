"use client";

import Link from "next/link";
import { useState } from "react";
import { registerUser } from "../../../services/auth.service";

/* ─────────────────────────────────────────────
   Scoped styles injected once at module level
───────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

  .reg-root {
    min-height: 100svh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px 16px;
    background: #05070f;
    font-family: 'DM Sans', system-ui, sans-serif;
    position: relative;
    overflow: hidden;
  }

  /* ── layered background blobs ── */
  .reg-blob {
    position: fixed;
    border-radius: 50%;
    filter: blur(90px);
    pointer-events: none;
    will-change: transform;
  }
  .reg-blob-1 {
    width: 560px; height: 560px;
    background: radial-gradient(circle, rgba(99,102,241,0.35) 0%, transparent 70%);
    top: -160px; left: -140px;
    animation: blobDrift1 14s ease-in-out infinite alternate;
  }
  .reg-blob-2 {
    width: 480px; height: 480px;
    background: radial-gradient(circle, rgba(6,182,212,0.22) 0%, transparent 70%);
    bottom: -120px; right: -100px;
    animation: blobDrift2 18s ease-in-out infinite alternate;
  }
  .reg-blob-3 {
    width: 320px; height: 320px;
    background: radial-gradient(circle, rgba(168,85,247,0.18) 0%, transparent 70%);
    top: 40%; left: 55%;
    animation: blobDrift3 22s ease-in-out infinite alternate;
  }
  @keyframes blobDrift1 {
    from { transform: translate(0,0) scale(1); }
    to   { transform: translate(40px, 30px) scale(1.08); }
  }
  @keyframes blobDrift2 {
    from { transform: translate(0,0) scale(1); }
    to   { transform: translate(-30px, -40px) scale(1.12); }
  }
  @keyframes blobDrift3 {
    from { transform: translate(0,0) scale(1); }
    to   { transform: translate(-50px, 20px) scale(0.92); }
  }

  /* subtle noise overlay */
  .reg-noise {
    position: fixed;
    inset: 0;
    pointer-events: none;
    opacity: 0.028;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 180px;
    z-index: 1;
  }

  /* ── card ── */
  .reg-card {
    position: relative;
    z-index: 2;
    width: 100%;
    max-width: 480px;
    background: rgba(255,255,255,0.045);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 28px;
    padding: 40px 36px 36px;
    backdrop-filter: blur(24px) saturate(160%);
    -webkit-backdrop-filter: blur(24px) saturate(160%);
    box-shadow:
      0 0 0 1px rgba(255,255,255,0.06) inset,
      0 24px 80px rgba(0,0,0,0.55),
      0 0 120px rgba(99,102,241,0.08);
    transition: box-shadow 0.4s ease, transform 0.4s ease;
    animation: cardReveal 0.55s cubic-bezier(.22,1,.36,1) both;
  }
  .reg-card:hover {
    transform: translateY(-3px);
    box-shadow:
      0 0 0 1px rgba(255,255,255,0.1) inset,
      0 32px 100px rgba(0,0,0,0.6),
      0 0 160px rgba(99,102,241,0.12);
  }
  @keyframes cardReveal {
    from { opacity: 0; transform: translateY(28px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  /* ── logo mark ── */
  .reg-logo {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-bottom: 28px;
  }
  .reg-logo-icon {
    width: 40px; height: 40px;
    border-radius: 12px;
    background: linear-gradient(135deg, #6366f1, #06b6d4);
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
    box-shadow: 0 6px 24px rgba(99,102,241,0.4);
  }
  .reg-logo-name {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 20px;
    background: linear-gradient(135deg, #a5b4fc, #67e8f9);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: -0.4px;
  }

  /* ── headings ── */
  .reg-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(1.55rem, 4vw, 1.9rem);
    font-weight: 800;
    color: #f1f5f9;
    text-align: center;
    letter-spacing: -0.6px;
    margin-bottom: 6px;
    line-height: 1.15;
  }
  .reg-subtitle {
    text-align: center;
    font-size: 13.5px;
    color: rgba(148,163,184,0.85);
    margin-bottom: 28px;
    font-weight: 400;
  }

  /* ── divider ── */
  .reg-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
    margin-bottom: 24px;
  }

  /* ── field group ── */
  .reg-fields { display: flex; flex-direction: column; gap: 14px; }

  .reg-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .reg-label {
    font-size: 12px;
    font-weight: 600;
    color: rgba(148,163,184,0.9);
    letter-spacing: 0.4px;
    text-transform: uppercase;
    padding-left: 2px;
  }

  /* ── input wrapper (for icon) ── */
  .reg-input-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }
  .reg-input-icon {
    position: absolute;
    left: 14px;
    color: rgba(148,163,184,0.5);
    pointer-events: none;
    display: flex;
    align-items: center;
    transition: color 0.2s;
    flex-shrink: 0;
  }

  /* ── inputs & select ── */
  .reg-input,
  .reg-select {
    width: 100%;
    padding: 12px 14px 12px 42px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 14px;
    color: #f1f5f9;
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 14.5px;
    font-weight: 400;
    outline: none;
    transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
    -webkit-appearance: none;
    appearance: none;
  }
  .reg-input::placeholder { color: rgba(100,116,139,0.7); }
  .reg-input:focus,
  .reg-select:focus {
    border-color: rgba(99,102,241,0.7);
    background: rgba(99,102,241,0.08);
    box-shadow: 0 0 0 3px rgba(99,102,241,0.18), 0 0 16px rgba(99,102,241,0.1);
  }
  .reg-input:focus + .reg-input-icon,
  .reg-input-wrap:focus-within .reg-input-icon {
    color: rgba(99,102,241,0.8);
  }

  /* select option colors (browser-painted) */
  .reg-select option { background: #1e293b; color: #f1f5f9; }
  /* custom select arrow */
  .reg-select-arrow {
    position: absolute;
    right: 14px;
    color: rgba(100,116,139,0.6);
    pointer-events: none;
    display: flex;
  }

  /* ── two-column row ── */
  .reg-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }
  @media (max-width: 440px) {
    .reg-row { grid-template-columns: 1fr; }
    .reg-card { padding: 28px 20px 24px; border-radius: 22px; }
    .reg-title { font-size: 1.4rem; }
  }

  /* ── submit button ── */
  .reg-btn {
    width: 100%;
    padding: 14px 20px;
    margin-top: 6px;
    border: none;
    border-radius: 14px;
    background: linear-gradient(135deg, #6366f1 0%, #818cf8 50%, #06b6d4 100%);
    background-size: 200% 200%;
    background-position: 0% 50%;
    color: #fff;
    font-family: 'Syne', sans-serif;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 0.2px;
    cursor: pointer;
    transition: background-position 0.4s ease, transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s;
    position: relative;
    overflow: hidden;
    box-shadow: 0 6px 28px rgba(99,102,241,0.38);
  }
  .reg-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.18) 50%, transparent 65%);
    transform: translateX(-100%);
    transition: transform 0.5s ease;
  }
  .reg-btn:hover:not(:disabled)::before { transform: translateX(100%); }
  .reg-btn:hover:not(:disabled) {
    background-position: 100% 50%;
    transform: translateY(-2px);
    box-shadow: 0 10px 36px rgba(99,102,241,0.5);
  }
  .reg-btn:active:not(:disabled) { transform: translateY(0); }
  .reg-btn:disabled {
    opacity: 0.65;
    cursor: not-allowed;
    transform: none;
  }

  /* spinner */
  .reg-spinner {
    display: inline-block;
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    vertical-align: middle;
    margin-right: 8px;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* ── footer link ── */
  .reg-footer {
    text-align: center;
    margin-top: 22px;
    font-size: 13.5px;
    color: rgba(100,116,139,0.85);
  }
  .reg-footer a {
    color: #a5b4fc;
    font-weight: 600;
    text-decoration: none;
    transition: color 0.2s;
  }
  .reg-footer a:hover { color: #c7d2fe; text-decoration: underline; }

  /* ── security note ── */
  .reg-secure {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    margin-top: 18px;
    font-size: 11.5px;
    color: rgba(71,85,105,0.9);
  }
`;

/* ── Icon helpers ─────────────────────────────────────── */
const Ic = ({ d, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const ICONS = {
  user:    "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  school:  "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10",
  phone:   "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.64 3.18 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.71 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6.07 6.07l.96-.96a2 2 0 0 1 2.11-.45c.9.35 1.85.58 2.81.71A2 2 0 0 1 22 16.92z",
  email:   "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6",
  lock:    "M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4",
  book:    "M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15z",
  chevron: "M6 9l6 6 6-6",
  shield:  "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
};

/* ── Main Component ─────────────────────────────────────── */
export default function RegisterPage() {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    className: "",
    school: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const result = await registerUser(formData);
      localStorage.setItem("accessToken", result.accessToken);
      alert("Registration Success");
      window.location.href = "/dashboard";
    } catch (error) {
      alert(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div className="reg-root">
        {/* background blobs */}
        <div className="reg-blob reg-blob-1" />
        <div className="reg-blob reg-blob-2" />
        <div className="reg-blob reg-blob-3" />
        <div className="reg-noise" />

        <form onSubmit={handleSubmit} className="reg-card">

          {/* logo */}
          <div className="reg-logo">
            <div className="reg-logo-icon">⚡</div>
            <span className="reg-logo-name">ExamBattle</span>
          </div>

          <h1 className="reg-title">Create your account</h1>
          <p className="reg-subtitle">Join 50,000+ students preparing smarter</p>
          <div className="reg-divider" />

          <div className="reg-fields">

            {/* Full Name */}
            <div className="reg-field">
              <label className="reg-label">Full Name</label>
              <div className="reg-input-wrap">
                <span className="reg-input-icon"><Ic d={ICONS.user} /></span>
                <input
                  type="text"
                  name="name"
                  placeholder="Arafat Hossain"
                  className="reg-input"
                  onChange={handleChange}
                  autoComplete="name"
                />
              </div>
            </div>

            {/* Class + School row */}
            <div className="reg-row">
              {/* Class */}
              <div className="reg-field">
                <label className="reg-label">Class</label>
                <div className="reg-input-wrap">
                  <span className="reg-input-icon"><Ic d={ICONS.book} /></span>
                  <select
                    name="className"
                    className="reg-select"
                    onChange={handleChange}
                    defaultValue=""
                  >
                    <option value="" disabled>Select class</option>
                    <option>HSC 1st Year</option>
                    <option>HSC 2nd Year</option>
                    <option>SSC</option>
                  </select>
                  <span className="reg-select-arrow"><Ic d={ICONS.chevron} size={14} /></span>
                </div>
              </div>

              {/* School */}
              <div className="reg-field">
                <label className="reg-label">School / College</label>
                <div className="reg-input-wrap">
                  <span className="reg-input-icon"><Ic d={ICONS.school} /></span>
                  <input
                    type="text"
                    name="school"
                    placeholder="Dhaka College"
                    className="reg-input"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="reg-field">
              <label className="reg-label">Phone</label>
              <div className="reg-input-wrap">
                <span className="reg-input-icon"><Ic d={ICONS.phone} /></span>
                <input
                  type="text"
                  name="phone"
                  placeholder="01712345678"
                  className="reg-input"
                  onChange={handleChange}
                  autoComplete="tel"
                />
              </div>
            </div>

            {/* Email */}
            <div className="reg-field">
              <label className="reg-label">Email Address</label>
              <div className="reg-input-wrap">
                <span className="reg-input-icon"><Ic d={ICONS.email} /></span>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  className="reg-input"
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password + Confirm row */}
            <div className="reg-row">
              <div className="reg-field">
                <label className="reg-label">Password</label>
                <div className="reg-input-wrap">
                  <span className="reg-input-icon"><Ic d={ICONS.lock} /></span>
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    className="reg-input"
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <div className="reg-field">
                <label className="reg-label">Confirm Password</label>
                <div className="reg-input-wrap">
                  <span className="reg-input-icon"><Ic d={ICONS.lock} /></span>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="••••••••"
                    className="reg-input"
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className="reg-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="reg-spinner" />
                  Creating account…
                </>
              ) : (
                "Create Account →"
              )}
            </button>
          </div>

          {/* Footer */}
          <p className="reg-footer">
            Already have an account?{" "}
            <Link href="/login">Sign in</Link>
          </p>

          {/* Security note */}
          <div className="reg-secure">
            <Ic d={ICONS.shield} size={12} />
            Your data is encrypted and secure
          </div>
        </form>
      </div>
    </>
  );
}