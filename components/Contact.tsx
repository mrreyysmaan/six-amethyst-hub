import SectionTitle from './SectionTitle'
import { MessageCircle, BookOpen, Users } from 'lucide-react'

export default function Contact() {
  return (
    <section id="contact" className="px-4 py-8 border-b border-zinc-800/60">
      <SectionTitle icon="👨‍🏫" title="Contact Mr Reyy" subtitle="Reach out anytime" />

      <div className="relative rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden p-5 text-center">
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, #A855F780, transparent)' }} />

        {/* Avatar */}
        <div className="w-20 h-20 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center mx-auto mb-4 text-4xl">
          👨‍🏫
        </div>

        <h3 className="text-xl font-black text-white tracking-tight">Mr Reyy</h3>

        {/* Roles */}
        <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
          <span className="flex items-center gap-1.5 text-xs text-zinc-300 bg-zinc-800 border border-zinc-700 px-3 py-1.5 rounded-lg font-semibold">
            <Users size={11} className="text-purple-400" /> Class Teacher
          </span>
          <span className="flex items-center gap-1.5 text-xs text-zinc-300 bg-zinc-800 border border-zinc-700 px-3 py-1.5 rounded-lg font-semibold">
            <BookOpen size={11} className="text-purple-400" /> English Teacher
          </span>
        </div>

        <p className="text-sm text-zinc-400 mt-4 leading-relaxed">
          Have a question or concern?<br />Send a message on WhatsApp anytime.
        </p>

        <a
          href="https://wa.me/+60104513351"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 flex items-center justify-center gap-3 w-full py-4 bg-green-600 hover:bg-green-700 text-white font-black text-sm rounded-xl transition-colors shadow-lg shadow-green-900/40 active:scale-95"
        >
          <MessageCircle size={18} className="fill-white" />
          WhatsApp Mr Reyy
        </a>
      </div>
    </section>
  )
}
