import { supabaseAdmin } from '@/lib/supabase'
import type { Announcement, AttendancePoster, GalleryPhoto, Timetable } from '@/lib/types'
import Header from '@/components/Header'
import Announcements from '@/components/Announcements'
import AttendanceCarousel from '@/components/AttendanceCarousel'
import TelegramBot from '@/components/TelegramBot'
import Moments from '@/components/Moments'
import TimetableSection from '@/components/Timetable'
import Contact from '@/components/Contact'
import BackToTop from '@/components/BackToTop'

export const revalidate = 60

async function getData() {
  const supabase = supabaseAdmin()
  const [announcementsRes, postersRes, photosRes, timetableRes, settingsRes] = await Promise.all([
    supabase.from('announcements').select('*').order('pinned', { ascending: false }).order('created_at', { ascending: false }),
    supabase.from('attendance_posters').select('*').order('sort_order', { ascending: true }).order('created_at', { ascending: false }),
    supabase.from('gallery_photos').select('*').eq('approved', true).order('created_at', { ascending: false }),
    supabase.from('timetable').select('*').order('updated_at', { ascending: false }).limit(1).maybeSingle(),
    supabase.from('settings').select('*'),
  ])
  const settingsMap: Record<string, string> = {}
  for (const row of settingsRes.data || []) settingsMap[row.key] = row.value

  // Hide announcements whose event/deadline date has passed (they "erase themselves")
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const allAnnouncements = (announcementsRes.data || []) as Announcement[]
  const announcements = allAnnouncements.filter((a) => {
    if (!a.deadline) return true
    const d = new Date(a.deadline)
    d.setHours(0, 0, 0, 0)
    return d >= today
  })

  return {
    announcements,
    posters: (postersRes.data || []) as AttendancePoster[],
    photos: (photosRes.data || []) as GalleryPhoto[],
    timetable: (timetableRes.data || null) as Timetable | null,
    botOverlay: settingsMap['bot_overlay'] || '',
  }
}

export default async function Home() {
  const { announcements, posters, photos, timetable, botOverlay } = await getData()

  return (
    <main className="max-w-2xl mx-auto">
      <Header />
      <Announcements announcements={announcements} />
      <AttendanceCarousel posters={posters} />
      <TelegramBot overlay={botOverlay} />
      <Moments photos={photos} />
      <TimetableSection timetable={timetable} />
      <Contact />

      <footer className="bg-zinc-950 border-t border-zinc-800 text-center py-6 px-4">
        <p className="text-zinc-600 text-xs font-medium">6 Amethyst Hub · Built by Mr Reyy · 2026</p>
      </footer>

      <BackToTop />
    </main>
  )
}
