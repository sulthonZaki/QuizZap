"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface LeaderboardUser {
  id: number;
  username: string;
  avatar: string | null;
  points: number;
  xp: number;
  level: number;
  _count: { scores: number };
}

const medalEmoji: Record<number, string> = {
  0: "🥇",
  1: "🥈",
  2: "🥉",
};

export default function LeaderboardPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.users || []);
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 text-white">
      <nav className="flex items-center justify-between px-8 py-5 max-w-4xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">⚡</span>
          <span className="text-xl font-bold tracking-tight">QuizZap</span>
        </Link>
        <div className="flex items-center gap-5 text-sm">
          <Link
            href="/quiz"
            className="text-white/70 hover:text-white transition"
          >
            Jelajahi Quiz
          </Link>
          <Link
            href="/dashboard"
            className="text-white/70 hover:text-white transition"
          >
            Dashboard
          </Link>
        </div>
      </nav>

      <section className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <div className="text-5xl mb-3">🏆</div>
          <h1 className="text-3xl font-black mb-2">Leaderboard Global</h1>
          <p className="text-white/50 text-sm">
            Para pemain dengan poin tertinggi
          </p>
        </div>

        {loading ? (
          <p className="text-center text-white/40 text-sm">
            Memuat leaderboard...
          </p>
        ) : users.length === 0 ? (
          <p className="text-center text-white/40 text-sm">Belum ada pemain.</p>
        ) : (
          <div className="space-y-2">
            {/* Top 3 podium */}
            {users.length >= 3 && (
              <div className="grid grid-cols-3 gap-3 mb-8">
                {[1, 0, 2].map((idx) => {
                  const u = users[idx];
                  if (!u) return <div key={idx} />;
                  const isFirst = idx === 0;
                  return (
                    <div
                      key={u.id}
                      className={`flex flex-col items-center justify-end rounded-2xl border p-4 ${
                        isFirst
                          ? "bg-gradient-to-b from-yellow-400/20 to-transparent border-yellow-400/40 order-2 pt-2"
                          : "bg-white/5 border-white/10"
                      }`}
                      style={{ order: idx === 0 ? 2 : idx === 1 ? 1 : 3 }}
                    >
                      <span className="text-3xl mb-2">{medalEmoji[idx]}</span>
                      <div
                        className={`rounded-full flex items-center justify-center font-black mb-2 ${
                          isFirst
                            ? "w-16 h-16 text-2xl bg-gradient-to-br from-yellow-400 to-orange-400 text-black"
                            : "w-12 h-12 text-lg bg-white/10"
                        }`}
                      >
                        {u.username.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-bold text-sm text-center truncate w-full">
                        {u.username}
                      </span>
                      <span className="text-yellow-400 font-bold text-sm mt-1">
                        {u.points} pts
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Sisanya dalam bentuk list */}
            <div className="space-y-2">
              {users.slice(3).map((u, i) => (
                <div
                  key={u.id}
                  className={`flex items-center gap-4 rounded-xl px-5 py-3.5 border ${
                    session?.user?.name === u.username
                      ? "bg-purple-500/20 border-purple-400/40"
                      : "bg-white/5 border-white/10"
                  }`}
                >
                  <span className="w-6 text-center font-bold text-white/40 text-sm">
                    {i + 4}
                  </span>
                  <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center font-bold text-sm">
                    {u.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{u.username}</div>
                    <div className="text-xs text-white/40">
                      Level {u.level} · {u._count.scores} quiz dimainkan
                    </div>
                  </div>
                  <span className="text-yellow-400 font-bold text-sm">
                    {u.points} pts
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
