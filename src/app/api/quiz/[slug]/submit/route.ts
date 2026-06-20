import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const { answers, timeTaken } = await req.json()
    // answers: { [questionId]: jawaban_user }

    const quiz = await prisma.quiz.findUnique({
      where: { slug },
      include: { questions: { include: { options: true } } },
    })

    if (!quiz) {
      return NextResponse.json({ error: "Quiz tidak ditemukan" }, { status: 404 })
    }

    let totalScore = 0
    const results = quiz.questions.map((q) => {
      const userAnswer = (answers[q.id] || "").toString().trim().toLowerCase()
      let isCorrect = false

      if (q.type === "typing") {
        const correctAnswer = q.answer.trim().toLowerCase()
        const accepted = (q.acceptedAnswers as string[]) || []
        const allAccepted = [correctAnswer, ...accepted.map((a) => a.toLowerCase())]
        isCorrect = allAccepted.includes(userAnswer)
      } else {
        // multiple_choice & true_false: bandingkan dengan answer
        isCorrect = userAnswer === q.answer.trim().toLowerCase()
      }

      if (isCorrect) totalScore += q.points

      return {
        questionId: q.id,
        content: q.content,
        userAnswer: answers[q.id] || "",
        correctAnswer: q.answer,
        isCorrect,
        points: isCorrect ? q.points : 0,
      }
    })

    // Update play count quiz
    await prisma.quiz.update({
      where: { id: quiz.id },
      data: { playCount: { increment: 1 } },
    })

    // Simpan skor & update XP user kalau sudah login
    const session = await auth()
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      })

      if (user) {
        await prisma.score.create({
          data: {
            userId: user.id,
            quizId: quiz.id,
            score: totalScore,
            timeTaken: timeTaken || 0,
          },
        })

        await prisma.user.update({
          where: { id: user.id },
          data: {
            points: { increment: totalScore },
            xp: { increment: totalScore },
          },
        })
      }
    }

    return NextResponse.json({
      totalScore,
      maxScore: quiz.questions.reduce((sum, q) => sum + q.points, 0),
      results,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}