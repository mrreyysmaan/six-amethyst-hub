import SectionTitle from './SectionTitle'
import { MessageCircle, BookOpen, Users } from 'lucide-react'

export default function Contact() {
  return (
    <section id="contact" className="px-4 py-8 bg-white">
      <SectionTitle
        icon="👨‍🏫"
        title="Contact Mr Reyy"
        subtitle="Reach out anytime"
      />

      <div className="bg-gradient-to-br from-violet-50 to-violet-100 rounded-3xl p-5 text-center">
        {/* Avatar */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-600 to-violet-800 flex items-center justify-center mx-auto shadow-lg shadow-violet-300 mb-3">
          <span className="text-4xl">👨‍🏫</span>
        </div>

        <h3 className="text-xl font-bold text-violet-900">Mr Reyy</h3>

        {/* Roles */}
        <div className="flex items-center justify-center gap-3 mt-2 flex-wrap">
          <span className="flex items-center gap-1 text-xs text-violet-600 bg-white px-3 py-1 rounded-full shadow-sm">
            <Users size={11} /> Class Teacher
          </span>
          <span className="flex items-center gap-1 text-xs text-violet-600 bg-white px-3 py-1 rounded-full shadow-sm">
            <BookOpen size={11} /> English Teacher
          </span>
        </div>

        <p className="text-sm text-violet-700 mt-3 leading-relaxed">
          Have a question, concern, or just want to say hello?<br />
          Feel free to reach out via WhatsApp!
        </p>

        {/* WhatsApp Button */}
        <a
          href="https://wa.me/+60104513351"
          target="_blank"
          rel="noopener noreferrer"
          className="relative mt-5 inline-flex items-center justify-center gap-3 w-full py-4 bg-green-500 hover:bg-green-600 text-white font-bold text-base rounded-2xl shadow-lg shadow-green-400/40 transition-all active:scale-95"
        >
          <MessageCircle size={20} className="fill-white" />
          WhatsApp Mr Reyy
        </a>

        <p className="text-xs text-violet-400 mt-3">
          6 Amethyst • {new Date().getFullYear()}
        </p>
      </div>
    </section>
  )
}
