"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "../../../services/auth.service";

/* ─────────────────────────────────────────────
   Scoped styles — injected once, no external deps
───────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

  /* ── root ── */
  .login-root {
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

  /* ── animated background blobs ── */
  .login-blob {
    position: fixed;
    border-radius: 50%;
    filter: blur(90px);
    pointer-events: none;
    will-change: transform;
  }
  .login-blob-1 {
    width: 520px; height: 520px;
    background: radial-gradient(circle, rgba(99,102,241,0.32) 0%, transparent 70%);
    top: -140px; right: -80px;
    animation: lbDrift1 16s ease-in-out infinite alternate;
  }
  .login-blob-2 {
    width: 440px; height: 440px;
    background: radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%);
    bottom: -100px; left: -80px;
    animation: lbDrift2 20s ease-in-out infinite alternate;
  }
  .login-blob-3 {
    width: 280px; height: 280px;
    background: radial-gradient(circle, rgba(168,85,247,0.16) 0%, transparent 70%);
    top: 50%; left: 50%;
    animation: lbDrift3 24s ease-in-out infinite alternate;
  }
  @keyframes lbDrift1 {
    from { transform: translate(0, 0) scale(1); }
    to   { transform: translate(-35px, 45px) scale(1.1); }
  }
  @keyframes lbDrift2 {
    from { transform: translate(0, 0) scale(1); }
    to   { transform: translate(45px, -30px) scale(1.08); }
  }
  @keyframes lbDrift3 {
    from { transform: translate(-50%, -50%) scale(1); }
    to   { transform: translate(calc(-50% + 40px), calc(-50% - 30px)) scale(0.9); }
  }

  /* noise overlay */
  .login-noise {
    position: fixed;
    inset: 0;
    pointer-events: none;
    opacity: 0.03;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 180px;
    z-index: 1;
  }

  /* grid lines (subtle) */
  .login-grid {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 1;
    background-image:
      linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
    background-size: 56px 56px;
    opacity: 0.6;
  }

  /* ── card ── */
  .login-card {
    position: relative;
    z-index: 2;
    width: 100%;
    max-width: 420px;
    background: rgba(255,255,255,0.045);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 28px;
    padding: 44px 40px 36px;
    backdrop-filter: blur(28px) saturate(160%);
    -webkit-backdrop-filter: blur(28px) saturate(160%);
    box-shadow:
      0 0 0 1px rgba(255,255,255,0.06) inset,
      0 24px 80px rgba(0,0,0,0.6),
      0 0 120px rgba(99,102,241,0.07);
    transition: box-shadow 0.4s ease, transform 0.4s ease;
    animation: cardReveal 0.5s cubic-bezier(.22,1,.36,1) both;
  }
  .login-card:hover {
    transform: translateY(-4px);
    box-shadow:
      0 0 0 1px rgba(255,255,255,0.1) inset,
      0 32px 100px rgba(0,0,0,0.65),
      0 0 160px rgba(99,102,241,0.12);
  }
  @keyframes cardReveal {
    from { opacity: 0; transform: translateY(30px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0)    scale(1);    }
  }

  /* ── logo ── */
  .login-logo {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-bottom: 32px;
  }
  .login-logo-icon {
    width: 40px; height: 40px;
    border-radius: 12px;
    background: linear-gradient(135deg, #6366f1, #06b6d4);
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
    box-shadow: 0 6px 24px rgba(99,102,241,0.45);
    flex-shrink: 0;
  }
  .login-logo-name {
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
  .login-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(1.6rem, 5vw, 2rem);
    font-weight: 800;
    color: #f1f5f9;
    text-align: center;
    letter-spacing: -0.7px;
    line-height: 1.15;
    margin-bottom: 6px;
  }
  .login-subtitle {
    text-align: center;
    font-size: 13.5px;
    color: rgba(148,163,184,0.8);
    margin-bottom: 28px;
    font-weight: 400;
  }
  .login-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
    margin-bottom: 26px;
  }

  /* ── error banner ── */
  .login-error {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(239,68,68,0.1);
    border: 1px solid rgba(239,68,68,0.25);
    border-radius: 12px;
    padding: 11px 14px;
    margin-bottom: 18px;
    font-size: 13.5px;
    font-weight: 500;
    color: #fca5a5;
    animation: errShake 0.35s cubic-bezier(.36,.07,.19,.97) both;
  }
  @keyframes errShake {
    0%,100% { transform: translateX(0); }
    20%,60%  { transform: translateX(-5px); }
    40%,80%  { transform: translateX(5px); }
  }

  /* ── fields ── */
  .login-fields { display: flex; flex-direction: column; gap: 16px; }

  .login-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .login-label {
    font-size: 11.5px;
    font-weight: 600;
    color: rgba(148,163,184,0.85);
    letter-spacing: 0.5px;
    text-transform: uppercase;
    padding-left: 2px;
  }

  .login-input-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }
  .login-input-icon {
    position: absolute;
    left: 14px;
    color: rgba(100,116,139,0.55);
    pointer-events: none;
    display: flex;
    align-items: center;
    transition: color 0.2s ease;
    flex-shrink: 0;
  }
  .login-input-wrap:focus-within .login-input-icon {
    color: rgba(99,102,241,0.85);
  }

  .login-input {
    width: 100%;
    padding: 13px 14px 13px 44px;
    background: rgba(255,255,255,0.055);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 14px;
    color: #f1f5f9;
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 14.5px;
    font-weight: 400;
    outline: none;
    transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
  }
  .login-input::placeholder { color: rgba(100,116,139,0.65); }
  .login-input:focus {
    border-color: rgba(99,102,241,0.7);
    background: rgba(99,102,241,0.08);
    box-shadow: 0 0 0 3px rgba(99,102,241,0.18), 0 0 18px rgba(99,102,241,0.1);
  }

  /* ── forgot link ── */
  .login-forgot-row {
    display: flex;
    justify-content: flex-end;
    margin-top: -8px;
  }
  .login-forgot {
    font-size: 12px;
    color: rgba(99,102,241,0.8);
    font-weight: 500;
    text-decoration: none;
    transition: color 0.2s;
    cursor: pointer;
  }
  .login-forgot:hover { color: #a5b4fc; text-decoration: underline; }

  /* ── submit button ── */
  .login-btn {
    width: 100%;
    padding: 14px 20px;
    margin-top: 4px;
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
    position: relative;
    overflow: hidden;
    box-shadow: 0 6px 28px rgba(99,102,241,0.38);
    transition: background-position 0.45s ease, transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s;
  }
  /* shine sweep */
  .login-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.2) 50%, transparent 65%);
    transform: translateX(-100%);
    transition: transform 0.5s ease;
  }
  .login-btn:hover:not(:disabled)::before { transform: translateX(100%); }
  .login-btn:hover:not(:disabled) {
    background-position: 100% 50%;
    transform: translateY(-2px);
    box-shadow: 0 10px 36px rgba(99,102,241,0.52);
  }
  .login-btn:active:not(:disabled) { transform: translateY(0); }
  .login-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  /* spinner */
  .login-spinner {
    display: inline-block;
    width: 15px; height: 15px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.65s linear infinite;
    vertical-align: middle;
    margin-right: 8px;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── footer ── */
  .login-footer {
    text-align: center;
    margin-top: 24px;
    font-size: 13.5px;
    color: rgba(100,116,139,0.85);
  }
  .login-footer a {
    color: #a5b4fc;
    font-weight: 600;
    text-decoration: none;
    transition: color 0.2s;
  }
  .login-footer a:hover { color: #c7d2fe; text-decoration: underline; }

  /* security note */
  .login-secure {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    margin-top: 18px;
    font-size: 11.5px;
    color: rgba(71,85,105,0.85);
  }

  /* ── mobile ── */
  @media (max-width: 480px) {
    .login-card {
      padding: 30px 20px 26px;
      border-radius: 22px;
    }
    .login-title { font-size: 1.5rem; }
  }
`;

/* ── SVG icon helper ── */
const Ic = ({ d, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const PATHS = {
  email:  "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6",
  lock:   "M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4",
  alert:  "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
};

/* ── Component ── */
export default function LoginPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const result = await loginUser(formData);

      console.log("LOGIN RESULT:", result);

      if (!result?.accessToken) {
        throw new Error("Invalid login response");
      }

      // save token
      localStorage.setItem("accessToken", result.accessToken);

      // IMPORTANT: backend does NOT send user object
      const role = result.role?.toLowerCase();

      // optional: store minimal user info
      localStorage.setItem(
        "user",
        JSON.stringify({ email: formData.email, role: result.role })
      );

      alert("Login Success");

      // ROLE BASED REDIRECT
      if (role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/dashboard");
      }

    } catch (err) {
      console.log(err);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div className="login-root">
        {/* background */}
        <div className="login-blob login-blob-1" />
        <div className="login-blob login-blob-2" />
        <div className="login-blob login-blob-3" />
        <div className="login-noise" />
        <div className="login-grid" />

        <form onSubmit={handleSubmit} className="login-card">

          {/* logo */}
          <div className="login-logo">
            <div className="login-logo-icon">⚡</div>
            <span className="login-logo-name">ExamBattle</span>
          </div>

          <h1 className="login-title">Welcome back</h1>
          <p className="login-subtitle">Sign in to continue your preparation</p>
          <div className="login-divider" />

          {/* error */}
          {error && (
            <div className="login-error">
              <Ic d={PATHS.alert} size={15} />
              {error}
            </div>
          )}

          <div className="login-fields">

            {/* Email */}
            <div className="login-field">
              <label className="login-label">Email Address</label>
              <div className="login-input-wrap">
                <span className="login-input-icon"><Ic d={PATHS.email} /></span>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  className="login-input"
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="login-field">
              <label className="login-label">Password</label>
              <div className="login-input-wrap">
                <span className="login-input-icon"><Ic d={PATHS.lock} /></span>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  className="login-input"
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            {/* Forgot password */}
            <div className="login-forgot-row">
              <span className="login-forgot">Forgot password?</span>
            </div>

            {/* Submit */}
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="login-spinner" />
                  Signing in…
                </>
              ) : (
                "Sign In →"
              )}
            </button>

          </div>

          {/* footer */}
          <p className="login-footer">
            Don&apos;t have an account?{" "}
            <Link href="/register">Create one free</Link>
          </p>

          {/* security badge */}
          <div className="login-secure">
            <Ic d={PATHS.shield} size={12} />
            Secured with end-to-end encryption
          </div>

        </form>
      </div>
    </>
  );
}