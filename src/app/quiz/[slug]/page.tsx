"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface Option {
  id: number;
  label: string;
  value: string;
}

interface Question {
  id: number;
  type: string;
  content: string;
  points: number;
  hint: string | null;
  options: Option[];
}

interface Quiz {
  id: number;
  title: string;
  description: string | null;
  category: string;
  difficulty: string;
  timeLimit: number;
  author: { username: string };
  questions: Question[];
  totalQuestions: number;
}

interface ResultItem {
  questionId: number;
  content: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  points: number;
}

export default function QuizPlayerPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [typedAnswer, setTypedAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    totalScore: number;
    maxScore: number;
    results: ResultItem[];
  } | null>(null);

  useEffect(() => {
    fetch(`/api/quiz/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.quiz) {
          setQuiz(data.quiz);
          setTimeLeft(data.quiz.timeLimit);
        }
        setLoading(false);
      });
  }, [slug]);

  const handleSubmit = useCallback(async () => {
    if (!quiz || submitting) return;
    setSubmitting(true);

    const timeTaken = Math.round((Date.now() - startTime) / 1000);

    const res = await fetch(`/api/quiz/${slug}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers, timeTaken }),
    });

    const data = await res.json();
    setResult(data);
    setSubmitting(false);
  }, [quiz, submitting, startTime, slug, answers]);

  // Timer countdown
  useEffect(() => {
    if (!started || result) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [started, timeLeft, result, handleSubmit]);

  const startQuiz = () => {
    setStarted(true);
    setStartTime(Date.now());
  };

  const currentQuestion = quiz?.questions[currentIndex];

  const selectAnswer = (value: string) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  };

  const goNext = () => {
    if (currentQuestion && currentQuestion.type === "typing") {
      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: typedAnswer }));
    }
    setTypedAnswer("");

    if (quiz && currentIndex < quiz.questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      handleSubmit();
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 flex items-center justify-center text-white">
        Memuat quiz...
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 flex items-center justify-center text-white">
        Quiz tidak ditemukan.
      </div>
    );
  }

  // Halaman hasil
  if (result) {
    const percentage = Math.round((result.totalScore / result.maxScore) * 100);
    return (
      <main className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 text-white">
        <section className="max-w-2xl mx-auto px-4 py-12">
          <div className="text-center mb-10">
            <div className="text-6xl mb-4">
              {percentage >= 70 ? "🎉" : percentage >= 40 ? "👍" : "💪"}
            </div>
            <h1 className="text-3xl font-black mb-2">Quiz Selesai!</h1>
            <p className="text-white/50 text-sm">
              Berikut hasil kamu untuk "{quiz.title}"
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center mb-8">
            <div className="text-5xl font-black text-yellow-400 mb-2">
              {result.totalScore}{" "}
              <span className="text-2xl text-white/40">
                / {result.maxScore}
              </span>
            </div>
            <div className="text-white/50 text-sm">
              Total poin ({percentage}%)
            </div>
          </div>

          <div className="space-y-3 mb-8">
            {result.results.map((r, i) => (
              <div
                key={r.questionId}
                className={`border rounded-xl p-4 ${
                  r.isCorrect
                    ? "bg-green-400/10 border-green-400/30"
                    : "bg-red-400/10 border-red-400/30"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium mb-1">
                      {i + 1}. {r.content}
                    </p>
                    <p className="text-xs text-white/50">
                      Jawabanmu:{" "}
                      <span className="font-medium">
                        {r.userAnswer || "(kosong)"}
                      </span>
                    </p>
                    {!r.isCorrect && (
                      <p className="text-xs text-green-300 mt-1">
                        Jawaban benar:{" "}
                        <span className="font-medium">{r.correctAnswer}</span>
                      </p>
                    )}
                  </div>
                  <span className="text-lg">{r.isCorrect ? "✅" : "❌"}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <Link
              href="/quiz"
              className="flex-1 bg-white/10 border border-white/20 font-semibold py-3 rounded-xl text-sm hover:bg-white/20 transition text-center"
            >
              Quiz Lainnya
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-bold py-3 rounded-xl text-sm hover:opacity-90 transition"
            >
              Main Lagi
            </button>
          </div>
        </section>
      </main>
    );
  }

  // Halaman intro sebelum mulai
  if (!started) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 flex items-center justify-center text-white px-4">
        <div className="max-w-md w-full text-center">
          <span className="text-xs bg-white/10 text-white/60 px-3 py-1 rounded-full">
            {quiz.category}
          </span>
          <h1 className="text-3xl font-black mt-4 mb-3">{quiz.title}</h1>
          <p className="text-white/50 text-sm mb-8">
            {quiz.description || "Uji pengetahuanmu sekarang!"}
          </p>

          <div className="flex items-center justify-center gap-6 mb-8 text-sm text-white/60">
            <span>📝 {quiz.totalQuestions} soal</span>
            <span>⏱️ {formatTime(quiz.timeLimit)}</span>
            <span>👤 {quiz.author.username}</span>
          </div>

          <button
            onClick={startQuiz}
            className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-bold px-10 py-3.5 rounded-full text-base hover:opacity-90 transition shadow-lg shadow-orange-500/30"
          >
            Mulai Quiz →
          </button>
        </div>
      </main>
    );
  }

  // Halaman bermain
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 text-white">
      <section className="max-w-2xl mx-auto px-4 py-10">
        {/* Progress & timer */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm text-white/50">
            Soal {currentIndex + 1} / {quiz.questions.length}
          </span>
          <span
            className={`text-sm font-bold px-3 py-1 rounded-full ${
              timeLeft <= 10
                ? "bg-red-500/20 text-red-300"
                : "bg-white/10 text-white"
            }`}
          >
            ⏱️ {formatTime(timeLeft)}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-white/10 rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 transition-all"
            style={{
              width: `${((currentIndex + 1) / quiz.questions.length) * 100}%`,
            }}
          />
        </div>

        {currentQuestion && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <h2 className="text-xl font-bold mb-6">
              {currentQuestion.content}
            </h2>

            {currentQuestion.type === "multiple_choice" && (
              <div className="space-y-3 mb-6">
                {currentQuestion.options.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => selectAnswer(opt.value)}
                    className={`w-full text-left px-5 py-3.5 rounded-xl border text-sm font-medium transition ${
                      answers[currentQuestion.id] === opt.value
                        ? "bg-yellow-400/20 border-yellow-400 text-yellow-300"
                        : "bg-white/5 border-white/20 hover:bg-white/10"
                    }`}
                  >
                    <span className="font-bold mr-2">{opt.label}.</span>{" "}
                    {opt.value}
                  </button>
                ))}
              </div>
            )}

            {currentQuestion.type === "true_false" && (
              <div className="flex gap-3 mb-6">
                {currentQuestion.options.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => selectAnswer(opt.value)}
                    className={`flex-1 py-3.5 rounded-xl border text-sm font-medium transition ${
                      answers[currentQuestion.id] === opt.value
                        ? "bg-yellow-400/20 border-yellow-400 text-yellow-300"
                        : "bg-white/5 border-white/20 hover:bg-white/10"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}

            {currentQuestion.type === "typing" && (
              <input
                type="text"
                value={typedAnswer}
                onChange={(e) => setTypedAnswer(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && goNext()}
                autoFocus
                className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-5 py-3.5 text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-6"
                placeholder="Ketik jawabanmu..."
              />
            )}

            <button
              onClick={goNext}
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-bold py-3.5 rounded-xl text-sm hover:opacity-90 transition"
            >
              {currentIndex < quiz.questions.length - 1
                ? "Soal Berikutnya →"
                : "Selesai & Lihat Hasil 🏁"}
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
