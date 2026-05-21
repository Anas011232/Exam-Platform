//            This is Main Routing Page....

import Link from "next/link";

export default function Home() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📚 Exam Platform</h1>
      <p style={styles.subtitle}>
        HSC MCQ Practice • Battle Mode • Leaderboard
      </p>

      <div style={styles.btnGroup}>
        <Link href="/login" style={styles.button}>
          Login
        </Link>

        <Link href="/register" style={styles.buttonOutline}>
          Register
        </Link>

        <Link href="/dashboard" style={styles.buttonDark}>
          Go Dashboard
        </Link>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f172a",
    color: "white",
    textAlign: "center",
  },
  title: {
    fontSize: "3rem",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "1.2rem",
    opacity: 0.8,
    marginBottom: "30px",
  },
  btnGroup: {
    display: "flex",
    gap: "15px",
  },
  button: {
    padding: "10px 20px",
    background: "#3b82f6",
    color: "white",
    textDecoration: "none",
    borderRadius: "8px",
  },
  buttonOutline: {
    padding: "10px 20px",
    border: "1px solid white",
    color: "white",
    textDecoration: "none",
    borderRadius: "8px",
  },
  buttonDark: {
    padding: "10px 20px",
    background: "#10b981",
    color: "white",
    textDecoration: "none",
    borderRadius: "8px",
  },
};