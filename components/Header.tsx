'use client'

import { Sparkles } from 'lucide-react'

export default function Header() {
  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-violet-900 via-violet-700 to-violet-500 text-white">
      {/* Decorative gem shapes */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-4 left-4 w-20 h-20 rotate-45 bg-white rounded-sm" />
        <div className="absolute bottom-4 right-4 w-16 h-16 rotate-12 bg-amber-300 rounded-sm" />
        <div className="absolute top-1/2 left-1/4 w-10 h-10 rotate-45 bg-violet-200 rounded-sm" />
        <div className="absolute top-8 right-12 w-8 h-8 rotate-30 bg-amber-200 rounded-sm" />
      </div>

      <div className="relative px-5 py-10 flex flex-col items-center text-center gap-3">
        {/* Gem icon */}
        <div className="float-animation">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/40">
            <span className="text-3xl">💎</span>
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            6 Amethyst Hub
          </h1>
          <p className="text-violet-200 text-sm mt-1 flex items-center justify-center gap-1">
            <Sparkles size={13} className="text-amber-300" />
            Your class, your space
            <Sparkles size={13} className="text-amber-300" />
          </p>
        </div>

        {/* Nav pill links */}
        <nav className="flex flex-wrap justify-center gap-2 mt-2">
          {[
            { label: 'Announcements', href: '#announcements' },
            { label: 'Attendance', href: '#attendance' },
            { label: 'Speaking Bot', href: '#telegram' },
            { label: 'Moments', href: '#moments' },
            { label: 'Timetable', href: '#timetable' },
            { label: 'Contact', href: '#contact' },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="px-3 py-1 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-medium transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
