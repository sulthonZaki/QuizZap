"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Quiz {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  category: string;
  difficulty: string;
  playCount: number;
  rating: number;
  author: { username: string };
  _count: { questions: number };
}

const difficultyColor: Record<string, string> = {
  easy: "bg-green-400/20 text-green-300 border-green-400/30",
  medium: "bg-yellow-400/20 text-yellow-300 border-yellow-400/30",
  hard: "bg-red-400/20 text-red-300 border-red-400/30",
};

const difficultyLabel: Record<string, string> = {
  easy: "Mudah",
  medium: "Sedang",
  hard: "Sulit",
};

export default function QuizListPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/quiz/list")
      .then((res) => res.json())
      .then((data) => {
        setQuizzes(data.quizzes || []);
        setLoading(false);
      });
  }, []);

  const filtered = quizzes.filter(
    (q) =>
      q.title.toLowerCase().includes(search.toLowerCase()) ||
      q.category.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 text-white">
      <nav className="flex items-center justify-between px-8 py-5 max-w-6xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">⚡</span>
          <span className="text-xl font-bold tracking-tight">QuizZap</span>
        </Link>

        <div className="flex items-center gap-5 text-sm">
          <Link
            href="/leaderboard"
            className="text-white/70 hover:text-white transition"
          >
            Leaderboard
          </Link>
          <Link
            href="/dashboard"
            className="text-white/70 hover:text-white transition"
          >
            Dashboard
          </Link>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-black mb-2">Jelajahi Quiz</h1>
        <p className="text-white/50 text-sm mb-6">
          Pilih quiz dan uji pengetahuanmu sekarang!
        </p>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari quiz berdasarkan judul atau kategori..."
          className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-5 py-3.5 text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-8"
        />

        {loading ? (
          <p className="text-white/40 text-sm">Memuat quiz...</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white/40 text-sm mb-4">
              Belum ada quiz yang cocok.
            </p>
            <Link
              href="/dashboard/create"
              className="text-yellow-400 hover:text-yellow-300 font-semibold text-sm"
            >
              Buat quiz pertamamu →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((quiz) => (
              <Link
                key={quiz.id}
                href={`/quiz/${quiz.slug}`}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition flex flex-col"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs bg-white/10 text-white/60 px-2.5 py-1 rounded-full">
                    {quiz.category}
                  </span>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full border ${difficultyColor[quiz.difficulty]}`}
                  >
                    {difficultyLabel[quiz.difficulty]}
                  </span>
                </div>

                <h3 className="font-bold text-base mb-1.5">{quiz.title}</h3>
                <p className="text-white/40 text-sm mb-4 flex-1 line-clamp-2">
                  {quiz.description || "Tidak ada deskripsi"}
                </p>

                <div className="flex items-center justify-between text-xs text-white/40 pt-3 border-t border-white/10">
                  <span>{quiz._count.questions} soal</span>
                  <span>oleh {quiz.author.username}</span>
                  <span>{quiz.playCount}x main</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
