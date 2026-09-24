"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Camera, Check, FileUp, RotateCcw, ScanLine, Sparkles, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SmartInvoiceCaptureProps {
  onFiles: (files: FileList) => void
}

export function SmartInvoiceCapture({ onFiles }: SmartInvoiceCaptureProps) {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<"choose" | "camera" | "review">("choose")
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [cameraReady, setCameraReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const stopCamera = useCallback(() => {
    stream?.getTracks().forEach((track) => track.stop())
    setStream(null)
    if (videoRef.current) videoRef.current.srcObject = null
    setCameraReady(false)
  }, [stream])

  const close = useCallback(() => {
    stopCamera()
    if (preview) URL.revokeObjectURL(preview)
    setPreview(null)
    setError(null)
    setMode("choose")
    setOpen(false)
  }, [preview, stopCamera])

  useEffect(() => () => stopCamera(), [stopCamera])

  useEffect(() => {
    if (!videoRef.current || !stream) return
    videoRef.current.srcObject = stream
    videoRef.current.onloadedmetadata = () => {
      videoRef.current?.play().then(() => setCameraReady(true)).catch(() => setError("Could not start the camera preview."))
    }
  }, [stream])

  const startCamera = async () => {
    setError(null)
    setMode("camera")
    try {
      const next = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" }, width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      })
      setStream(next)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Camera access was not available.")
    }
  }

  const capture = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas || !cameraReady || video.videoWidth === 0) return
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    canvas.toBlob((blob) => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      setPreview(url)
      stopCamera()
      setMode("review")
    }, "image/jpeg", 0.92)
  }

  const usePhoto = async () => {
    if (!preview) return
    const response = await fetch(preview)
    const blob = await response.blob()
    const file = new File([blob], `invoice-${Date.now()}.jpg`, { type: "image/jpeg" })
    const dt = new DataTransfer()
    dt.items.add(file)
    onFiles(dt.files)
    close()
  }

  const chooseFiles = (files: FileList | null) => {
    if (!files?.length) return
    onFiles(files)
    close()
  }

  return (
    <>
      <section className="relative overflow-hidden rounded-[30px] border border-slate-200/80 bg-white p-5 shadow-[0_18px_55px_rgba(15,23,42,.07)] sm:p-7">
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-100/60 blur-3xl" />
        <div className="relative">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#0a2463] text-white shadow-lg shadow-blue-900/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[.18em] text-[#3E92CC]">Smart capture</p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">Turn a paper invoice into a digital record.</h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">VATify can read the document, extract the key fields and prepare it for review.</p>
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Button type="button" onClick={() => setOpen(true)} className="h-12 rounded-2xl bg-[#0a2463] shadow-lg transition duration-300 hover:-translate-y-0.5 hover:bg-[#12327d] hover:shadow-xl">
              <Camera className="mr-2 h-4 w-4" /> Capture invoice
            </Button>
            <Button type="button" variant="outline" onClick={() => { setOpen(true); setTimeout(() => fileInputRef.current?.click(), 0) }} className="h-12 rounded-2xl border-slate-200 bg-white transition duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">
              <Upload className="mr-2 h-4 w-4" /> Upload document
            </Button>
          </div>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-500" /> PDF, JPG, PNG</span>
            <span className="inline-flex items-center gap-1.5"><ScanLine className="h-3.5 w-3.5 text-[#3E92CC]" /> AI extraction</span>
            <span className="inline-flex items-center gap-1.5"><FileUp className="h-3.5 w-3.5 text-[#3E92CC]" /> Secure upload</span>
          </div>
        </div>
      </section>

      <input ref={fileInputRef} type="file" accept="image/*,.pdf" multiple className="hidden" onChange={(e) => chooseFiles(e.target.files)} />

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/70 p-0 backdrop-blur-sm sm:items-center sm:p-5" role="dialog" aria-modal="true" aria-label="Add invoice">
          <div className="w-full max-w-lg overflow-hidden rounded-t-[30px] bg-white shadow-2xl sm:rounded-[30px]">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div><p className="text-xs font-semibold uppercase tracking-[.18em] text-[#3E92CC]">VATify capture</p><h3 className="text-lg font-semibold text-slate-950">{mode === "camera" ? "Scan invoice" : mode === "review" ? "Check your photo" : "Add an invoice"}</h3></div>
              <Button type="button" variant="ghost" size="icon" onClick={close} className="rounded-full"><X className="h-5 w-5" /></Button>
            </div>

            {mode === "choose" && (
              <div className="grid gap-3 p-5">
                <button type="button" onClick={startCamera} className="group rounded-[24px] border border-slate-200 bg-slate-50 p-5 text-left transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:bg-blue-50/60 hover:shadow-lg">
                  <div className="flex items-center gap-4"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0a2463] text-white transition group-hover:scale-105"><Camera className="h-5 w-5" /></div><div><p className="font-semibold text-slate-950">Take a photo</p><p className="mt-1 text-sm text-slate-500">Use your phone camera to scan the invoice.</p></div></div>
                </button>
                <button type="button" onClick={() => fileInputRef.current?.click()} className="group rounded-[24px] border border-slate-200 bg-white p-5 text-left transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg">
                  <div className="flex items-center gap-4"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#0a2463] transition group-hover:scale-105"><FileUp className="h-5 w-5" /></div><div><p className="font-semibold text-slate-950">Upload a document</p><p className="mt-1 text-sm text-slate-500">Choose a PDF, JPG or PNG from your device.</p></div></div>
                </button>
              </div>
            )}

            {mode === "camera" && (
              <div className="p-4">
                <div className="relative overflow-hidden rounded-[24px] bg-slate-950">
                  <video ref={videoRef} autoPlay playsInline muted className="aspect-[3/4] w-full object-cover" />
                  <div className="pointer-events-none absolute inset-8 rounded-[22px] border-2 border-white/80 shadow-[0_0_0_999px_rgba(0,0,0,.22)]">
                    <span className="absolute left-0 top-0 h-8 w-8 border-l-4 border-t-4 border-white" /><span className="absolute right-0 top-0 h-8 w-8 border-r-4 border-t-4 border-white" /><span className="absolute bottom-0 left-0 h-8 w-8 border-b-4 border-l-4 border-white" /><span className="absolute bottom-0 right-0 h-8 w-8 border-b-4 border-r-4 border-white" />
                  </div>
                  <div className="absolute left-1/2 top-1/2 h-0.5 w-[70%] -translate-x-1/2 bg-blue-300/80 shadow-[0_0_14px_rgba(147,197,253,.9)] vatify-scan-line" />
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/45 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">Align the invoice inside the frame</div>
                </div>
                {error && <p className="mt-3 rounded-2xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
                <div className="mt-4 flex items-center justify-between">
                  <Button type="button" variant="ghost" onClick={close} className="rounded-2xl">Cancel</Button>
                  <button type="button" onClick={capture} disabled={!cameraReady} className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-white text-[#0a2463] shadow-[0_10px_35px_rgba(10,36,99,.3)] ring-4 ring-[#0a2463]/20 transition duration-300 enabled:hover:scale-110 disabled:opacity-50" aria-label="Capture invoice"><Camera className="h-6 w-6" /></button>
                  <span className="w-16" />
                </div>
              </div>
            )}

            {mode === "review" && preview && (
              <div className="p-5">
                <div className="relative overflow-hidden rounded-[24px] bg-slate-100">
                  <img src={preview} alt="Captured invoice preview" className="max-h-[55vh] w-full object-contain" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/60 to-transparent p-4 pt-16 text-sm font-medium text-white">Looks good? VATify will extract the invoice details next.</div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Button type="button" variant="outline" onClick={() => { setPreview(null); setMode("camera"); startCamera() }} className="h-12 rounded-2xl"><RotateCcw className="mr-2 h-4 w-4" /> Retake</Button>
                  <Button type="button" onClick={usePhoto} className="h-12 rounded-2xl bg-[#0a2463] hover:bg-[#12327d]"><Check className="mr-2 h-4 w-4" /> Use photo</Button>
                </div>
              </div>
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>
        </div>
      )}
    </>
  )
}
