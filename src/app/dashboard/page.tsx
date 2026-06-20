import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      scores: {
        include: { quiz: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      },
      quizzes: { orderBy: { createdAt: "desc" }, take: 5 },
    },
  });

  if (!user) redirect("/login");

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 text-white">
      <nav className="flex items-center justify-between px-8 py-5 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">⚡</span>
          <span className="text-xl font-bold tracking-tight">QuizZap</span>
        </Link>
        <Link
          href="/api/auth/signout"
          className="text-sm text-white/70 hover:text-white transition px-4 py-2"
        >
          Keluar
        </Link>
      </nav>

      <section className="max-w-5xl mx-auto px-4 py-10">
        {/* Profile header */}
        <div className="flex items-center gap-5 mb-10">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center text-3xl font-black text-black">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user.username}</h1>
            <p className="text-white/50 text-sm">{user.email}</p>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Level", value: user.level },
            { label: "Total XP", value: user.xp },
            { label: "Poin", value: user.points },
            { label: "Streak", value: `${user.streak} hari` },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white/5 border border-white/10 rounded-2xl p-5"
            >
              <div className="text-2xl font-black">{stat.value}</div>
              <div className="text-sm text-white/50 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          <Link
            href="/quiz"
            className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-bold p-6 rounded-2xl hover:opacity-90 transition"
          >
            <div className="text-xl mb-1">🎮 Main quiz</div>
            <div className="text-sm font-normal opacity-70">
              Jelajahi ribuan quiz seru
            </div>
          </Link>
          <Link
            href="/dashboard/create"
            className="bg-white/10 border border-white/20 font-bold p-6 rounded-2xl hover:bg-white/20 transition"
          >
            <div className="text-xl mb-1">✏️ Buat quiz</div>
            <div className="text-sm font-normal text-white/50">
              Bagikan pengetahuanmu
            </div>
          </Link>
        </div>

        {/* Recent scores */}
        <div className="mb-10">
          <h2 className="text-lg font-bold mb-4">Riwayat terakhir</h2>
          {user.scores.length === 0 ? (
            <p className="text-white/40 text-sm">
              Belum ada riwayat quiz. Yuk main!
            </p>
          ) : (
            <div className="space-y-2">
              {user.scores.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-5 py-3"
                >
                  <span className="font-medium text-sm">{s.quiz.title}</span>
                  <span className="text-yellow-400 font-bold text-sm">
                    {s.score} poin
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My quizzes */}
        <div>
          <h2 className="text-lg font-bold mb-4">Quiz buatanmu</h2>
          {user.quizzes.length === 0 ? (
            <p className="text-white/40 text-sm">
              Kamu belum membuat quiz apapun.
            </p>
          ) : (
            <div className="space-y-2">
              {user.quizzes.map((q) => (
                <div
                  key={q.id}
                  className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-5 py-3"
                >
                  <span className="font-medium text-sm">{q.title}</span>
                  <span className="text-white/40 text-xs">
                    {q.playCount}x dimainkan
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
