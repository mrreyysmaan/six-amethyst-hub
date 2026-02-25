import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as File
  const uploaderName = formData.get('uploader_name') as string | null
  const caption = formData.get('caption') as string | null

  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 })
  }

  const supabase = supabaseAdmin()
  const ext = file.name.split('.').pop() || 'jpg'
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('gallery-photos')
    .upload(filename, file, { contentType: file.type, upsert: false })

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 })

  const { data: { publicUrl } } = supabase.storage
    .from('gallery-photos')
    .getPublicUrl(filename)

  const { error: dbError } = await supabase.from('gallery_photos').insert([{
    image_url: publicUrl,
    uploader_name: uploaderName || null,
    caption: caption || null,
    approved: false,
  }])

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
