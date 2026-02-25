'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import {
  Lock, LogOut, Plus, Trash2, Pin, PinOff,
  CheckCircle, XCircle, Upload, RefreshCw, Wrench, Clock, Wifi
} from 'lucide-react'
import type { Announcement, AnnouncementTag, AttendancePoster, GalleryPhoto } from '@/lib/types'

// ─── Shared input styles ──────────────────────────────────────────────────────
const INPUT = 'w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-purple-500 transition-colors'
const CARD  = 'bg-zinc-900 border border-zinc-800 rounded-2xl'

const TAG_OPTIONS: { value: AnnouncementTag; label: string; active: string; idle: string }[] = [
  { value: 'general',    label: 'General',    active: 'bg-purple-500/20 text-purple-300 border-purple-500/40', idle: 'bg-zinc-800 text-zinc-400 border-zinc-700' },
  { value: 'reminder',   label: 'Reminder',   active: 'bg-amber-500/20  text-amber-300  border-amber-500/40',  idle: 'bg-zinc-800 text-zinc-400 border-zinc-700' },
  { value: 'event',      label: 'Event',      active: 'bg-blue-500/20   text-blue-300   border-blue-500/40',   idle: 'bg-zinc-800 text-zinc-400 border-zinc-700' },
  { value: 'collection', label: 'Collection', active: 'bg-green-500/20  text-green-300  border-green-500/40',  idle: 'bg-zinc-800 text-zinc-400 border-zinc-700' },
  { value: 'urgent',     label: 'Urgent',     active: 'bg-red-500/20    text-red-300    border-red-500/40',    idle: 'bg-zinc-800 text-zinc-400 border-zinc-700' },
]

function useAdmin() {
  const [token, setToken] = useState<string | null>(null)
  useEffect(() => {
    const saved = sessionStorage.getItem('admin_token')
    if (saved) setToken(saved)
  }, [])
  const login = (pwd: string) => { setToken(pwd); sessionStorage.setItem('admin_token', pwd) }
  const logout = () => { setToken(null); sessionStorage.removeItem('admin_token') }
  const headers = (extra?: Record<string, string>) => ({
    'x-admin-token': token || '',
    'Content-Type': 'application/json',
    ...extra,
  })
  return { token, login, logout, headers }
}

// ─── Login Screen ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: (pwd: string) => Promise<boolean> }) {
  const [pwd, setPwd] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    const ok = await onLogin(pwd)
    if (!ok) setError('Incorrect password. Please try again.')
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 w-full max-w-sm text-center">
        <div className="w-14 h-14 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center mx-auto mb-5">
          <Lock size={24} className="text-purple-400" />
        </div>
        <h1 className="text-xl font-black text-white mb-1">Admin Panel</h1>
        <p className="text-sm text-zinc-500 mb-6 font-medium">6 Amethyst Hub</p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="password"
            placeholder="Enter password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            className={INPUT}
          />
          {error && <p className="text-red-400 text-xs font-medium">{error}</p>}
          <button
            type="submit"
            disabled={loading || !pwd}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white font-bold rounded-xl transition-colors"
          >
            {loading ? 'Checking...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ─── Section heading helper ───────────────────────────────────────────────────
function TabHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-5">
      <h2 className="font-black text-white text-base">{title}</h2>
      {subtitle && <p className="text-xs text-zinc-500 mt-0.5">{subtitle}</p>}
    </div>
  )
}

