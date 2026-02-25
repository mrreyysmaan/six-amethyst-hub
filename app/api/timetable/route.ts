import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

function isAdmin(req: NextRequest) {
  const token = req.headers.get('x-admin-token')
  return token === process.env.ADMIN_PASSWORD
}

export async function GET() {
  const supabase = supabaseAdmin()
  const { data, error } = await supabase
    .from('timetable')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File

  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  const supabase = supabaseAdmin()
  const ext = file.name.split('.').pop() || 'jpg'
  const filename = `timetable-${Date.now()}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('timetable')
    .upload(filename, file, { contentType: file.type, upsert: false })

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 })

  const { data: { publicUrl } } = supabase.storage
    .from('timetable')
    .getPublicUrl(filename)

  // Delete old records and insert new
  await supabase.from('timetable').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  const { data, error: dbError } = await supabase
    .from('timetable')
    .insert([{ image_url: publicUrl }])
    .select()
    .single()

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })
  return NextResponse.json(data)
}
