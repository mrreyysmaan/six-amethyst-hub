import { supabaseAdmin } from '@/lib/supabase'
import type { Announcement, AttendancePoster, GalleryPhoto, Timetable } from '@/lib/types'
import Header from '@/components/Header'
import Announcements from '@/components/Announcements'
import AttendanceCarousel from '@/components/AttendanceCarousel'
import TelegramBot from '@/components/TelegramBot'
import Moments from '@/components/Moments'
import TimetableSection from '@/components/Timetable'
import Contact from '@/components/Contact'

export const revalidate = 60 // revalidate every 60 seconds

async function getData() {
  const supabase = supabaseAdmin()

  const [announcementsRes, postersRes, photosRes, timetableRes] = await Promise.all([
    supabase
      .from('announcements')
      .select('*')
      .order('pinned', { ascending: false })
      .order('created_at', { ascending: false }),
    supabase
      .from('attendance_posters')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false }),
    supabase
      .from('gallery_photos')
      .select('*')
      .eq('approved', true)
      .order('created_at', { ascending: false }),
    supabase
      .from('timetable')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ])

  return {
    announcements: (announcementsRes.data || []) as Announcement[],
    posters: (postersRes.data || []) as AttendancePoster[],
    photos: (photosRes.data || []) as GalleryPhoto[],
    timetable: (timetableRes.data || null) as Timetable | null,
  }
}

export default async function Home() {
  const { announcements, posters, photos, timetable } = await getData()

  return (
    <main className="max-w-2xl mx-auto">
      <Header />

      <div className="divide-y divide-violet-100">
        <Announcements announcements={announcements} />
        <AttendanceCarousel posters={posters} />
        <TelegramBot />
        <Moments photos={photos} />
        <TimetableSection timetable={timetable} />
        <Contact />
      </div>

      {/* Footer */}
      <footer className="bg-violet-900 text-violet-300 text-center text-xs py-5 px-4">
        <p>6 Amethyst Hub · Built with 💜 by Mr Reyy</p>
        <p className="mt-1 text-violet-500">{new Date().getFullYear()}</p>
      </footer>
    </main>
  )
}
