'use client'

import { useState, useRef, useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'
import { Upload, X, Camera, ChevronLeft, ChevronRight } from 'lucide-react'
import type { GalleryPhoto } from '@/lib/types'
import SectionTitle from './SectionTitle'

function UploadModal({ onClose }: { onClose: () => void }) {
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [name, setName] = useState('')
  const [caption, setCaption] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 })
  const [done, setDone] = useState(false)
  const [doneCount, setDoneCount] = useState(0)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList?.length) return
    const imageFiles = Array.from(fileList).filter((f) => f.type.startsWith('image/'))
    if (imageFiles.length === 0) return
    // Revoke old preview URLs to avoid memory leaks
    previews.forEach((url) => URL.revokeObjectURL(url))
    setFiles(imageFiles)
    setPreviews(imageFiles.map((f) => URL.createObjectURL(f)))
    setError('')
  }

  const removeFile = (index: number) => {
    URL.revokeObjectURL(previews[index])
    setFiles((prev) => prev.filter((_, i) => i !== index))
    setPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (files.length === 0) return
    setUploading(true)
    setError('')
    const total = files.length
    setUploadProgress({ current: 0, total })
    let succeeded = 0
    try {
      for (let i = 0; i < files.length; i++) {
        setUploadProgress({ current: i + 1, total })
        const file = files[i]
        const signRes = await fetch('/api/gallery/sign-upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: file.name }),
        })
        const signData = await signRes.json()
        if (!signRes.ok) throw new Error(signData.error || 'Could not get upload URL')

        const uploadRes = await fetch(signData.signedUrl, {
          method: 'PUT',
          headers: { 'Content-Type': file.type },
          body: file,
        })
        if (!uploadRes.ok) throw new Error('Upload failed')

        const saveRes = await fetch('/api/gallery/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image_url: signData.publicUrl,
            uploader_name: name,
            caption: total === 1 ? caption : '', // only use caption for single photo
          }),
        })
        if (!saveRes.ok) throw new Error('Failed to save photo')
        succeeded++
      }
      setDoneCount(succeeded)
      setDone(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      setUploading(false)
      setUploadProgress({ current: 0, total: 0 })
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-t-3xl p-5 pb-8 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-white text-lg">Share a Moment</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center">
            <X size={15} className="text-zinc-400" />
          </button>
        </div>

        {done ? (
          <div className="text-center py-8 space-y-3">
            <p className="text-5xl">✅</p>
            <p className="font-black text-white text-lg">
              {doneCount === 1 ? 'Photo submitted!' : `${doneCount} photos submitted!`}
            </p>
            <p className="text-sm text-zinc-400">Mr Reyy will review them before they appear in Moments.</p>
            <button onClick={onClose} className="mt-2 px-6 py-2.5 bg-purple-600 text-white rounded-xl font-bold text-sm">Close</button>
          </div>
        ) : (
          <div className="space-y-3">
            <div
              className="border-2 border-dashed border-zinc-700 rounded-2xl p-5 flex flex-col items-center gap-2 cursor-pointer hover:border-purple-600 transition-colors"
              onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files) }}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => inputRef.current?.click()}
            >
              {previews.length > 0 ? (
                <div className="w-full space-y-2">
                  <p className="text-xs text-zinc-500 font-medium text-center">
                    {files.length} photo{files.length !== 1 ? 's' : ''} selected · Tap to add more or change
                  </p>
                  <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                    {previews.map((url, i) => (
                      <div key={url} className="relative aspect-square rounded-lg overflow-hidden border border-zinc-700 group">
                        <Image src={url} alt={`Preview ${i + 1}`} fill className="object-cover" />
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); removeFile(i) }}
                          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} className="text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <Camera size={28} className="text-zinc-600" />
                  <p className="text-sm text-zinc-300 font-semibold">Tap to choose one or more photos</p>
                  <p className="text-xs text-zinc-600">or drag and drop here</p>
                </>
              )}
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => { handleFiles(e.target.files); e.target.value = '' }}
              />
            </div>

            <input
              type="text"
              placeholder="Your name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-purple-500 transition-colors"
            />
            <input
              type="text"
              placeholder={files.length <= 1 ? 'Caption (optional)' : 'Caption (optional) — for single photo only'}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-purple-500 transition-colors"
            />

            {error && <p className="text-red-400 text-xs font-medium">{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={files.length === 0 || uploading}
              className="w-full py-3.5 disabled:opacity-50 text-white font-black rounded-2xl flex items-center justify-center gap-2 transition-all"
              style={{ background: 'linear-gradient(135deg, #A855F7, #6366F1)' }}
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Uploading {uploadProgress.current} of {uploadProgress.total}…
                </>
              ) : (
                <>
                  <Upload size={15} />
                  Submit {files.length === 0 ? 'Photo' : `${files.length} Photo${files.length !== 1 ? 's' : ''}`}
                </>
              )}
            </button>
            <p className="text-xs text-zinc-600 text-center">Photos are reviewed by Mr Reyy before appearing here.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Moments({ photos }: { photos: GalleryPhoto[] }) {
  const [showUpload, setShowUpload] = useState(false)
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [lightbox, setLightbox] = useState<GalleryPhoto | null>(null)

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  return (
    <section id="moments" className="px-4 py-8 border-b border-zinc-800/60">
      <div className="flex items-center justify-between mb-5">
        <SectionTitle icon="📸" title="Moments" subtitle="Memories from 6 Amethyst" />
        <button onClick={() => setShowUpload(true)}
          className="flex items-center gap-1.5 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-bold rounded-xl transition-colors flex-shrink-0">
          <Upload size={12} /> Share
        </button>
      </div>

      {photos.length === 0 ? (
        <div className="text-center py-10 text-zinc-600">
          <p className="text-4xl mb-2">📷</p>
          <p className="text-sm font-medium">No moments yet. Be the first to share one!</p>
        </div>
      ) : (
        <div className="relative">
          <div className="embla rounded-2xl overflow-hidden border border-zinc-800" ref={emblaRef}>
            <div className="embla__container">
              {photos.map((photo) => (
                <div key={photo.id} className="embla__slide cursor-pointer" onClick={() => setLightbox(photo)}>
                  <div className="relative w-full aspect-square">
                    <Image src={photo.image_url} alt={photo.caption || 'Class moment'} fill className="object-cover" sizes="(max-width: 768px) 100vw, 600px" />
                    {(photo.caption || photo.uploader_name) && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-4 py-3">
                        {photo.caption && <p className="text-white text-sm font-semibold">{photo.caption}</p>}
                        {photo.uploader_name && <p className="text-zinc-400 text-xs">by {photo.uploader_name}</p>}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {photos.length > 1 && (
            <>
              <button onClick={scrollPrev} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-zinc-900/90 border border-zinc-700 flex items-center justify-center text-white z-10">
                <ChevronLeft size={16} />
              </button>
              <button onClick={scrollNext} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-zinc-900/90 border border-zinc-700 flex items-center justify-center text-white z-10">
                <ChevronRight size={16} />
              </button>
              <div className="flex justify-center gap-2 mt-3">
                {photos.map((_, i) => (
                  <button key={i} onClick={() => emblaApi?.scrollTo(i)}
                    className={`h-1.5 rounded-full transition-all ${i === selectedIndex ? 'w-6 bg-purple-500' : 'w-1.5 bg-zinc-700'}`} />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center">
            <X size={16} className="text-white" />
          </button>
          <div className="relative max-w-sm w-full">
            <Image src={lightbox.image_url} alt={lightbox.caption || 'Moment'} width={600} height={600} className="object-contain rounded-2xl w-full h-auto max-h-[75vh]" />
            {lightbox.caption && <p className="text-zinc-300 text-sm text-center mt-3">{lightbox.caption}</p>}
          </div>
        </div>
      )}

      {showUpload && <UploadModal onClose={() => setShowUpload(false)} />}
    </section>
  )
}
