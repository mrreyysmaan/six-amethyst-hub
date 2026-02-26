export type AnnouncementTag = 'general' | 'reminder' | 'event' | 'collection' | 'urgent'

export interface Announcement {
  id: string
  title: string
  body: string
  summary: string | null
  tag: AnnouncementTag
  deadline: string | null
  form_url: string | null
  pinned: boolean
  created_at: string
}

export interface AttendancePoster {
  id: string
  month_label: string
  image_url: string
  sort_order: number
  created_at: string
}

export interface GalleryPhoto {
  id: string
  image_url: string
  caption: string | null
  uploader_name: string | null
  approved: boolean
  created_at: string
}

export interface Timetable {
  id: string
  image_url: string
  updated_at: string
}
