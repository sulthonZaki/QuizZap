import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Harus login dulu" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })
    if (!user) {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 })
    }

    const body = await req.json()
    const { title, description, category, difficulty, timeLimit, questions } = body

    if (!title || !category || !questions || questions.length === 0) {
      return NextResponse.json(
        { error: "Judul, kategori, dan minimal 1 soal wajib diisi" },
        { status: 400 }
      )
    }

    const baseSlug = slugify(title)
    const slug = `${baseSlug}-${Date.now()}`

    const quiz = await prisma.quiz.create({
      data: {
        title,
        slug,
        description: description || "",
        category,
        difficulty: difficulty || "medium",
        timeLimit: timeLimit || 300,
        createdBy: user.id,
        published: true,
        questions: {
          create: questions.map((q: any, index: number) => ({
            type: q.type,
            content: q.content,
            answer: q.answer,
            acceptedAnswers: q.acceptedAnswers || null,
            points: q.points || 10,
            orderIndex: index,
            hint: q.hint || null,
            options: q.options
              ? {
                  create: q.options.map((opt: any) => ({
                    label: opt.label,
                    value: opt.value,
                    isCorrect: opt.isCorrect,
                  })),
                }
              : undefined,
          })),
        },
      },
    })

    return NextResponse.json(
      { message: "Quiz berhasil dibuat", quizId: quiz.id, slug: quiz.slug },
      { status: 201 }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}