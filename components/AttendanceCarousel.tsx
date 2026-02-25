'use client'

import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import type { AttendancePoster } from '@/lib/types'
import SectionTitle from './SectionTitle'

interface AttendanceCarouselProps {
  posters: AttendancePoster[]
}

export default function AttendanceCarousel({ posters }: AttendanceCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [selectedIndex, setSelectedIndex] = useState(0)

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap())
    emblaApi.on('select', onSelect)
    onSelect()
    return () => { emblaApi.off('select', onSelect) }
  }, [emblaApi])

  return (
    <section id="attendance" className="px-4 py-8 bg-white">
      <SectionTitle
        icon="🏆"
        title="100% Attendance Wall"
        subtitle="Celebrating perfect attendance — every month"
      />

      {posters.length === 0 ? (
        <div className="text-center py-10 text-violet-300">
          <p className="text-4xl mb-2">🌟</p>
          <p className="text-sm">Attendance posters will appear here soon!</p>
        </div>
      ) : (
        <div className="relative">
          {/* Carousel */}
          <div className="embla rounded-2xl overflow-hidden shadow-lg shadow-violet-200" ref={emblaRef}>
            <div className="embla__container">
              {posters.map((poster) => (
                <div key={poster.id} className="embla__slide relative">
                  <div className="relative w-full aspect-[3/4] max-h-[75vh]">
                    <Image
                      src={poster.image_url}
                      alt={`${poster.month_label} 100% Attendance`}
                      fill
                      className="object-contain bg-violet-50"
                      sizes="(max-width: 768px) 100vw, 600px"
                    />
                  </div>
                  {/* Month label */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-violet-900/80 to-transparent px-4 py-3">
                    <p className="text-white font-bold text-center text-sm">
                      🌟 {poster.month_label} — Perfect Attendance
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Prev / Next buttons */}
          {posters.length > 1 && (
            <>
              <button
                onClick={scrollPrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-violet-700 hover:bg-violet-50 transition-colors z-10"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={scrollNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-violet-700 hover:bg-violet-50 transition-colors z-10"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}

          {/* Dots */}
          {posters.length > 1 && (
            <div className="flex justify-center gap-2 mt-3">
              {posters.map((_, i) => (
                <button
                  key={i}
                  onClick={() => emblaApi?.scrollTo(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === selectedIndex
                      ? 'w-6 bg-violet-600'
                      : 'w-2 bg-violet-200'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  )
}
