'use client'

import { useState, useRef, useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'
import { Upload, X, Camera, ChevronLeft, ChevronRight } from 'lucide-react'
import type { GalleryPhoto } from '@/lib/types'
import SectionTitle from './SectionTitle'

interface MomentsProps {
  photos: GalleryPhoto[]
}

function UploadModal({ onClose }: { onClose: () => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [caption, setCaption] = useState('')
  const [uploading, setUploading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (f: File) => {
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    if (f && f.type.startsWith('image/')) handleFile(f)
  }

  const handleSubmit = async () => {
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('uploader_name', name)
      formData.append('caption', caption)

      const res = await fetch('/api/gallery/upload', {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) throw new Error('Upload failed')
      setDone(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-lg bg-white rounded-t-3xl p-5 pb-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-violet-900 text-lg">Share a Moment</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-violet-50 flex items-center justify-center">
            <X size={16} className="text-violet-600" />
          </button>
        </div>

        {done ? (
          <div className="text-center py-8 space-y-3">
            <p className="text-5xl">✅</p>
            <p className="font-bold text-violet-900 text-lg">Photo submitted!</p>
            <p className="text-sm text-gray-500">Mr Reyy will review your photo before it appears in Moments.</p>
            <button
              onClick={onClose}
              className="mt-2 px-6 py-2.5 bg-violet-600 text-white rounded-xl font-semibold text-sm"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Drop zone */}
            <div
              className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center gap-2 cursor-pointer transition-colors ${
                preview ? 'border-violet-400 bg-violet-50' : 'border-violet-200 bg-violet-50/50 hover:bg-violet-50'
              }`}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => inputRef.current?.click()}
            >
              {preview ? (
                <div className="relative w-full aspect-square max-h-52 rounded-xl overflow-hidden">
                  <Image src={preview} alt="Preview" fill className="object-cover" />
                </div>
              ) : (
                <>
                  <Camera size={32} className="text-violet-300" />
                  <p className="text-sm text-violet-600 font-medium">Tap to choose a photo</p>
                  <p className="text-xs text-gray-400">or drag and drop here</p>
                </>
              )}
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) handleFile(f)
                }}
              />
            </div>

            <input
              type="text"
              placeholder="Your name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-violet-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-300"
            />
            <input
              type="text"
              placeholder="Caption (optional)"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full border border-violet-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-300"
            />

            {error && <p className="text-red-500 text-xs">{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={!file || uploading}
              className="w-full py-3.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-colors"
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={16} />
                  Submit Photo
                </>
              )}
            </button>
            <p className="text-xs text-gray-400 text-center">
              Photos are reviewed by Mr Reyy before appearing here.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Moments({ photos }: MomentsProps) {
  const [showUpload, setShowUpload] = useState(false)
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [lightbox, setLightbox] = useState<GalleryPhoto | null>(null)

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  return (
    <section id="moments" className="px-4 py-8 bg-white">
      <div className="flex items-center justify-between mb-5">
        <SectionTitle
          icon="📸"
          title="Moments"
          subtitle="Memories from 6 Amethyst"
        />
        <button
          onClick={() => setShowUpload(true)}
          className="flex items-center gap-1.5 px-3 py-2 bg-violet-100 hover:bg-violet-200 text-violet-700 text-xs font-semibold rounded-xl transition-colors flex-shrink-0"
        >
          <Upload size={13} /> Share
        </button>
      </div>

      {photos.length === 0 ? (
        <div className="text-center py-10 text-violet-300">
          <p className="text-4xl mb-2">📷</p>
          <p className="text-sm">No moments yet. Be the first to share one!</p>
        </div>
      ) : (
        <div className="relative">
          <div className="embla rounded-2xl overflow-hidden shadow-lg shadow-violet-100" ref={emblaRef}>
            <div className="embla__container">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="embla__slide cursor-pointer"
                  onClick={() => setLightbox(photo)}
                >
                  <div className="relative w-full aspect-square">
                    <Image
                      src={photo.image_url}
                      alt={photo.caption || 'Class moment'}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 600px"
                    />
                    {(photo.caption || photo.uploader_name) && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-4 py-3">
                        {photo.caption && (
                          <p className="text-white text-sm font-medium">{photo.caption}</p>
                        )}
                        {photo.uploader_name && (
                          <p className="text-white/70 text-xs">by {photo.uploader_name}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {photos.length > 1 && (
            <>
              <button
                onClick={scrollPrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center text-violet-700 z-10"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={scrollNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center text-violet-700 z-10"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}

          {photos.length > 1 && (
            <div className="flex justify-center gap-2 mt-3">
              {photos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => emblaApi?.scrollTo(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === selectedIndex ? 'w-6 bg-violet-600' : 'w-2 bg-violet-200'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
            <X size={18} className="text-white" />
          </button>
          <div className="relative max-w-sm w-full max-h-[80vh]">
            <Image
              src={lightbox.image_url}
              alt={lightbox.caption || 'Moment'}
              width={600}
              height={600}
              className="object-contain rounded-2xl w-full h-auto max-h-[75vh]"
            />
            {lightbox.caption && (
              <p className="text-white text-sm text-center mt-3">{lightbox.caption}</p>
            )}
          </div>
        </div>
      )}

      {showUpload && <UploadModal onClose={() => setShowUpload(false)} />}
    </section>
  )
}
