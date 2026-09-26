"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Camera, X, RotateCcw, Check, AlertCircle, SwitchCamera } from "lucide-react"

interface ImageCaptureProps {
  onCapture: (file: File) => void
  children: React.ReactNode
}

export function ImageCapture({ onCapture, children }: ImageCaptureProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [currentFacingMode, setCurrentFacingMode] = useState<"environment" | "user">("environment")

  const startCamera = useCallback(
    async (newFacingMode?: "environment" | "user") => {
      const facingModeToUse = newFacingMode || currentFacingMode
      setIsLoading(true)
      setCameraError(null)

      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
        setStream(null)
      }

      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: facingModeToUse,
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
        })
        setStream(mediaStream) // Set stream state first
        setCurrentFacingMode(facingModeToUse)
      } catch (error) {
        console.error(`Error accessing ${facingModeToUse} camera:`, error)
        const errorName = error instanceof DOMException ? error.name : ""
        let errorMessage = `Unable to access ${facingModeToUse} camera. `
        if (errorName === "NotAllowedError") {
          errorMessage += "Permission denied. Please allow camera access in your browser settings."
        } else if (errorName === "NotFoundError" || errorName === "OverconstrainedError") {
          errorMessage += `The ${facingModeToUse === "environment" ? "back" : "front"} camera may not be available or supported on this device.`
          if (!newFacingMode) {
            const alternativeMode = facingModeToUse === "environment" ? "user" : "environment"
            console.log(`Attempting to switch to ${alternativeMode} camera.`)
            setCameraError(
              errorMessage + ` Trying the ${alternativeMode === "environment" ? "back" : "front"} camera instead.`,
            )
            // Use a timeout to allow state to update before recursive call
            setTimeout(() => startCamera(alternativeMode), 0)
            return
          }
        } else {
          const message = error instanceof Error ? error.message : String(error)
          errorMessage += "Please check permissions or try a different camera. Error: " + message
        }
        setCameraError(errorMessage)
        setStream(null)
      } finally {
        setIsLoading(false)
      }
    },
    [currentFacingMode, stream], // Removed startCamera from dependencies
  )

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
      videoRef.current.onloadedmetadata = () => {
        if (videoRef.current) {
          videoRef.current.play().catch((err) => {
            console.error("Video play failed:", err)
            setCameraError("Could not start video preview. Please try again.")
          })
        }
      }
    }
  }, [stream])

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }, [stream])

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !videoRef.current.srcObject) {
      setCameraError("Camera stream not available for capture.")
      return
    }
    if (videoRef.current.videoWidth === 0 || videoRef.current.videoHeight === 0) {
      setCameraError("Video dimensions are not available. Cannot capture photo.")
      return
    }

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    if (!context) {
      setCameraError("Canvas context not available.")
      return
    }

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    const dataUrl = canvas.toDataURL("image/jpeg", 0.8)
    setCapturedImage(dataUrl)
  }, [])

  const retakePhoto = useCallback(() => {
    setCapturedImage(null)
    setCameraError(null) // Clear any previous errors
    if (!stream && videoRef.current && !videoRef.current.srcObject) {
      // Check if stream is truly gone
      startCamera(currentFacingMode)
    } else if (videoRef.current && videoRef.current.paused) {
      videoRef.current.play().catch((err) => {
        console.error("Video play failed on retake:", err)
        setCameraError("Could not restart video preview.")
      })
    }
  }, [stream, startCamera, currentFacingMode])

  const confirmCapture = useCallback(() => {
    if (!capturedImage) return

    fetch(capturedImage)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], `captured-${Date.now()}.jpg`, {
          type: "image/jpeg",
        })
        onCapture(file)
        setCapturedImage(null)
        stopCamera()
        setIsOpen(false)
      })
  }, [capturedImage, onCapture, stopCamera])

  const handleOpenChange = useCallback(
    (open: boolean) => {
      setIsOpen(open)
      if (open) {
        startCamera(currentFacingMode)
      } else {
        stopCamera()
        setCapturedImage(null)
        setCameraError(null)
      }
    },
    [startCamera, stopCamera, currentFacingMode],
  )

  const toggleCamera = useCallback(() => {
    const newMode = currentFacingMode === "environment" ? "user" : "environment"
    startCamera(newMode)
  }, [currentFacingMode, startCamera])

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Capture Document</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {isLoading && (
            <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Starting camera...</p>
              </div>
            </div>
          )}

          {stream && !capturedImage && !isLoading && (
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-64 md:h-80 object-cover rounded-lg bg-black"
              />
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
                <Button
                  onClick={capturePhoto}
                  size="lg"
                  className="rounded-full w-16 h-16 bg-white hover:bg-gray-100 text-primary border-4 border-primary"
                  aria-label="Capture photo"
                >
                  <Camera className="h-6 w-6" />
                </Button>
              </div>
              <div className="absolute top-2 right-2 z-10">
                <Button
                  onClick={toggleCamera}
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-black/30 hover:bg-black/50 text-white border-none"
                  aria-label="Switch camera"
                >
                  <SwitchCamera className="h-5 w-5" />
                </Button>
              </div>
            </div>
          )}

          {capturedImage && (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={capturedImage || "/placeholder.svg"}
                  alt="Captured document"
                  className="w-full h-64 md:h-80 object-cover rounded-lg"
                />
              </div>
              <div className="flex justify-center space-x-4">
                <Button onClick={retakePhoto} variant="outline">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Retake
                </Button>
                <Button onClick={confirmCapture} className="bg-primary hover:bg-primary/90">
                  <Check className="mr-2 h-4 w-4" />
                  Use Photo
                </Button>
              </div>
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />

          {!stream && !isLoading && !capturedImage && (
            <div className="flex flex-col items-center justify-center h-64 bg-gray-100 rounded-lg p-4">
              {cameraError ? (
                <div className="text-center">
                  <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
                  <p className="text-sm text-red-600 mb-3">{cameraError}</p>
                  <Button onClick={() => startCamera(currentFacingMode)} className="mt-2">
                    {" "}
                    {/* Ensure currentFacingMode is passed */}
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Try Again
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Camera not started or not found.</p>
                  <Button onClick={() => startCamera(currentFacingMode)} className="mt-2">
                    {" "}
                    {/* Ensure currentFacingMode is passed */}
                    Start Camera
                  </Button>
                </div>
              )}
            </div>
          )}
          {/* Display error even if stream is technically active but preview fails */}
          {cameraError && stream && !capturedImage && !isLoading && (
            <div className="text-center p-4">
              <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <p className="text-sm text-red-600">{cameraError}</p>
            </div>
          )}
        </div>

        <div className="flex justify-end mt-4">
          <Button variant="ghost" onClick={() => setIsOpen(false)}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
