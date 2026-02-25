'use client'

export default function Header() {
  return (
    <header className="relative overflow-hidden bg-[#09090B] border-b border-zinc-800">
      {/* Background glow */}
      <div
        className="header-glow absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] pointer-events-none"
        style={{
          background: 'conic-gradient(from 0deg at 50% 0%, #A855F728, #6366F118, #8B5CF720, #A855F728)',
          filter: 'blur(60px)',
        }}
      />

      <div className="relative z-10 px-5 pt-10 pb-8 flex flex-col items-center text-center gap-4">
        {/* Eyebrow */}
        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-1.5">
          <span className="text-purple-400 text-xs font-bold tracking-widest uppercase">Class of 2026</span>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-4xl font-black tracking-tight leading-none">
            <span className="text-white">6 </span>
            <span className="gradient-text-purple">Amethyst</span>
            <span className="text-white"> Hub</span>
          </h1>
          <p className="mt-3 text-xs font-bold tracking-[4px] uppercase text-zinc-300">
            Learn<span className="text-purple-500 mx-2">·</span>
            Love<span className="text-purple-500 mx-2">·</span>
            Legacy
          </p>
        </div>

        {/* Nav pills */}
        <nav className="flex flex-wrap justify-center gap-2 mt-1">
          {[
            { label: 'Announcements', href: '#announcements' },
            { label: 'Attendance',    href: '#attendance'    },
            { label: 'Speaking Bot',  href: '#telegram'      },
            { label: 'Moments',       href: '#moments'       },
            { label: 'Timetable',     href: '#timetable'     },
            { label: 'Contact',       href: '#contact'       },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-semibold hover:border-purple-600 hover:text-white transition-all"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      {/* Bottom separator */}
      <div
        className="h-px"
        style={{ background: 'linear-gradient(90deg, transparent, #A855F750, transparent)' }}
      />
    </header>
  )
}
