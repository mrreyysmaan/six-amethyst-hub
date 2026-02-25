'use client'

import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'

export default function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 250)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      className="fixed bottom-6 right-5 z-50 w-11 h-11 rounded-xl border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 hover:border-purple-500 flex items-center justify-center text-zinc-300 hover:text-white shadow-lg shadow-black/40 transition-all hover:-translate-y-1 active:scale-95"
    >
      <ArrowUp size={18} />
    </button>
  )
}