// ─── Announcements Tab ────────────────────────────────────────────────────────
function AnnouncementsTab({ headers }: { headers: Record<string, string> }) {
  const [items, setItems] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: '', body: '', tag: 'general' as AnnouncementTag,
    deadline: '', form_url: '', pinned: false,
  })

  const load = async () => {
    setLoading(true)
    const res = await fetch('/api/announcements')
    setItems(await res.json())
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const post = async () => {
    setSaving(true)
    await fetch('/api/announcements', {
      method: 'POST', headers,
      body: JSON.stringify({ ...form, deadline: form.deadline || null, form_url: form.form_url || null }),
    })
    setForm({ title: '', body: '', tag: 'general', deadline: '', form_url: '', pinned: false })
    setShowForm(false)
    await load()
    setSaving(false)
  }

  const toggle = async (id: string, pinned: boolean) => {
    await fetch('/api/announcements', { method: 'PATCH', headers, body: JSON.stringify({ id, pinned: !pinned }) })
    await load()
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this announcement?')) return
    await fetch('/api/announcements', { method: 'DELETE', headers, body: JSON.stringify({ id }) })
    await load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <TabHeading title="Announcements" />
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-xl transition-colors">
          <Plus size={14} /> New
        </button>
      </div>

      {showForm && (
        <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-4 mb-5 space-y-3">
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">New Announcement</p>
          <input type="text" placeholder="Title (e.g. Class Trip Payment)" value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })} className={INPUT} />
          <textarea placeholder="Paste the full announcement here..." value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
            rows={6} className={`${INPUT} resize-none`} />
          <div className="flex flex-wrap gap-2">
            {TAG_OPTIONS.map((t) => (
              <button key={t.value} onClick={() => setForm({ ...form, tag: t.value })}
                className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${form.tag === t.value ? t.active : t.idle}`}>
                {t.label}
              </button>
            ))}
          </div>
          <input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })}
            className={INPUT} />
          <input type="url" placeholder="Form link (optional)" value={form.form_url}
            onChange={(e) => setForm({ ...form, form_url: e.target.value })} className={INPUT} />
          <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
            <input type="checkbox" checked={form.pinned}
              onChange={(e) => setForm({ ...form, pinned: e.target.checked })}
              className="w-4 h-4 accent-purple-500" />
            Pin this announcement (stays at top)
          </label>
          <button onClick={post} disabled={!form.title || !form.body || saving}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white font-bold rounded-xl transition-colors">
            {saving ? 'Posting...' : 'Post Announcement'}
          </button>
        </div>
      )}

      {loading ? (
        <p className="text-center text-zinc-600 py-8 text-sm">Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-center text-zinc-600 py-8 text-sm">No announcements yet.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className={`${CARD} p-4 ${item.pinned ? 'border-amber-500/30' : ''}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    {item.pinned && <span className="text-amber-400 text-xs font-bold">📌 Pinned</span>}
                    <span className="text-xs text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-md capitalize font-semibold">{item.tag}</span>
                  </div>
                  <p className="font-bold text-white text-sm leading-snug">{item.title}</p>
                  <p className="text-xs text-zinc-600 mt-0.5 font-medium">{new Date(item.created_at).toLocaleDateString('en-MY')}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => toggle(item.id, item.pinned)}
                    className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    {item.pinned ? <PinOff size={13} className="text-amber-400" /> : <Pin size={13} className="text-amber-500" />}
                  </button>
                  <button onClick={() => remove(item.id)}
                    className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                    <Trash2 size={13} className="text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Gallery Moderation Tab ───────────────────────────────────────────────────
function GalleryTab({ headers }: { headers: Record<string, string> }) {
  const [pending, setPending] = useState<GalleryPhoto[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const res = await fetch('/api/gallery/approve', { headers: { 'x-admin-token': headers['x-admin-token'] } })
    const data = await res.json()
    setPending(Array.isArray(data) ? data : [])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const decide = async (id: string, approved: boolean) => {
    await fetch('/api/gallery/approve', { method: 'PATCH', headers, body: JSON.stringify({ id, approved }) })
    await load()
  }
  const remove = async (id: string) => {
    await fetch('/api/gallery/approve', { method: 'DELETE', headers, body: JSON.stringify({ id }) })
    await load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <TabHeading title="Moments" subtitle="Pending photo approvals" />
        <button onClick={load} className="w-9 h-9 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center">
          <RefreshCw size={14} className="text-zinc-400" />
        </button>
      </div>

      {loading ? (
        <p className="text-center text-zinc-600 py-8 text-sm">Loading...</p>
      ) : pending.length === 0 ? (
        <div className="text-center py-10 text-zinc-600">
          <p className="text-3xl mb-2">✅</p>
          <p className="text-sm font-medium">No pending photos — all clear!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pending.map((photo) => (
            <div key={photo.id} className={`${CARD} overflow-hidden`}>
              <div className="relative w-full aspect-square">
                <Image src={photo.image_url} alt="Pending" fill className="object-cover" />
              </div>
              <div className="p-3 space-y-1">
                {photo.uploader_name && <p className="text-sm font-bold text-white">By: {photo.uploader_name}</p>}
                {photo.caption && <p className="text-sm text-zinc-400">{photo.caption}</p>}
                <p className="text-xs text-zinc-600 font-medium">{new Date(photo.created_at).toLocaleString('en-MY')}</p>
                <div className="flex gap-2 pt-2">
                  <button onClick={() => decide(photo.id, true)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl">
                    <CheckCircle size={14} /> Approve
                  </button>
                  <button onClick={() => remove(photo.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl">
                    <XCircle size={14} /> Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Attendance Tab ───────────────────────────────────────────────────────────
function AttendanceTab({ headers }: { headers: Record<string, string> }) {
  const [posters, setPosters] = useState<AttendancePoster[]>([])
  const [loading, setLoading] = useState(true)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [monthLabel, setMonthLabel] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const load = async () => {
    setLoading(true)
    const res = await fetch('/api/attendance')
    const data = await res.json()
    setPosters(Array.isArray(data) ? data : [])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const handleFile = (f: File) => { setFile(f); setPreview(URL.createObjectURL(f)); setUploadError(''); setUploadSuccess(false) }

  const upload = async () => {
    if (!file || !monthLabel) return
    setUploading(true); setUploadError(''); setUploadSuccess(false)
    try {
      const ext = file.name.split('.').pop() || 'jpg'
      const filename = `attendance-${Date.now()}.${ext}`
      const signRes = await fetch('/api/sign-upload', { method: 'POST', headers, body: JSON.stringify({ bucket: 'attendance-posters', filename }) })
      const signData = await signRes.json()
      if (!signRes.ok) { setUploadError(`Could not get upload URL: ${signData.error}`); return }
      const uploadRes = await fetch(signData.signedUrl, { method: 'PUT', headers: { 'Content-Type': file.type }, body: file })
      if (!uploadRes.ok) { setUploadError(`Storage upload failed: ${uploadRes.statusText}`); return }
      const saveRes = await fetch('/api/attendance', { method: 'POST', headers, body: JSON.stringify({ image_url: signData.publicUrl, month_label: monthLabel }) })
      const saveData = await saveRes.json()
      if (!saveRes.ok) { setUploadError(`Database save failed: ${saveData.error}`); return }
      setFile(null); setPreview(null); setMonthLabel(''); setUploadSuccess(true)
      await load()
    } catch (e) {
      setUploadError(`Error: ${e instanceof Error ? e.message : 'Unknown error'}`)
    } finally { setUploading(false) }
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this poster?')) return
    await fetch('/api/attendance', { method: 'DELETE', headers, body: JSON.stringify({ id }) })
    await load()
  }

  return (
    <div>
      <TabHeading title="Attendance Posters" />

      <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-4 mb-5 space-y-3">
        <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Upload New Poster</p>
        <div className="border-2 border-dashed border-zinc-600 rounded-xl p-5 flex flex-col items-center gap-2 cursor-pointer hover:border-purple-600 transition-colors"
          onClick={() => inputRef.current?.click()}>
          {preview ? (
            <div className="relative w-full aspect-[3/4] max-h-48">
              <Image src={preview} alt="Preview" fill className="object-contain rounded-lg" />
            </div>
          ) : (
            <>
              <Upload size={22} className="text-zinc-600" />
              <p className="text-sm text-zinc-400 font-medium">Tap to choose poster image</p>
            </>
          )}
          <input ref={inputRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
        </div>
        <input type="text" placeholder="Month label (e.g. January 2025)" value={monthLabel}
          onChange={(e) => setMonthLabel(e.target.value)} className={INPUT} />
        {uploadError && <p className="text-red-400 text-xs font-medium bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">❌ {uploadError}</p>}
        {uploadSuccess && <p className="text-green-400 text-xs font-medium bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-2">✅ Poster uploaded successfully!</p>}
        <button onClick={upload} disabled={!file || !monthLabel || uploading}
          className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white font-bold rounded-xl transition-colors">
          {uploading ? 'Uploading...' : 'Upload Poster'}
        </button>
      </div>

      {loading ? (
        <p className="text-center text-zinc-600 py-4 text-sm">Loading...</p>
      ) : posters.length === 0 ? (
        <p className="text-center text-zinc-600 py-4 text-sm">No posters yet.</p>
      ) : (
        <div className="space-y-3">
          {posters.map((poster) => (
            <div key={poster.id} className={`${CARD} p-3 flex items-center gap-3`}>
              <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-zinc-700">
                <Image src={poster.image_url} alt={poster.month_label} fill className="object-cover" />
              </div>
              <p className="flex-1 font-semibold text-sm text-white">{poster.month_label}</p>
              <button onClick={() => remove(poster.id)}
                className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                <Trash2 size={13} className="text-red-400" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Timetable Tab ────────────────────────────────────────────────────────────
function TimetableTab({ headers }: { headers: Record<string, string> }) {
  const [current, setCurrent] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const load = async () => {
    const res = await fetch('/api/timetable')
    const data = await res.json()
    if (data?.image_url) setCurrent(data.image_url)
  }
  useEffect(() => { load() }, [])

  const handleFile = (f: File) => { setFile(f); setPreview(URL.createObjectURL(f)); setUploadError(''); setUploadSuccess(false) }

  const upload = async () => {
    if (!file) return
    setUploading(true); setUploadError(''); setUploadSuccess(false)
    try {
      const ext = file.name.split('.').pop() || 'jpg'
      const filename = `timetable-${Date.now()}.${ext}`
      const signRes = await fetch('/api/sign-upload', { method: 'POST', headers, body: JSON.stringify({ bucket: 'timetable', filename }) })
      const signData = await signRes.json()
      if (!signRes.ok) { setUploadError(`Could not get upload URL: ${signData.error}`); return }
      const uploadRes = await fetch(signData.signedUrl, { method: 'PUT', headers: { 'Content-Type': file.type }, body: file })
      if (!uploadRes.ok) { setUploadError(`Storage upload failed: ${uploadRes.statusText}`); return }
      const saveRes = await fetch('/api/timetable', { method: 'POST', headers, body: JSON.stringify({ image_url: signData.publicUrl }) })
      const saveData = await saveRes.json()
      if (!saveRes.ok) { setUploadError(`Database save failed: ${saveData.error}`); return }
      setFile(null); setPreview(null); setUploadSuccess(true)
      await load()
    } catch (e) {
      setUploadError(`Error: ${e instanceof Error ? e.message : 'Unknown error'}`)
    } finally { setUploading(false) }
  }

  return (
    <div>
      <TabHeading title="Class Timetable" />

      {current && (
        <div className="mb-4">
          <p className="text-xs text-zinc-500 mb-2 font-semibold uppercase tracking-wider">Current timetable</p>
          <div className="relative w-full aspect-[13/10] rounded-xl overflow-hidden border border-zinc-700">
            <Image src={current} alt="Current timetable" fill className="object-contain bg-zinc-900" />
          </div>
        </div>
      )}

      <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-4 space-y-3">
        <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Replace Timetable</p>
        <div className="border-2 border-dashed border-zinc-600 rounded-xl p-5 flex flex-col items-center gap-2 cursor-pointer hover:border-purple-600 transition-colors"
          onClick={() => inputRef.current?.click()}>
          {preview ? (
            <div className="relative w-full aspect-[13/10] max-h-48">
              <Image src={preview} alt="Preview" fill className="object-contain" />
            </div>
          ) : (
            <>
              <Upload size={22} className="text-zinc-600" />
              <p className="text-sm text-zinc-400 font-medium">Tap to choose timetable image</p>
            </>
          )}
          <input ref={inputRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
        </div>
        {uploadError && <p className="text-red-400 text-xs font-medium bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">❌ {uploadError}</p>}
        {uploadSuccess && <p className="text-green-400 text-xs font-medium bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-2">✅ Timetable uploaded successfully!</p>}
        <button onClick={upload} disabled={!file || uploading}
          className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white font-bold rounded-xl transition-colors">
          {uploading ? 'Uploading...' : 'Upload New Timetable'}
        </button>
      </div>
    </div>
  )
}

// ─── Bot Status Tab ───────────────────────────────────────────────────────────
function BotStatusTab({ headers }: { headers: Record<string, string> }) {
  const [current, setCurrent] = useState<string>('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const load = async () => {
    const res = await fetch('/api/settings')
    const data = await res.json()
    setCurrent(data.bot_overlay || '')
  }
  useEffect(() => { load() }, [])

  const save = async (value: string) => {
    setSaving(true); setSaved(false)
    await fetch('/api/settings', { method: 'PATCH', headers, body: JSON.stringify({ key: 'bot_overlay', value }) })
    setCurrent(value); setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const options = [
    { value: '',            label: 'Live — Bot is active',   icon: <Wifi size={17} className="text-green-400" />,    desc: 'Bot section is fully visible and working normally.' },
    { value: 'coming_soon', label: 'Coming Soon',             icon: <Clock size={17} className="text-purple-400" />,  desc: 'Shows a "Coming Soon" overlay on the bot section.' },
    { value: 'maintenance', label: 'Under Maintenance',       icon: <Wrench size={17} className="text-amber-400" />,  desc: 'Shows an "Under Maintenance" overlay on the bot section.' },
  ]

  return (
    <div>
      <TabHeading title="Bot Status" subtitle="Control what visitors see on the English Speaking Bot section." />

      <div className="space-y-3">
        {options.map((opt) => (
          <button key={opt.value} onClick={() => save(opt.value)} disabled={saving}
            className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${
              current === opt.value
                ? 'border-purple-500 bg-purple-500/10'
                : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 ${
              current === opt.value ? 'bg-purple-500/20 border-purple-500/30' : 'bg-zinc-800 border-zinc-700'
            }`}>
              {opt.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`font-bold text-sm ${current === opt.value ? 'text-white' : 'text-zinc-300'}`}>{opt.label}</p>
              <p className="text-xs text-zinc-500 mt-0.5">{opt.desc}</p>
            </div>
            {current === opt.value && (
              <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                <CheckCircle size={12} className="text-white" />
              </div>
            )}
          </button>
        ))}
      </div>

      {saving && <p className="text-center text-zinc-500 text-sm mt-4 font-medium">Saving...</p>}
      {saved && <p className="text-center text-green-400 text-sm mt-4 font-medium">✅ Saved! Site updates in ~1 minute.</p>}
    </div>
  )
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────
type Tab = 'announcements' | 'gallery' | 'attendance' | 'timetable' | 'botstatus'

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'announcements', label: 'Announcements', icon: '📢' },
  { id: 'gallery',       label: 'Moments',       icon: '📸' },
  { id: 'attendance',    label: 'Attendance',    icon: '🏆' },
  { id: 'timetable',     label: 'Timetable',     icon: '📅' },
  { id: 'botstatus',     label: 'Bot Status',    icon: '🎙️' },
]

export default function AdminPage() {
  const { token, login, logout, headers } = useAdmin()
  const [activeTab, setActiveTab] = useState<Tab>('announcements')

  const handleLogin = async (pwd: string): Promise<boolean> => {
    const res = await fetch('/api/admin/verify', { method: 'POST', headers: { 'x-admin-token': pwd } })
    if (res.ok) { login(pwd); return true }
    return false
  }

  if (!token) return <LoginScreen onLogin={handleLogin} />

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Top bar */}
      <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-black text-white text-base">Admin Panel</h1>
          <p className="text-zinc-500 text-xs font-medium">6 Amethyst Hub</p>
        </div>
        <button onClick={logout}
          className="flex items-center gap-1.5 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl text-sm font-semibold text-zinc-300 transition-colors">
          <LogOut size={13} /> Logout
        </button>
      </div>

      {/* Tab bar */}
      <div className="bg-zinc-900 border-b border-zinc-800 px-3 overflow-x-auto">
        <div className="flex gap-1 py-2 min-w-max">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
              }`}>
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 max-w-2xl mx-auto pb-16">
        {activeTab === 'announcements' && <AnnouncementsTab headers={headers()} />}
        {activeTab === 'gallery'       && <GalleryTab       headers={headers()} />}
        {activeTab === 'attendance'    && <AttendanceTab    headers={headers()} />}
        {activeTab === 'timetable'     && <TimetableTab     headers={headers()} />}
        {activeTab === 'botstatus'     && <BotStatusTab     headers={headers()} />}
      </div>
    </div>
  )
}
