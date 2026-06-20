"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (res?.error) {
      setError("Email atau password salah");
      setLoading(false);
    } else {
      router.push("/quiz");
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
            Selamat datang!
          </h1>
          <p className="text-white/50 text-sm">
            Masuk untuk lanjutkan petualanganmu
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
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              {loading ? "Memproses..." : "Masuk →"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-white/40 mt-6">
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="text-purple-400 hover:text-purple-300 font-semibold"
          >
            Daftar gratis
          </Link>
        </p>
      </div>
    </div>
  );
}
