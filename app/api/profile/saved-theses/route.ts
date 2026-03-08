import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { sql } from "@/lib/db"

export interface SavedThesisEntry {
  id: string
  name: string
  scenario: string
  thesis: {
    activeThesis: string | null
    vc: unknown
    isv: unknown
    oem: unknown
  }
  createdAt: string
}

const MAX_SAVED = 20
const MAX_NAME_LENGTH = 100

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const rows = await sql`SELECT saved_theses FROM profiles WHERE id = ${session.user.id}`
    const saved = (rows[0] as { saved_theses?: SavedThesisEntry[] } | undefined)?.saved_theses ?? []
    return NextResponse.json({ saved_theses: saved })
  } catch (err) {
    console.error("[saved-theses GET]", err)
    return NextResponse.json({ error: "DB error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let body: { name: string; scenario: string; thesis: unknown }
  try {
    body = await req.json()
    if (!body.name || typeof body.name !== "string") throw new Error("name required")
    if (!body.scenario || typeof body.scenario !== "string") throw new Error("scenario required")
    if (!body.thesis || typeof body.thesis !== "object") throw new Error("thesis required")
    if (body.name.length > MAX_NAME_LENGTH) throw new Error("name too long")
  } catch {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 })
  }

  try {
    // Load existing
    const rows = await sql`SELECT saved_theses FROM profiles WHERE id = ${session.user.id}`
    const existing: SavedThesisEntry[] = (rows[0] as { saved_theses?: SavedThesisEntry[] })?.saved_theses ?? []

    if (existing.length >= MAX_SAVED) {
      return NextResponse.json({ error: `Maximum ${MAX_SAVED} saved theses` }, { status: 400 })
    }

    const entry: SavedThesisEntry = {
      id: crypto.randomUUID(),
      name: body.name.trim(),
      scenario: body.scenario,
      thesis: body.thesis as SavedThesisEntry["thesis"],
      createdAt: new Date().toISOString(),
    }

    const updated = [...existing, entry]
    await sql`
      UPDATE profiles
      SET saved_theses = ${JSON.stringify(updated)}::jsonb
      WHERE id = ${session.user.id}
    `
    return NextResponse.json({ ok: true, entry })
  } catch (err) {
    console.error("[saved-theses POST]", err)
    return NextResponse.json({ error: "DB error" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 })
  }

  try {
    const rows = await sql`SELECT saved_theses FROM profiles WHERE id = ${session.user.id}`
    const existing: SavedThesisEntry[] = (rows[0] as { saved_theses?: SavedThesisEntry[] })?.saved_theses ?? []
    const updated = existing.filter(e => e.id !== id)

    await sql`
      UPDATE profiles
      SET saved_theses = ${JSON.stringify(updated)}::jsonb
      WHERE id = ${session.user.id}
    `
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[saved-theses DELETE]", err)
    return NextResponse.json({ error: "DB error" }, { status: 500 })
  }
}
