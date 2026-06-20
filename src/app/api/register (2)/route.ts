import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const { username, email, password } = await req.json()

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Semua field wajib diisi' },
        { status: 400 }
      )
    }

    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Email atau username sudah digunakan' },
        { status: 400 }
      )
    }

    const hashed = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: { username, email, password: hashed },
    })

    return NextResponse.json(
      { message: 'Registrasi berhasil', userId: user.id },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}