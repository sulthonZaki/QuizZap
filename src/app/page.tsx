import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 text-white overflow-hidden relative">
      {/* Background decorative circles */}
      <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-purple-500 rounded-full opacity-10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-150px] right-[-100px] w-[600px] h-[600px] bg-indigo-500 rounded-full opacity-10 blur-3xl pointer-events-none" />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⚡</span>
          <span className="text-xl font-bold tracking-tight">QuizZap</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-white/70 hover:text-white transition px-4 py-2"
          >
            Masuk
          </Link>
          <Link
            href="/register"
            className="text-sm bg-white text-indigo-900 font-semibold px-4 py-2 rounded-full hover:bg-indigo-100 transition"
          >
            Daftar Gratis
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-20 pb-16">
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6">
          <span className="text-yellow-400">🏆</span>
          <span>Platform quiz #1 paling seru di Indonesia</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight mb-6">
          Uji Pengetahuanmu
          <br />
          <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            Lawan Dunia!
          </span>
        </h1>

        <p className="text-lg text-white/60 max-w-xl mb-10">
          Ribuan quiz seru menunggumu. Saingi pemain lain, kumpulkan poin, dan
          buktikan kamu yang terhebat!
        </p>

        <div className="flex gap-4 flex-wrap justify-center">
          <Link
            href="/register"
            className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-bold px-8 py-3.5 rounded-full text-base hover:opacity-90 transition shadow-lg shadow-orange-500/30"
          >
            Mulai Bermain →
          </Link>
          <Link
            href="/quiz"
            className="bg-white/10 border border-white/20 text-white font-semibold px-8 py-3.5 rounded-full text-base hover:bg-white/20 transition"
          >
            Jelajahi Quiz
          </Link>
        </div>

        {/* Stats */}
        <div className="flex gap-10 mt-16 flex-wrap justify-center">
          {[
            { value: "10K+", label: "Quiz tersedia" },
            { value: "50K+", label: "Pemain aktif" },
            { value: "1M+", label: "Pertandingan" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-black text-white">{stat.value}</div>
              <div className="text-sm text-white/50 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature cards */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 pb-24 grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            icon: "⚡",
            title: "Real-time Battle",
            desc: "Duel 1v1 dengan pemain lain secara langsung",
          },
          {
            icon: "🏅",
            title: "Sistem Badge",
            desc: "Kumpulkan badge dan tunjukkan keahlianmu",
          },
          {
            icon: "📊",
            title: "Leaderboard",
            desc: "Bersaing di papan peringkat global",
          },
        ].map((f) => (
          <div
            key={f.title}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition"
          >
            <div className="text-3xl mb-3">{f.icon}</div>
            <div className="font-bold text-base mb-1">{f.title}</div>
            <div className="text-sm text-white/50">{f.desc}</div>
          </div>
        ))}
      </section>
    </main>
  );
}
