import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { points: "desc" },
      take: 50,
      select: {
        id: true,
        username: true,
        avatar: true,
        points: true,
        xp: true,
        level: true,
        _count: {
          select: { scores: true },
        },
      },
    })

    return NextResponse.json({ users })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}