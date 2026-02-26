'use client'

import { Calendar, ExternalLink } from 'lucide-react'
import type { Announcement, AnnouncementTag } from '@/lib/types'
import SectionTitle from './SectionTitle'

const tagConfig: Record<AnnouncementTag, { label: string; color: string; bg: string; bar: string }> = {
  general:    { label: 'General',    color: 'text-purple-300', bg: 'bg-purple-500/10 border border-purple-500/20',   bar: 'bg-purple-500'  },
  reminder:   { label: 'Reminder',   color: 'text-amber-300',  bg: 'bg-amber-500/10 border border-amber-500/20',     bar: 'bg-amber-400'   },
  event:      { label: 'Event',      color: 'text-indigo-300', bg: 'bg-indigo-500/10 border border-indigo-500/20',   bar: 'bg-indigo-400'  },
  collection: { label: 'Collection', color: 'text-emerald-300',bg: 'bg-emerald-500/10 border border-emerald-500/20', bar: 'bg-emerald-400' },
  urgent:     { label: 'Urgent',     color: 'text-red-300',    bg: 'bg-red-500/10 border border-red-500/20',         bar: 'bg-red-500'     },
}

function formatEventDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-MY', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function AnnouncementCard({ item }: { item: Announcement }) {
  const tag = tagConfig[item.tag]
  const description = item.summary?.trim() || item.body?.replace(/\s+/g, ' ').trim().slice(0, 220) + (item.body && item.body.length > 220 ? '…' : '')

  return (
    <div className={`relative rounded-2xl bg-zinc-900 border overflow-hidden transition-all ${
      item.pinned ? 'border-amber-500/30' : 'border-zinc-800 hover:border-zinc-700'
    }`}>
      <div className={`card-accent-bar ${item.pinned ? 'bg-amber-400' : tag.bar}`} />

      <div className="pl-5 pr-4 pt-4 pb-4">
        {/* Tag + Pinned */}
        <div className="flex items-center gap-2 flex-wrap">
          {item.pinned && (
            <span className="text-amber-400 text-xs font-bold">📌 Pinned</span>
          )}
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md tracking-wider uppercase ${tag.bg} ${tag.color}`}>
            {tag.label}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-white mt-2 text-sm leading-snug">{item.title}</h3>

        {/* Short description only */}
        {description && (
          <p className="text-sm text-zinc-300 mt-2 leading-relaxed break-words">
            {description}
          </p>
        )}

        {/* Event date — only when the thing happens; highlighted */}
        {item.deadline && (
          <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/15 border border-amber-500/30">
            <Calendar size={14} className="text-amber-400 flex-shrink-0" />
            <span className="text-amber-300 text-xs font-bold">
              {formatEventDate(item.deadline)}
            </span>
          </div>
        )}

        {/* Form link */}
        {item.form_url && (
          <a
            href={item.form_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center justify-center gap-2 w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-xl transition-colors"
          >
            <ExternalLink size={13} /> Fill in Form
          </a>
        )}
      </div>
    </div>
  )
}

export default function Announcements({ announcements }: { announcements: Announcement[] }) {
  const sorted = [...announcements.filter(a => a.pinned), ...announcements.filter(a => !a.pinned)]

  return (
    <section id="announcements" className="px-4 py-8 border-b border-zinc-800/60">
      <SectionTitle icon="📢" title="Announcements" subtitle="Latest updates from Mr Reyy" />
      {sorted.length === 0 ? (
        <div className="text-center py-10 text-zinc-600">
          <p className="text-4xl mb-2">📭</p>
          <p className="text-sm font-medium">No announcements yet. Check back soon!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((item) => <AnnouncementCard key={item.id} item={item} />)}
        </div>
      )}
    </section>
  )
}
