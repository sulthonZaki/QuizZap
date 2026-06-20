import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const quizzes = await prisma.quiz.findMany({
      where: { published: true },
      include: {
        author: { select: { username: true } },
        _count: { select: { questions: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ quizzes })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}