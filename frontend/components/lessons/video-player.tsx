"use client"

import React from "react"

interface VideoPlayerProps {
  videoUrl: string
  title: string
  videoStartTimestamp?: number
}

function getEmbedUrl(url: string, startTimestamp?: number): string {
  let videoId = ""

  try {
    const parsed = new URL(url)

    if (parsed.hostname === "youtu.be") {
      videoId = parsed.pathname.slice(1)
    } else if (
      parsed.hostname === "www.youtube.com" ||
      parsed.hostname === "youtube.com"
    ) {
      if (parsed.pathname.startsWith("/embed/")) {
        videoId = parsed.pathname.replace("/embed/", "")
      } else if (parsed.pathname === "/watch") {
        videoId = parsed.searchParams.get("v") || ""
      }
    }
  } catch {
    return url
  }

  if (!videoId) return url

  const params = new URLSearchParams()
  if (startTimestamp && startTimestamp > 0) {
    params.set("start", String(startTimestamp))
  }

  const qs = params.toString()
  return `https://www.youtube.com/embed/${videoId}${qs ? `?${qs}` : ""}`
}

export function VideoPlayer({ videoUrl, title, videoStartTimestamp }: VideoPlayerProps) {
  const embedUrl = getEmbedUrl(videoUrl, videoStartTimestamp)

  if (!videoUrl) {
    return (
      <div className="relative w-full aspect-video bg-[#1a1a1a] rounded-xl overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">Video not available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden">
      <iframe
        src={embedUrl}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title={title}
      />
    </div>
  )
}
