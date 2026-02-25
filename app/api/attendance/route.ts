import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

function isAdmin(req: NextRequest) {
  const token = req.headers.get('x-admin-token')
  return token === process.env.ADMIN_PASSWORD
}

export async function GET() {
  const supabase = supabaseAdmin()
  const { data, error } = await supabase
    .from('attendance_posters')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { image_url, month_label } = await req.json()

  if (!image_url || !month_label) {
    return NextResponse.json({ error: 'image_url and month_label required' }, { status: 400 })
  }

  const supabase = supabaseAdmin()
  const { data, error: dbError } = await supabase
    .from('attendance_posters')
    .insert([{ image_url, month_label, sort_order: 0 }])
    .select()
    .single()

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await req.json()
  const supabase = supabaseAdmin()
  const { error } = await supabase.from('attendance_posters').delete().eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
