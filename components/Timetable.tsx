'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, ZoomIn } from 'lucide-react'
import type { Timetable as TimetableType } from '@/lib/types'
import SectionTitle from './SectionTitle'

interface TimetableProps {
  timetable: TimetableType | null
}

export default function Timetable({ timetable }: TimetableProps) {
  const [open, setOpen] = useState(false)

  return (
    <section id="timetable" className="px-4 py-8">
      <SectionTitle
        icon="📅"
        title="Class Timetable"
        subtitle="Tap to view full screen"
      />

      {!timetable ? (
        <div className="text-center py-10 text-violet-300">
          <p className="text-4xl mb-2">📋</p>
          <p className="text-sm">Timetable will be uploaded soon!</p>
        </div>
      ) : (
        <>
          <button
            onClick={() => setOpen(true)}
            className="relative w-full rounded-2xl overflow-hidden shadow-lg shadow-violet-200 border-2 border-violet-100 group"
          >
            <div className="relative w-full aspect-[13/10]">
              <Image
                src={timetable.image_url}
                alt="Class Timetable"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 600px"
              />
            </div>
            {/* Overlay hint */}
            <div className="absolute inset-0 bg-violet-900/0 group-hover:bg-violet-900/20 transition-colors flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-xl px-4 py-2 flex items-center gap-2 shadow-lg">
                <ZoomIn size={16} className="text-violet-600" />
                <span className="text-sm font-semibold text-violet-700">View Full Screen</span>
              </div>
            </div>
          </button>

          <p className="text-xs text-center text-violet-400 mt-2">
            Tap the timetable to view it in full screen
          </p>
        </>
      )}

      {/* Fullscreen modal */}
      {open && timetable && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setOpen(false)}
        >
          <button className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <X size={20} className="text-white" />
          </button>
          <div
            className="w-full h-full flex items-center justify-center p-2 overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={timetable.image_url}
              alt="Class Timetable Full"
              width={2200}
              height={1700}
              className="max-w-none h-auto"
              style={{ width: 'max(100%, 800px)' }}
            />
          </div>
          <p className="absolute bottom-4 left-0 right-0 text-center text-white/50 text-xs">
            Pinch to zoom • Tap outside to close
          </p>
        </div>
      )}
    </section>
  )
}
