'use client'

import { useState } from 'react'
import { Pin, Clock, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'
import type { Announcement, AnnouncementTag } from '@/lib/types'
import SectionTitle from './SectionTitle'

const tagConfig: Record<AnnouncementTag, { label: string; color: string; bg: string; bar: string }> = {
  general:    { label: 'General',    color: 'text-purple-300', bg: 'bg-purple-500/10 border border-purple-500/20',   bar: 'bg-purple-500'  },
  reminder:   { label: 'Reminder',   color: 'text-amber-300',  bg: 'bg-amber-500/10 border border-amber-500/20',     bar: 'bg-amber-400'   },
  event:      { label: 'Event',      color: 'text-indigo-300', bg: 'bg-indigo-500/10 border border-indigo-500/20',   bar: 'bg-indigo-400'  },
  collection: { label: 'Collection', color: 'text-emerald-300',bg: 'bg-emerald-500/10 border border-emerald-500/20', bar: 'bg-emerald-400' },
  urgent:     { label: 'Urgent',     color: 'text-red-300',    bg: 'bg-red-500/10 border border-red-500/20',         bar: 'bg-red-500'     },
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-MY', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

function getDaysUntil(deadline: string) {
  const diff = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  return diff
}

function AnnouncementCard({ item }: { item: Announcement }) {
  const [expanded, setExpanded] = useState(false)
  const tag = tagConfig[item.tag]
  const daysUntil = item.deadline ? getDaysUntil(item.deadline) : null

  return (
    <div className={`relative rounded-2xl bg-zinc-900 border overflow-hidden transition-all ${
      item.pinned ? 'border-amber-500/30' : 'border-zinc-800 hover:border-zinc-700'
    }`}>
      {/* Left accent bar */}
      <div className={`card-accent-bar ${item.pinned ? 'bg-amber-400' : tag.bar}`} />

      <button onClick={() => setExpanded(!expanded)} className="w-full text-left pl-5 pr-4 pt-4 pb-4">
        {/* Top row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
            {item.pinned && (
              <span className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                <Pin size={11} className="fill-amber-400" /> Pinned
              </span>
            )}
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md tracking-wider uppercase ${tag.bg} ${tag.color}`}>
              {tag.label}
            </span>
          </div>
          {expanded
            ? <ChevronUp size={15} className="text-zinc-500 flex-shrink-0 mt-0.5" />
            : <ChevronDown size={15} className="text-zinc-500 flex-shrink-0 mt-0.5" />
          }
        </div>

        {/* Title */}
        <h3 className="font-bold text-white mt-2 text-sm leading-snug">{item.title}</h3>

        {/* Date */}
        <p className="text-xs text-zinc-500 mt-1 flex items-center gap-1 font-medium">
          <Clock size={10} /> {formatDate(item.created_at)}
        </p>

        {/* Preview: short description (summary) or trimmed body — avoids long blank space */}
        {!expanded && (
          <p className="text-sm text-zinc-300 mt-2 line-clamp-3 leading-relaxed break-words">
            {item.summary?.trim()
              ? item.summary
              : item.body
                ? item.body.replace(/\s+/g, ' ').trim().slice(0, 220) + (item.body.length > 220 ? '…' : '')
                : ''}
          </p>
        )}
      </button>

      {/* Expanded */}
      {expanded && (
        <div className="pl-5 pr-4 pb-4 space-y-3">
          <p className="text-sm text-zinc-200 leading-relaxed announcement-body">{item.body}</p>

          {item.deadline && daysUntil !== null && (
            <div className={`flex items-center gap-2 text-xs font-bold px-3 py-2.5 rounded-xl border ${
              daysUntil <= 3
                ? 'bg-red-500/10 text-red-300 border-red-500/20'
                : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
            }`}>
              <Clock size={12} />
              Deadline:{' '}
              {new Date(item.deadline).toLocaleDateString('en-MY', { day: 'numeric', month: 'long', year: 'numeric' })}
              {daysUntil <= 0 ? ' — Overdue!'
                : daysUntil === 1 ? ' — Tomorrow!'
                : ` — ${daysUntil} days left`}
            </div>
          )}

          {item.form_url && (
            <a
              href={item.form_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-xl transition-colors"
            >
              <ExternalLink size={13} /> Fill in Form
            </a>
          )}
        </div>
      )}
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
