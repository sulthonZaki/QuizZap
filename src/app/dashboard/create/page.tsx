"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type QuestionType = "multiple_choice" | "typing" | "true_false";

interface Question {
  type: QuestionType;
  content: string;
  answer: string;
  points: number;
  options: { label: string; value: string; isCorrect: boolean }[];
}

const emptyQuestion = (): Question => ({
  type: "multiple_choice",
  content: "",
  answer: "",
  points: 10,
  options: [
    { label: "A", value: "", isCorrect: true },
    { label: "B", value: "", isCorrect: false },
    { label: "C", value: "", isCorrect: false },
    { label: "D", value: "", isCorrect: false },
  ],
});

export default function CreateQuizPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [quizInfo, setQuizInfo] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "medium",
    timeLimit: 300,
  });

  const [questions, setQuestions] = useState<Question[]>([emptyQuestion()]);

  const updateQuestion = (index: number, updated: Partial<Question>) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, ...updated } : q)),
    );
  };

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIndex) return q;
        const newOptions = q.options.map((opt, j) =>
          j === oIndex ? { ...opt, value } : opt,
        );
        return { ...q, options: newOptions };
      }),
    );
  };

  const setCorrectOption = (qIndex: number, oIndex: number) => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIndex) return q;
        const newOptions = q.options.map((opt, j) => ({
          ...opt,
          isCorrect: j === oIndex,
        }));
        return { ...q, options: newOptions };
      }),
    );
  };

  const addQuestion = () => setQuestions((prev) => [...prev, emptyQuestion()]);

  const removeQuestion = (index: number) => {
    if (questions.length === 1) return;
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const changeQuestionType = (index: number, type: QuestionType) => {
    updateQuestion(index, {
      type,
      answer: "",
      options:
        type === "true_false"
          ? [
              { label: "Benar", value: "true", isCorrect: true },
              { label: "Salah", value: "false", isCorrect: false },
            ]
          : type === "multiple_choice"
            ? emptyQuestion().options
            : [],
    });
  };

  const handleSubmit = async () => {
    setError("");

    if (!quizInfo.title || !quizInfo.category) {
      setError("Judul dan kategori wajib diisi");
      setStep(1);
      return;
    }

    for (const q of questions) {
      if (!q.content) {
        setError("Semua soal harus diisi");
        return;
      }
      if (
        q.type === "multiple_choice" &&
        !q.options.some((o) => o.isCorrect && o.value)
      ) {
        setError("Setiap pilihan ganda harus punya jawaban benar yang terisi");
        return;
      }
      if (q.type === "typing" && !q.answer) {
        setError("Soal typing harus punya jawaban");
        return;
      }
    }

    setLoading(true);

    const payload = {
      ...quizInfo,
      questions: questions.map((q) => ({
        type: q.type,
        content: q.content,
        points: q.points,
        answer:
          q.type === "multiple_choice"
            ? q.options.find((o) => o.isCorrect)?.value || ""
            : q.type === "true_false"
              ? q.options.find((o) => o.isCorrect)?.value || "true"
              : q.answer,
        options:
          q.type === "multiple_choice" || q.type === "true_false"
            ? q.options
            : undefined,
      })),
    };

    const res = await fetch("/api/quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 text-white">
      <nav className="flex items-center justify-between px-8 py-5 max-w-4xl mx-auto">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-2xl">⚡</span>
          <span className="text-xl font-bold tracking-tight">QuizZap</span>
        </Link>
        <Link
          href="/dashboard"
          className="text-sm text-white/70 hover:text-white transition"
        >
          ← Kembali ke dashboard
        </Link>
      </nav>

      <section className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-black mb-2">Buat Quiz Baru</h1>
        <p className="text-white/50 text-sm mb-8">
          {step === 1
            ? "Langkah 1: Informasi dasar quiz"
            : "Langkah 2: Tambahkan soal-soal"}
        </p>

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-300 text-sm px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {step === 1 && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">
                Judul Quiz
              </label>
              <input
                type="text"
                value={quizInfo.title}
                onChange={(e) =>
                  setQuizInfo({ ...quizInfo, title: e.target.value })
                }
                className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Contoh: Tebak Ibu Kota Negara Asia"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">
                Deskripsi
              </label>
              <textarea
                value={quizInfo.description}
                onChange={(e) =>
                  setQuizInfo({ ...quizInfo, description: e.target.value })
                }
                className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Jelaskan tentang quiz ini..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">
                  Kategori
                </label>
                <input
                  type="text"
                  value={quizInfo.category}
                  onChange={(e) =>
                    setQuizInfo({ ...quizInfo, category: e.target.value })
                  }
                  className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Geografi, Sejarah, dll"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">
                  Tingkat Kesulitan
                </label>
                <select
                  value={quizInfo.difficulty}
                  onChange={(e) =>
                    setQuizInfo({ ...quizInfo, difficulty: e.target.value })
                  }
                  className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="easy" className="text-black">
                    Mudah
                  </option>
                  <option value="medium" className="text-black">
                    Sedang
                  </option>
                  <option value="hard" className="text-black">
                    Sulit
                  </option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">
                Waktu pengerjaan (detik)
              </label>
              <input
                type="number"
                value={quizInfo.timeLimit}
                onChange={(e) =>
                  setQuizInfo({
                    ...quizInfo,
                    timeLimit: Number(e.target.value),
                  })
                }
                className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-bold py-3 rounded-xl text-sm hover:opacity-90 transition mt-2"
            >
              Lanjut Tambah Soal →
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            {questions.map((q, qIndex) => (
              <div
                key={qIndex}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm">Soal {qIndex + 1}</span>
                  {questions.length > 1 && (
                    <button
                      onClick={() => removeQuestion(qIndex)}
                      className="text-red-400 text-xs hover:text-red-300"
                    >
                      Hapus soal
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">
                    Tipe Soal
                  </label>
                  <select
                    value={q.type}
                    onChange={(e) =>
                      changeQuestionType(qIndex, e.target.value as QuestionType)
                    }
                    className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="multiple_choice" className="text-black">
                      Pilihan Ganda
                    </option>
                    <option value="typing" className="text-black">
                      Ketik Jawaban
                    </option>
                    <option value="true_false" className="text-black">
                      Benar / Salah
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">
                    Pertanyaan
                  </label>
                  <input
                    type="text"
                    value={q.content}
                    onChange={(e) =>
                      updateQuestion(qIndex, { content: e.target.value })
                    }
                    className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Tulis pertanyaan di sini..."
                  />
                </div>

                {q.type === "multiple_choice" && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white/70 mb-1.5">
                      Pilihan jawaban (klik radio untuk pilih jawaban benar)
                    </label>
                    {q.options.map((opt, oIndex) => (
                      <div key={oIndex} className="flex items-center gap-3">
                        <input
                          type="radio"
                          checked={opt.isCorrect}
                          onChange={() => setCorrectOption(qIndex, oIndex)}
                          className="w-4 h-4 accent-yellow-400"
                        />
                        <span className="text-sm font-semibold w-5">
                          {opt.label}
                        </span>
                        <input
                          type="text"
                          value={opt.value}
                          onChange={(e) =>
                            updateOption(qIndex, oIndex, e.target.value)
                          }
                          className="flex-1 bg-white/10 border border-white/20 text-white rounded-lg px-3 py-2 text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder={`Pilihan ${opt.label}`}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {q.type === "true_false" && (
                  <div className="flex gap-3">
                    {q.options.map((opt, oIndex) => (
                      <label
                        key={oIndex}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border cursor-pointer text-sm font-medium transition ${
                          opt.isCorrect
                            ? "bg-yellow-400/20 border-yellow-400 text-yellow-300"
                            : "bg-white/5 border-white/20 text-white/60"
                        }`}
                      >
                        <input
                          type="radio"
                          checked={opt.isCorrect}
                          onChange={() => setCorrectOption(qIndex, oIndex)}
                          className="hidden"
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                )}

                {q.type === "typing" && (
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-1.5">
                      Jawaban yang benar
                    </label>
                    <input
                      type="text"
                      value={q.answer}
                      onChange={(e) =>
                        updateQuestion(qIndex, { answer: e.target.value })
                      }
                      className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Jawaban yang harus diketik pemain"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">
                    Poin
                  </label>
                  <input
                    type="number"
                    value={q.points}
                    onChange={(e) =>
                      updateQuestion(qIndex, { points: Number(e.target.value) })
                    }
                    className="w-32 bg-white/10 border border-white/20 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            ))}

            <button
              onClick={addQuestion}
              className="w-full border-2 border-dashed border-white/20 text-white/60 font-medium py-4 rounded-2xl text-sm hover:border-white/40 hover:text-white transition"
            >
              + Tambah Soal
            </button>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-white/10 border border-white/20 font-semibold py-3 rounded-xl text-sm hover:bg-white/20 transition"
              >
                ← Kembali
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-bold py-3 rounded-xl text-sm hover:opacity-90 transition disabled:opacity-50"
              >
                {loading ? "Menyimpan..." : "Publikasikan Quiz 🚀"}
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
