interface SectionTitleProps {
  icon: string
  title: string
  subtitle?: string
}

export default function SectionTitle({ icon, title, subtitle }: SectionTitleProps) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-violet-800 flex items-center justify-center text-xl shadow-md shadow-violet-300 flex-shrink-0">
        {icon}
      </div>
      <div>
        <h2 className="text-lg font-bold text-violet-900">{title}</h2>
        {subtitle && <p className="text-xs text-violet-500">{subtitle}</p>}
      </div>
    </div>
  )
}
