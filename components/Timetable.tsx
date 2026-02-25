'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, ZoomIn } from 'lucide-react'
import type { Timetable as TimetableType } from '@/lib/types'
import SectionTitle from './SectionTitle'

export default function Timetable({ timetable }: { timetable: TimetableType | null }) {
  const [open, setOpen] = useState(false)

  return (
    <section id="timetable" className="px-4 py-8 border-b border-zinc-800/60">
      <SectionTitle icon="📅" title="Class Timetable" subtitle="Tap to view full screen" />

      {!timetable ? (
        <div className="text-center py-10 text-zinc-600">
          <p className="text-4xl mb-2">📋</p>
          <p className="text-sm font-medium">Timetable will be uploaded soon!</p>
        </div>
      ) : (
        <>
          <button
            onClick={() => setOpen(true)}
            className="relative w-full rounded-2xl overflow-hidden border border-zinc-800 group hover:border-zinc-700 transition-colors"
          >
            <div className="relative w-full aspect-[13/10]">
              <Image src={timetable.image_url} alt="Class Timetable" fill className="object-cover bg-zinc-900" sizes="(max-width: 768px) 100vw, 600px" />
            </div>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-900/90 border border-zinc-700 rounded-xl px-4 py-2 flex items-center gap-2">
                <ZoomIn size={14} className="text-purple-400" />
                <span className="text-sm font-bold text-white">View Full Screen</span>
              </div>
            </div>
          </button>
          <p className="text-xs text-center text-zinc-600 mt-2 font-medium">Tap to expand · Pinch to zoom</p>
        </>
      )}

      {open && timetable && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={() => setOpen(false)}>
          <button className="absolute top-4 right-4 z-10 w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center">
            <X size={18} className="text-white" />
          </button>
          <div className="w-full h-full flex items-center justify-center p-2 overflow-auto" onClick={(e) => e.stopPropagation()}>
            <Image src={timetable.image_url} alt="Class Timetable" width={2200} height={1700} className="max-w-none h-auto" style={{ width: 'max(100%, 800px)' }} />
          </div>
        </div>
      )}
    </section>
  )
}
