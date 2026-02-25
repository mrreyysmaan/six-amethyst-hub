import Image from 'next/image'
import { Send, Wrench, Clock } from 'lucide-react'
import SectionTitle from './SectionTitle'

const steps = [
  { num: '1', text: 'Tap the button below to open Telegram.' },
  { num: '2', text: 'Press the Start button in the chat.' },
  { num: '3', text: "Follow the bot's instructions — it will guide you step by step." },
  { num: '4', text: 'Speak clearly when prompted and have fun!' },
]

// overlay: '' = no overlay | 'coming_soon' | 'maintenance' | any custom message string
export default function TelegramBot({ overlay = '' }: { overlay?: string }) {
  const isComingSoon = overlay === 'coming_soon'
  const isMaintenance = overlay === 'maintenance'
  const hasOverlay = overlay !== ''

  return (
    <section id="telegram" className="px-4 py-8 border-b border-zinc-800/60">
      <SectionTitle icon="🎙️" title="English Speaking Bot" subtitle="Practise speaking English with your AI friend!" />

      <div className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900">

        {/* ── Overlay (Coming Soon / Maintenance) ── */}
        {hasOverlay && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6 rounded-2xl"
            style={{ background: 'rgba(9,9,11,0.88)', backdropFilter: 'blur(6px)' }}
          >
            <div className="w-16 h-16 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center mb-4 text-3xl">
              {isMaintenance ? <Wrench size={28} className="text-amber-400" /> : <Clock size={28} className="text-purple-400" />}
            </div>
            <h3 className="text-xl font-black text-white tracking-tight">
              {isMaintenance ? 'Under Maintenance' : 'Coming Soon'}
            </h3>
            <p className="text-zinc-400 text-sm mt-2 leading-relaxed max-w-xs">
              {isMaintenance
                ? 'MyBFF is currently being updated. Please check back soon!'
                : 'MyBFF is almost ready. Stay tuned for something great!'}
            </p>
            <div className={`mt-4 px-4 py-1.5 rounded-full text-xs font-bold border ${
              isMaintenance
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                : 'bg-purple-500/10 border-purple-500/30 text-purple-400'
            }`}>
              {isMaintenance ? '🔧 Back soon' : '⏳ Stay tuned'}
            </div>
          </div>
        )}

        {/* Header */}
        <div
          className="px-5 pt-8 pb-6 text-center border-b border-zinc-800"
          style={{ background: 'linear-gradient(160deg, #1a0533 0%, #0f0a2a 60%, #09090B 100%)' }}
        >
          <div className="relative inline-block mb-4">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-purple-500 shadow-lg shadow-purple-500/30">
              <Image src="/images/bot-assistant.png" alt="MyBFF" width={96} height={96} className="object-cover w-full h-full" />
            </div>
            <div className={`absolute bottom-0.5 right-0.5 w-5 h-5 rounded-full border-2 border-zinc-900 ${hasOverlay ? 'bg-zinc-600' : 'bg-green-400'}`} />
          </div>
          <h3 className="text-2xl font-black tracking-tight gradient-text-purple">MyBFF</h3>
          <p className="text-zinc-400 text-xs mt-1 font-semibold tracking-widest uppercase">6 Amethyst Speaking Assistant</p>
        </div>

        {/* Body */}
        <div className="px-5 py-5">
          <p className="text-zinc-300 text-sm leading-relaxed text-center">
            Built by Mr Reyy to help you practise English speaking skills.
            Like having a conversation with a friend — anytime, anywhere.
          </p>

          <div className="mt-5 space-y-3">
            {steps.map((step) => (
              <div key={step.num} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-black text-zinc-300 flex-shrink-0 mt-0.5">
                  {step.num}
                </div>
                <p className="text-zinc-300 text-sm leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 bg-zinc-950 rounded-xl border border-zinc-800 p-4 flex flex-col items-center gap-2">
            <p className="text-zinc-400 text-xs font-semibold uppercase tracking-widest">Scan to open</p>
            <div className="relative w-44 h-44">
              <Image src="/images/bot-qrcode.png" alt="QR Code" fill className="object-contain" />
            </div>
            <p className="text-zinc-500 text-xs font-medium">@mybff6Abot</p>
          </div>

          <a
            href="https://t.me/mybff6Abot"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center justify-center gap-2 w-full py-4 font-black text-sm text-white rounded-xl transition-all active:scale-95"
            style={{ background: 'linear-gradient(135deg, #A855F7, #6366F1)', boxShadow: '0 4px 20px #A855F740' }}
          >
            <Send size={15} />
            Open MyBFF on Telegram
          </a>
        </div>
      </div>
    </section>
  )
}
