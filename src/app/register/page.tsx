"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
      setLoading(false);
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-purple-500 rounded-full opacity-10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-indigo-500 rounded-full opacity-10 blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <span className="text-2xl">⚡</span>
            <span className="text-xl font-bold text-white tracking-tight">
              QuizZap
            </span>
          </Link>
          <h1 className="text-3xl font-black text-white mb-2">
            Buat akun baru
          </h1>
          <p className="text-white/50 text-sm">
            Gratis selamanya. Mulai bermain sekarang!
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-300 text-sm px-4 py-3 rounded-xl mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">
                Username
              </label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="username kamu"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="email@kamu.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-bold py-3 rounded-xl text-sm hover:opacity-90 transition disabled:opacity-50 mt-2"
            >
              {loading ? "Memproses..." : "Daftar Sekarang →"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-white/40 mt-6">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="text-purple-400 hover:text-purple-300 font-semibold"
          >
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
