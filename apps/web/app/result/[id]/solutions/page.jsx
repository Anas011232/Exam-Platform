"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function SolutionPage() {
  const { id } = useParams();
  const router = useRouter();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResult = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/exam/result/${id}`
        );

        const data = await res.json();

        console.log("RESULT DATA:", data);

        setResult(data.result || data);

      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadResult();
    }
  }, [id]);

  // ================= LOADING =================
  if (loading) {
    return (
      <>
        <style>{styles}</style>

        <div className="sol-root">
          <div className="sol-loader-wrap">
            <div className="loader-ring"></div>
            <p className="sol-loader">Loading Solutions...</p>
          </div>
        </div>
      </>
    );
  }

  // ================= NO RESULT =================
  if (!result) {
    return (
      <>
        <style>{styles}</style>

        <div className="sol-root">
          <div className="empty-box">
            <h1>No Result Found</h1>

            <button
              className="back-btn"
              onClick={() => router.back()}
            >
              ← Go Back
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>

      <div className="sol-root">

        {/* BACKGROUND EFFECTS */}
        <div className="orb orb1"></div>
        <div className="orb orb2"></div>

        {/* HEADER */}
        <div className="sol-header">

          <div>
            <p className="sol-mini">
              EXAM ANALYSIS
            </p>

            <h1>
              Detailed Solutions
            </h1>

            <p className="sol-sub">
              Review your answers, mistakes &
              explanations.
            </p>
          </div>

          <button
            className="back-btn"
            onClick={() => router.back()}
          >
            ← Back
          </button>

        </div>

        {/* SUMMARY */}
        <div className="summary-grid">

          <div className="summary-card">
            <span>Total</span>
            <h2>{result.total}</h2>
          </div>

          <div className="summary-card correct-card">
            <span>Correct</span>
            <h2>{result.correct}</h2>
          </div>

          <div className="summary-card wrong-card">
            <span>Wrong</span>
            <h2>{result.wrong}</h2>
          </div>

          <div className="summary-card score-card">
            <span>Score</span>
            <h2>{result.score}</h2>
          </div>

        </div>

        {/* SOLUTIONS */}
        <div className="sol-grid">

          {result?.solutions?.map((item, index) => {

            const isCorrect =
              item.userAnswer === item.correctAnswer;

            return (
              <div
                key={index}
                className={`question-card ${
                  isCorrect
                    ? "correct"
                    : "wrong"
                }`}
              >

                {/* TOP */}
                <div className="q-top">

                  <div className="q-left">

                    <div className="q-number">
                      {index + 1}
                    </div>

                    <div>

                      <div className="chapter">
                        {item.chapter || "General"}
                      </div>

                      <div className="topic">
                        {item.topic || "Topic"}
                      </div>

                    </div>

                  </div>

                  <div
                    className={`status ${
                      isCorrect
                        ? "ok"
                        : "bad"
                    }`}
                  >
                    {isCorrect
                      ? "Correct"
                      : "Wrong"}
                  </div>

                </div>

                {/* QUESTION */}
                <h2 className="question">
                  {item.question}
                </h2>

                {/* OPTIONS */}
                <div className="options-wrap">

                  {item.options?.map((opt, i) => {

                    const isUser =
                      opt === item.userAnswer;

                    const isAns =
                      opt === item.correctAnswer;

                    return (
                      <div
                        key={i}
                        className={`
                          option
                          ${isUser ? "user-option" : ""}
                          ${isAns ? "correct-option" : ""}
                        `}
                      >

                        <span>{opt}</span>

                        {isAns && (
                          <span className="tag correct-tag">
                            Correct
                          </span>
                        )}

                        {isUser && !isAns && (
                          <span className="tag wrong-tag">
                            Your Answer
                          </span>
                        )}

                      </div>
                    );
                  })}

                </div>

                {/* ANSWER BOX */}
                <div className="answer-box">

                  <div className="answer-row">
                    <span>Your Answer</span>

                    <strong className="wrong-text">
                      {item.userAnswer ||
                        "Not Answered"}
                    </strong>
                  </div>

                  <div className="answer-row">
                    <span>Correct Answer</span>

                    <strong className="correct-text">
                      {item.correctAnswer}
                    </strong>
                  </div>

                </div>

                {/* EXPLANATION */}
                <div className="explanation-box">

                  <p className="exp-title">
                    Explanation
                  </p>

                  <p className="exp-text">
                    {item.explanation ||
                      "No explanation available."}
                  </p>

                </div>

              </div>
            );
          })}

        </div>

      </div>
    </>
  );
}

const styles = `
*{
  margin:0;
  padding:0;
  box-sizing:border-box;
}

body{
  background:#050816;
}

.sol-root{
  min-height:100vh;
  background:#050816;
  color:white;
  padding:40px 20px;
  position:relative;
  overflow:hidden;
}

.orb{
  position:fixed;
  border-radius:50%;
  filter:blur(100px);
  z-index:0;
}

.orb1{
  width:350px;
  height:350px;
  background:rgba(34,211,238,0.10);
  top:-100px;
  left:-100px;
}

.orb2{
  width:350px;
  height:350px;
  background:rgba(167,139,250,0.10);
  right:-100px;
  bottom:-100px;
}

.sol-loader-wrap{
  min-height:100vh;
  display:flex;
  justify-content:center;
  align-items:center;
  flex-direction:column;
  gap:20px;
}

