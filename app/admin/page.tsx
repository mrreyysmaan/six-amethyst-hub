'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import {
  Lock, LogOut, Plus, Trash2, Pin, PinOff,
  CheckCircle, XCircle, Upload, RefreshCw, ChevronDown, ChevronUp
} from 'lucide-react'
import type { Announcement, AnnouncementTag, AttendancePoster, GalleryPhoto } from '@/lib/types'

const TAG_OPTIONS: { value: AnnouncementTag; label: string; color: string }[] = [
  { value: 'general',    label: 'General',    color: 'bg-violet-100 text-violet-700' },
  { value: 'reminder',   label: 'Reminder',   color: 'bg-amber-100 text-amber-700'   },
  { value: 'event',      label: 'Event',      color: 'bg-blue-100 text-blue-700'     },
  { value: 'collection', label: 'Collection', color: 'bg-green-100 text-green-700'   },
  { value: 'urgent',     label: 'Urgent',     color: 'bg-red-100 text-red-700'       },
]

function useAdmin() {
  const [token, setToken] = useState<string | null>(null)
  useEffect(() => {
    const saved = sessionStorage.getItem('admin_token')
    if (saved) setToken(saved)
  }, [])
  const login = (pwd: string) => {
    setToken(pwd)
    sessionStorage.setItem('admin_token', pwd)
  }
  const logout = () => {
    setToken(null)
    sessionStorage.removeItem('admin_token')
  }
  const headers = (extra?: Record<string, string>) => ({
    'x-admin-token': token || '',
    'Content-Type': 'application/json',
    ...extra,
  })
  return { token, login, logout, headers }
}

