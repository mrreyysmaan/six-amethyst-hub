import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// Public endpoint — anyone can get a signed URL to upload a gallery photo
// The photo goes into approval queue (approved = false) before appearing publicly
export async function POST(req: NextRequest) {
  const { filename } = await req.json()
  if (!filename) return NextResponse.json({ error: 'filename required' }, { status: 400 })

  const supabase = supabaseAdmin()
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}-${filename.replace(/[^a-zA-Z0-9._-]/g, '')}`

  const { data, error } = await supabase.storage
    .from('gallery-photos')
    .createSignedUploadUrl(safeName)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const publicUrl = supabase.storage.from('gallery-photos').getPublicUrl(safeName).data.publicUrl

  return NextResponse.json({ signedUrl: data.signedUrl, publicUrl })
}