.loader-ring{
  width:60px;
  height:60px;
  border-radius:50%;
  border:4px solid rgba(255,255,255,0.1);
  border-top:4px solid #22d3ee;
  animation:spin 1s linear infinite;
}

@keyframes spin{
  to{
    transform:rotate(360deg);
  }
}

.sol-loader{
  font-size:22px;
  font-weight:700;
}

.empty-box{
  min-height:100vh;
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
  gap:20px;
}

.sol-header{
  max-width:1200px;
  margin:auto;
  margin-bottom:30px;
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:20px;
  flex-wrap:wrap;
  position:relative;
  z-index:2;
}

.sol-mini{
  color:#22d3ee;
  letter-spacing:4px;
  font-size:12px;
  margin-bottom:10px;
}

.sol-header h1{
  font-size:52px;
  font-weight:800;
  line-height:1;
  margin-bottom:12px;
}

.sol-sub{
  color:#94a3b8;
  font-size:15px;
}

.back-btn{
  border:none;
  padding:14px 20px;
  border-radius:14px;
  background:#111827;
  color:white;
  cursor:pointer;
  transition:0.3s;
  font-size:15px;
  font-weight:600;
}

.back-btn:hover{
  background:#1f2937;
  transform:translateY(-2px);
}

.summary-grid{
  max-width:1200px;
  margin:auto;
  margin-bottom:30px;
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:18px;
  position:relative;
  z-index:2;
}

.summary-card{
  background:rgba(255,255,255,0.04);
  border:1px solid rgba(255,255,255,0.08);
  border-radius:24px;
  padding:28px;
  backdrop-filter:blur(14px);
}

.summary-card span{
  color:#94a3b8;
  font-size:14px;
}

.summary-card h2{
  margin-top:10px;
  font-size:42px;
  font-weight:800;
}

.correct-card h2{
  color:#34d399;
}

.wrong-card h2{
  color:#fb7185;
}

.score-card h2{
  color:#22d3ee;
}

.sol-grid{
  max-width:1200px;
  margin:auto;
  display:grid;
  gap:28px;
  position:relative;
  z-index:2;
}

.question-card{
  border-radius:28px;
  padding:30px;
  border:1px solid rgba(255,255,255,0.08);
  background:rgba(255,255,255,0.04);
  backdrop-filter:blur(16px);
}

.correct{
  box-shadow:0 0 30px rgba(52,211,153,0.08);
}

.wrong{
  box-shadow:0 0 30px rgba(251,113,133,0.08);
}

.q-top{
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:20px;
  margin-bottom:22px;
  flex-wrap:wrap;
}

.q-left{
  display:flex;
  align-items:center;
  gap:16px;
}

.q-number{
  width:60px;
  height:60px;
  border-radius:18px;
  background:#0f172a;
  display:flex;
  justify-content:center;
  align-items:center;
  color:#22d3ee;
  font-weight:800;
  font-size:20px;
}

.chapter{
  color:#22d3ee;
  font-size:13px;
  margin-bottom:4px;
}

.topic{
  color:#94a3b8;
  font-size:13px;
}

.status{
  padding:10px 18px;
  border-radius:999px;
  font-size:13px;
  font-weight:700;
}

.ok{
  background:rgba(52,211,153,0.15);
  color:#34d399;
}

.bad{
  background:rgba(251,113,133,0.15);
  color:#fb7185;
}

.question{
  font-size:26px;
  line-height:1.6;
  margin-bottom:28px;
}

.options-wrap{
  display:grid;
  gap:14px;
  margin-bottom:24px;
}

.option{
  background:#0b1220;
  border:1px solid transparent;
  padding:18px;
  border-radius:16px;
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:15px;
  flex-wrap:wrap;
}

.correct-option{
  border-color:#34d399;
}

.user-option{
  border-color:#fb7185;
}

.tag{
  padding:6px 12px;
  border-radius:999px;
  font-size:12px;
  font-weight:700;
}

.correct-tag{
  background:rgba(52,211,153,0.15);
  color:#34d399;
}

.wrong-tag{
  background:rgba(251,113,133,0.15);
  color:#fb7185;
}

.answer-box{
  display:grid;
  gap:14px;
  margin-bottom:24px;
}

.answer-row{
  display:flex;
  justify-content:space-between;
  gap:15px;
  background:#0b1220;
  padding:18px;
  border-radius:16px;
  flex-wrap:wrap;
}

.answer-row span{
  color:#94a3b8;
}

.correct-text{
  color:#34d399;
}

.wrong-text{
  color:#fb7185;
}

.explanation-box{
  background:#0b1220;
  padding:24px;
  border-radius:20px;
}

.exp-title{
  color:#22d3ee;
  margin-bottom:12px;
  font-weight:700;
  font-size:18px;
}

.exp-text{
  color:#cbd5e1;
  line-height:1.9;
  font-size:15px;
}

@media(max-width:900px){

  .summary-grid{
    grid-template-columns:repeat(2,1fr);
  }

}

@media(max-width:768px){

  .sol-header h1{
    font-size:34px;
  }

  .question{
    font-size:20px;
  }

  .question-card{
    padding:22px;
  }

}

@media(max-width:520px){

  .summary-grid{
    grid-template-columns:1fr;
  }

  .summary-card h2{
    font-size:34px;
  }

  .question{
    font-size:18px;
  }

  .option{
    padding:15px;
  }

}
`;