// ─── Login Screen ────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: (pwd: string) => Promise<boolean> }) {
  const [pwd, setPwd] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const ok = await onLogin(pwd)
    if (!ok) setError('Incorrect password. Please try again.')
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl text-center">
        <div className="w-16 h-16 rounded-full bg-violet-100 flex items-center justify-center mx-auto mb-4">
          <Lock size={28} className="text-violet-600" />
        </div>
        <h1 className="text-xl font-bold text-violet-900 mb-1">Admin Panel</h1>
        <p className="text-sm text-gray-500 mb-6">6 Amethyst Hub</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Enter password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            className="w-full border border-violet-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-300"
          />
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <button
            type="submit"
            disabled={loading || !pwd}
            className="w-full py-3 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-bold rounded-xl transition-colors"
          >
            {loading ? 'Checking...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ─── Announcements Tab ───────────────────────────────────────────────────────
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
    const data = await res.json()
    setItems(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const post = async () => {
    setSaving(true)
    await fetch('/api/announcements', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        ...form,
        deadline: form.deadline || null,
        form_url: form.form_url || null,
      }),
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
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-violet-900">Announcements</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1 px-3 py-2 bg-violet-600 text-white text-sm font-semibold rounded-xl"
        >
          <Plus size={14} /> New
        </button>
      </div>

      {showForm && (
        <div className="bg-violet-50 rounded-2xl p-4 mb-4 space-y-3">
          <input
            type="text"
            placeholder="Title (short, e.g. Class Trip Payment)"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border border-violet-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-300"
          />
          <textarea
            placeholder="Paste the full announcement here..."
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
            rows={6}
            className="w-full border border-violet-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-300 resize-none"
          />
          <div className="flex flex-wrap gap-2">
            {TAG_OPTIONS.map((t) => (
              <button
                key={t.value}
                onClick={() => setForm({ ...form, tag: t.value })}
                className={`px-3 py-1 rounded-full text-xs font-semibold border-2 transition-all ${
                  form.tag === t.value
                    ? `${t.color} border-current`
                    : 'bg-white text-gray-400 border-gray-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <input
            type="date"
            placeholder="Deadline (optional)"
            value={form.deadline}
            onChange={(e) => setForm({ ...form, deadline: e.target.value })}
            className="w-full border border-violet-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-300"
          />
          <input
            type="url"
            placeholder="Form link (optional)"
            value={form.form_url}
            onChange={(e) => setForm({ ...form, form_url: e.target.value })}
            className="w-full border border-violet-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-300"
          />
          <label className="flex items-center gap-2 text-sm text-violet-700 cursor-pointer">
            <input
              type="checkbox"
              checked={form.pinned}
              onChange={(e) => setForm({ ...form, pinned: e.target.checked })}
              className="w-4 h-4 accent-violet-600"
            />
            Pin this announcement (stays at top)
          </label>
          <button
            onClick={post}
            disabled={!form.title || !form.body || saving}
            className="w-full py-3 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-bold rounded-xl"
          >
            {saving ? 'Posting...' : 'Post Announcement'}
          </button>
        </div>
      )}

      {loading ? (
        <p className="text-center text-violet-300 py-8">Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-center text-violet-300 py-8">No announcements yet.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className={`bg-white rounded-xl p-4 border ${item.pinned ? 'border-amber-300' : 'border-violet-100'}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    {item.pinned && <span className="text-amber-500 text-xs font-semibold">📌 Pinned</span>}
                    <span className="text-xs text-violet-500 bg-violet-50 px-2 py-0.5 rounded-full capitalize">{item.tag}</span>
                  </div>
                  <p className="font-semibold text-violet-900 text-sm">{item.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{new Date(item.created_at).toLocaleDateString('en-MY')}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => toggle(item.id, item.pinned)}
                    className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center"
                  >
                    {item.pinned ? <PinOff size={14} className="text-amber-500" /> : <Pin size={14} className="text-amber-400" />}
                  </button>
                  <button
                    onClick={() => remove(item.id)}
                    className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center"
                  >
                    <Trash2 size={14} className="text-red-400" />
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

// ─── Gallery Moderation Tab ──────────────────────────────────────────────────
function GalleryTab({ headers }: { headers: Record<string, string> }) {
  const [pending, setPending] = useState<GalleryPhoto[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const res = await fetch('/api/gallery/approve', {
      headers: { 'x-admin-token': headers['x-admin-token'] },
    })
    const data = await res.json()
    setPending(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const decide = async (id: string, approved: boolean) => {
    await fetch('/api/gallery/approve', {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ id, approved }),
    })
    await load()
  }

  const remove = async (id: string) => {
    await fetch('/api/gallery/approve', {
      method: 'DELETE',
      headers,
      body: JSON.stringify({ id }),
    })
    await load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-violet-900">Moments — Pending Approval</h2>
        <button onClick={load} className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center">
          <RefreshCw size={14} className="text-violet-500" />
        </button>
      </div>

      {loading ? (
        <p className="text-center text-violet-300 py-8">Loading...</p>
      ) : pending.length === 0 ? (
        <div className="text-center py-10 text-violet-300">
          <p className="text-3xl mb-2">✅</p>
          <p className="text-sm">No pending photos — all clear!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pending.map((photo) => (
            <div key={photo.id} className="bg-white rounded-2xl overflow-hidden border border-violet-100 shadow-sm">
              <div className="relative w-full aspect-square">
                <Image src={photo.image_url} alt="Pending" fill className="object-cover" />
              </div>
              <div className="p-3 space-y-1">
                {photo.uploader_name && <p className="text-sm font-medium text-violet-900">By: {photo.uploader_name}</p>}
                {photo.caption && <p className="text-sm text-gray-500">{photo.caption}</p>}
                <p className="text-xs text-gray-400">{new Date(photo.created_at).toLocaleString('en-MY')}</p>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => decide(photo.id, true)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-bold rounded-xl"
                  >
                    <CheckCircle size={15} /> Approve
                  </button>
                  <button
                    onClick={() => remove(photo.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-xl"
                  >
                    <XCircle size={15} /> Reject
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

// ─── Attendance Tab ──────────────────────────────────────────────────────────
function AttendanceTab({ headers }: { headers: Record<string, string> }) {
  const [posters, setPosters] = useState<AttendancePoster[]>([])
  const [loading, setLoading] = useState(true)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [monthLabel, setMonthLabel] = useState('')
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const load = async () => {
    setLoading(true)
    const res = await fetch('/api/attendance')
    const data = await res.json()
    setPosters(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleFile = (f: File) => {
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const upload = async () => {
    if (!file || !monthLabel) return
    setUploading(true)
    const form = new FormData()
    form.append('file', file)
    form.append('month_label', monthLabel)
    await fetch('/api/attendance', {
      method: 'POST',
      headers: { 'x-admin-token': headers['x-admin-token'] },
      body: form,
    })
    setFile(null)
    setPreview(null)
    setMonthLabel('')
    await load()
    setUploading(false)
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this poster?')) return
    await fetch('/api/attendance', { method: 'DELETE', headers, body: JSON.stringify({ id }) })
    await load()
  }

  return (
    <div>
      <h2 className="font-bold text-violet-900 mb-4">Attendance Posters</h2>

      {/* Upload form */}
      <div className="bg-violet-50 rounded-2xl p-4 mb-4 space-y-3">
        <p className="text-sm font-semibold text-violet-700">Upload New Poster</p>
        <div
          className="border-2 border-dashed border-violet-200 rounded-xl p-4 flex flex-col items-center gap-2 cursor-pointer"
          onClick={() => inputRef.current?.click()}
        >
          {preview ? (
            <div className="relative w-full aspect-[3/4] max-h-40">
              <Image src={preview} alt="Preview" fill className="object-contain" />
            </div>
          ) : (
            <>
              <Upload size={24} className="text-violet-300" />
              <p className="text-sm text-violet-500">Tap to choose poster image</p>
            </>
          )}
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
        </div>
        <input
          type="text"
          placeholder="Month label (e.g. January 2025)"
          value={monthLabel}
          onChange={(e) => setMonthLabel(e.target.value)}
          className="w-full border border-violet-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-300"
        />
        <button
          onClick={upload}
          disabled={!file || !monthLabel || uploading}
          className="w-full py-3 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-bold rounded-xl"
        >
          {uploading ? 'Uploading...' : 'Upload Poster'}
        </button>
      </div>

      {/* Existing posters */}
      {loading ? (
        <p className="text-center text-violet-300 py-4">Loading...</p>
      ) : posters.length === 0 ? (
        <p className="text-center text-violet-300 py-4">No posters yet.</p>
      ) : (
        <div className="space-y-3">
          {posters.map((poster) => (
            <div key={poster.id} className="bg-white rounded-xl p-3 border border-violet-100 flex items-center gap-3">
              <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                <Image src={poster.image_url} alt={poster.month_label} fill className="object-cover" />
              </div>
              <p className="flex-1 font-medium text-sm text-violet-900">{poster.month_label}</p>
              <button onClick={() => remove(poster.id)} className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                <Trash2 size={14} className="text-red-400" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Timetable Tab ───────────────────────────────────────────────────────────
function TimetableTab({ headers }: { headers: Record<string, string> }) {
  const [current, setCurrent] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const load = async () => {
    const res = await fetch('/api/timetable')
    const data = await res.json()
    if (data?.image_url) setCurrent(data.image_url)
  }

  useEffect(() => { load() }, [])

  const handleFile = (f: File) => {
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const upload = async () => {
    if (!file) return
    setUploading(true)
    const form = new FormData()
    form.append('file', file)
    await fetch('/api/timetable', {
      method: 'POST',
      headers: { 'x-admin-token': headers['x-admin-token'] },
      body: form,
    })
    setFile(null)
    setPreview(null)
    await load()
    setUploading(false)
  }

  return (
    <div>
      <h2 className="font-bold text-violet-900 mb-4">Class Timetable</h2>

      {current && (
        <div className="mb-4">
          <p className="text-xs text-violet-500 mb-2 font-medium">Current timetable:</p>
          <div className="relative w-full aspect-[13/10] rounded-xl overflow-hidden border border-violet-100">
            <Image src={current} alt="Current timetable" fill className="object-contain bg-gray-50" />
          </div>
        </div>
      )}

      <div className="bg-violet-50 rounded-2xl p-4 space-y-3">
        <p className="text-sm font-semibold text-violet-700">Replace Timetable</p>
        <div
          className="border-2 border-dashed border-violet-200 rounded-xl p-4 flex flex-col items-center gap-2 cursor-pointer"
          onClick={() => inputRef.current?.click()}
        >
          {preview ? (
            <div className="relative w-full aspect-[13/10] max-h-40">
              <Image src={preview} alt="Preview" fill className="object-contain" />
            </div>
          ) : (
            <>
              <Upload size={24} className="text-violet-300" />
              <p className="text-sm text-violet-500">Tap to choose timetable image</p>
            </>
          )}
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
        </div>
        <button
          onClick={upload}
          disabled={!file || uploading}
          className="w-full py-3 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-bold rounded-xl"
        >
          {uploading ? 'Uploading...' : 'Upload New Timetable'}
        </button>
      </div>
    </div>
  )
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────
type Tab = 'announcements' | 'gallery' | 'attendance' | 'timetable'

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'announcements', label: 'Announcements', icon: '📢' },
  { id: 'gallery',       label: 'Moments',       icon: '📸' },
  { id: 'attendance',    label: 'Attendance',    icon: '🏆' },
  { id: 'timetable',     label: 'Timetable',     icon: '📅' },
]

export default function AdminPage() {
  const { token, login, logout, headers } = useAdmin()
  const [activeTab, setActiveTab] = useState<Tab>('announcements')
  const [authChecking, setAuthChecking] = useState(false)

  const handleLogin = async (pwd: string): Promise<boolean> => {
    setAuthChecking(true)
    const res = await fetch('/api/announcements', {
      headers: { 'x-admin-token': pwd },
    })
    setAuthChecking(false)
    if (res.ok || res.status !== 401) {
      login(pwd)
      return true
    }
    return false
  }

  if (!token) {
    return <LoginScreen onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-violet-50">
      {/* Top bar */}
      <div className="bg-gradient-to-r from-violet-800 to-violet-600 text-white px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-lg">Admin Panel</h1>
          <p className="text-violet-200 text-xs">6 Amethyst Hub</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-1.5 px-3 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-medium transition-colors"
        >
          <LogOut size={14} /> Logout
        </button>
      </div>

      {/* Tab bar */}
      <div className="bg-white border-b border-violet-100 px-4 overflow-x-auto">
        <div className="flex gap-1 py-2 min-w-max">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-violet-600 text-white'
                  : 'text-violet-600 hover:bg-violet-50'
              }`}
            >
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 max-w-2xl mx-auto pb-16">
        {activeTab === 'announcements' && <AnnouncementsTab headers={headers()} />}
        {activeTab === 'gallery' && <GalleryTab headers={headers()} />}
        {activeTab === 'attendance' && <AttendanceTab headers={headers()} />}
        {activeTab === 'timetable' && <TimetableTab headers={headers()} />}
      </div>
    </div>
  )
}
