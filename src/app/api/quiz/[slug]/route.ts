import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const quiz = await prisma.quiz.findUnique({
      where: { slug },
      include: {
        author: { select: { username: true } },
        questions: {
          orderBy: { orderIndex: "asc" },
          include: { options: true },
        },
      },
    })

    if (!quiz) {
      return NextResponse.json({ error: "Quiz tidak ditemukan" }, { status: 404 })
    }

    // Jangan kirim jawaban benar ke client supaya tidak bisa di-cheat lewat devtools
    const safeQuestions = quiz.questions.map((q) => ({
      id: q.id,
      type: q.type,
      content: q.content,
      points: q.points,
      hint: q.hint,
      options: q.options.map((o) => ({
        id: o.id,
        label: o.label,
        value: o.value,
      })),
    }))

    return NextResponse.json({
      quiz: {
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        category: quiz.category,
        difficulty: quiz.difficulty,
        timeLimit: quiz.timeLimit,
        author: quiz.author,
        questions: safeQuestions,
        totalQuestions: quiz.questions.length,
      },
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}