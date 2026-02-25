'use client'

import { useState } from 'react'
import { Pin, Clock, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'
import type { Announcement, AnnouncementTag } from '@/lib/types'
import SectionTitle from './SectionTitle'

const tagConfig: Record<AnnouncementTag, { label: string; color: string; bg: string }> = {
  general:    { label: 'General',    color: 'text-violet-700', bg: 'bg-violet-100' },
  reminder:   { label: 'Reminder',   color: 'text-amber-700',  bg: 'bg-amber-100'  },
  event:      { label: 'Event',      color: 'text-blue-700',   bg: 'bg-blue-100'   },
  collection: { label: 'Collection', color: 'text-green-700',  bg: 'bg-green-100'  },
  urgent:     { label: 'Urgent',     color: 'text-red-700',    bg: 'bg-red-100'    },
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-MY', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function getDaysUntil(deadline: string) {
  const now = new Date()
  const due = new Date(deadline)
  const diff = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  return diff
}

function AnnouncementCard({ item }: { item: Announcement }) {
  const [expanded, setExpanded] = useState(false)
  const tag = tagConfig[item.tag]
  const daysUntil = item.deadline ? getDaysUntil(item.deadline) : null

  return (
    <div
      className={`rounded-2xl bg-white shadow-sm border transition-all ${
        item.pinned ? 'border-amber-300 shadow-amber-100' : 'border-violet-100'
      }`}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-4"
      >
        {/* Top row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
            {item.pinned && (
              <span className="flex items-center gap-1 text-amber-500 text-xs font-medium">
                <Pin size={12} className="fill-amber-400" /> Pinned
              </span>
            )}
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${tag.bg} ${tag.color}`}>
              {tag.label}
            </span>
          </div>
          {expanded ? (
            <ChevronUp size={16} className="text-violet-400 flex-shrink-0 mt-0.5" />
          ) : (
            <ChevronDown size={16} className="text-violet-400 flex-shrink-0 mt-0.5" />
          )}
        </div>

        {/* Title */}
        <h3 className="font-bold text-violet-900 mt-2 text-base leading-snug">{item.title}</h3>

        {/* Date */}
        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
          <Clock size={11} /> {formatDate(item.created_at)}
        </p>

        {/* Preview (collapsed) */}
        {!expanded && (
          <p className="text-sm text-gray-500 mt-2 line-clamp-2 announcement-body">
            {item.body}
          </p>
        )}
      </button>

      {/* Expanded body */}
      {expanded && (
        <div className="px-4 pb-4 space-y-3">
          <p className="text-sm text-gray-700 leading-relaxed announcement-body">{item.body}</p>

          {/* Deadline badge */}
          {item.deadline && daysUntil !== null && (
            <div
              className={`flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl ${
                daysUntil <= 3
                  ? 'bg-red-50 text-red-600 border border-red-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}
            >
              <Clock size={13} />
              Deadline:{' '}
              {new Date(item.deadline).toLocaleDateString('en-MY', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
              {daysUntil <= 0
                ? ' — Overdue!'
                : daysUntil === 1
                ? ' — Tomorrow!'
                : ` — ${daysUntil} days left`}
            </div>
          )}

          {/* Form link */}
          {item.form_url && (
            <a
              href={item.form_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              <ExternalLink size={14} /> Fill in Form
            </a>
          )}
        </div>
      )}
    </div>
  )
}

interface AnnouncementsProps {
  announcements: Announcement[]
}

export default function Announcements({ announcements }: AnnouncementsProps) {
  const pinned = announcements.filter((a) => a.pinned)
  const rest = announcements.filter((a) => !a.pinned)
  const sorted = [...pinned, ...rest]

  return (
    <section id="announcements" className="px-4 py-8">
      <SectionTitle
        icon="📢"
        title="Announcements"
        subtitle="Latest updates from Mr Reyy"
      />

      {sorted.length === 0 ? (
        <div className="text-center py-10 text-violet-300">
          <p className="text-4xl mb-2">📭</p>
          <p className="text-sm">No announcements yet. Check back soon!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((item) => (
            <AnnouncementCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  )
}
