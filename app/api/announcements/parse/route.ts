import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const tagSchema = ['general', 'reminder', 'event', 'collection', 'urgent'] as const

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'OPENAI_API_KEY is not set. Add it in Vercel Environment Variables to use auto-fill.' },
      { status: 503 }
    )
  }

  let body: { text: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const text = typeof body.text === 'string' ? body.text.trim() : ''
  if (!text) {
    return NextResponse.json({ error: 'text is required' }, { status: 400 })
  }

  const openai = new OpenAI({ apiKey })

  const systemPrompt = `You are a helper for a school class dashboard. The user will paste a full announcement in Malay or English.
Your job is to extract:
1. title: A SHORT display title (max 8–10 words). Same language as the announcement. Examples: "Mesytuarat PIBG", "Sumbangan Khas - Tarikh Tutup", "Hari Kecemerlangan".
2. summary: A SHORT description in 2–3 sentences (same language as the announcement). Summarise what the announcement is about and any key action (e.g. pay by date, attend event). This will be shown on the card before users expand. Do not repeat the full text.
3. tag: One of: general, reminder, event, collection, urgent
   - general: general info, notices
   - reminder: reminders, deadlines, things to remember
   - event: school events, ceremonies, trips, hari ini hari itu
   - collection: money collection, sumbangan, payment, fees
   - urgent: time-sensitive, urgent action needed
4. form_url: Any URL that is clearly a form link (e.g. Google Form, Microsoft Form). Return null if none.
5. deadline: If a specific date is mentioned as a deadline or due date, return it as YYYY-MM-DD. Otherwise null.

Reply with ONLY a valid JSON object, no markdown, no explanation. Example:
{"title":"Sumbangan Kematian","summary":"Sumbangan untuk keluarga murid yang baru meninggal dunia. Sila serahkan sumbangan selepas bacaan Yaasin pada 27 Feb 2026.","tag":"collection","form_url":null,"deadline":"2026-02-27"}`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text.slice(0, 6000) }, // limit length
      ],
      temperature: 0.2,
    })

    let raw = completion.choices[0]?.message?.content?.trim() ?? ''
    const codeBlock = raw.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (codeBlock) raw = codeBlock[1].trim()
    const parsed = JSON.parse(raw) as { title?: string; summary?: string; tag?: string; form_url?: string | null; deadline?: string | null }

    const title = typeof parsed.title === 'string' ? parsed.title.trim() : ''
    const summary = typeof parsed.summary === 'string' ? parsed.summary.trim() : ''
    let tag = typeof parsed.tag === 'string' && tagSchema.includes(parsed.tag as typeof tagSchema[number])
      ? (parsed.tag as typeof tagSchema[number])
      : 'general'
    const form_url =
      typeof parsed.form_url === 'string' && parsed.form_url.startsWith('http')
        ? parsed.form_url.trim()
        : null
    let deadline: string | null = null
    if (typeof parsed.deadline === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(parsed.deadline)) {
      deadline = parsed.deadline
    }

    return NextResponse.json({ title, summary, tag, form_url, deadline })
  } catch (e) {
    console.error('Announcement parse error:', e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to parse announcement' },
      { status: 500 }
    )
  }
}
