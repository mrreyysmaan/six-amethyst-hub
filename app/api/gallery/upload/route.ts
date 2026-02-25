import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// Receives the public URL after direct browser upload, saves record to DB
export async function POST(req: NextRequest) {
  const { image_url, uploader_name, caption } = await req.json()

  if (!image_url) return NextResponse.json({ error: 'image_url required' }, { status: 400 })

  const supabase = supabaseAdmin()
  const { error: dbError } = await supabase.from('gallery_photos').insert([{
    image_url,
    uploader_name: uploader_name || null,
    caption: caption || null,
    approved: false,
  }])

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
