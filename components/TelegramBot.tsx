import Image from 'next/image'
import { Send } from 'lucide-react'
import SectionTitle from './SectionTitle'

const steps = [
  { num: '1', text: 'Tap the button below to open Telegram.' },
  { num: '2', text: 'Press the Start button in the chat.' },
  { num: '3', text: 'Follow the bot\'s instructions — it will guide you step by step.' },
  { num: '4', text: 'Speak clearly when prompted and have fun!' },
]

export default function TelegramBot() {
  return (
    <section id="telegram" className="px-4 py-8">
      <SectionTitle
        icon="🎙️"
        title="English Speaking Bot"
        subtitle="Practice speaking English with your AI friend!"
      />

      <div className="bg-gradient-to-br from-violet-900 to-indigo-900 rounded-3xl overflow-hidden shadow-xl shadow-violet-300">
        {/* Bot image + name */}
        <div className="flex flex-col items-center pt-8 pb-4 px-4">
          <div className="relative">
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-amber-400 shadow-lg shadow-amber-400/30">
              <Image
                src="/images/bot-assistant.png"
                alt="MyBFF6A Speaking Bot"
                width={112}
                height={112}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-green-400 border-2 border-white flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-white" />
            </div>
          </div>
          <h3 className="text-white font-bold text-xl mt-3">MyBFF6A</h3>
          <p className="text-violet-300 text-xs mt-0.5">Your English Speaking Buddy</p>
        </div>

        {/* Description */}
        <div className="px-5 pb-4">
          <p className="text-violet-100 text-sm text-center leading-relaxed">
            MyBFF6A is a Telegram bot built by Mr Reyy to help you practise speaking English.
            It listens, responds, and helps you become a more confident speaker — just like
            having a conversation with a friend!
          </p>
        </div>

        {/* How to use */}
        <div className="mx-4 mb-4 bg-white/10 rounded-2xl p-4">
          <p className="text-amber-300 font-semibold text-sm mb-3">How to use it:</p>
          <div className="space-y-2.5">
            {steps.map((step) => (
              <div key={step.num} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center text-xs font-bold text-violet-900 flex-shrink-0 mt-0.5">
                  {step.num}
                </div>
                <p className="text-violet-100 text-sm leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* QR Code */}
        <div className="mx-4 mb-4 bg-white rounded-2xl overflow-hidden flex flex-col items-center p-4 gap-2">
          <p className="text-violet-700 font-semibold text-sm">Scan to open the bot</p>
          <div className="relative w-48 h-48">
            <Image
              src="/images/bot-qrcode.png"
              alt="MyBFF6A QR Code"
              fill
              className="object-contain"
            />
          </div>
          <p className="text-violet-400 text-xs">@mybff6Abot</p>
        </div>

        {/* CTA Button */}
        <div className="px-4 pb-8">
          <a
            href="https://t.me/mybff6Abot"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-violet-900 font-bold text-base rounded-2xl shadow-lg shadow-amber-400/40 transition-all active:scale-95"
          >
            <Send size={18} />
            Open MyBFF6A on Telegram
          </a>
        </div>
      </div>
    </section>
  )
}
