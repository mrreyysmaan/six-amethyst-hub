import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

function isAdmin(req: NextRequest) {
  const token = req.headers.get('x-admin-token')
  return token === process.env.ADMIN_PASSWORD
}

// Returns a signed upload URL so the browser can upload directly to Supabase
// without the file passing through Vercel (avoids 4.5MB body limit)
export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { bucket, filename } = await req.json()
  if (!bucket || !filename) {
    return NextResponse.json({ error: 'bucket and filename required' }, { status: 400 })
  }

  const supabase = supabaseAdmin()
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUploadUrl(filename)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const publicUrl = supabase.storage.from(bucket).getPublicUrl(filename).data.publicUrl

  return NextResponse.json({ signedUrl: data.signedUrl, token: data.token, path: filename, publicUrl })
}
