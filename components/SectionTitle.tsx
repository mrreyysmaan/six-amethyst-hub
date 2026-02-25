interface SectionTitleProps {
  icon: string
  title: string
  subtitle?: string
}

export default function SectionTitle({ icon, title, subtitle }: SectionTitleProps) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xl flex-shrink-0">
        {icon}
      </div>
      <div>
        <h2 className="text-base font-bold text-white tracking-tight">{title}</h2>
        {subtitle && <p className="text-xs text-zinc-400 mt-0.5 font-medium">{subtitle}</p>}
      </div>
    </div>
  )
}
