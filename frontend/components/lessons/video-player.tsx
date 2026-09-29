"use client";

import { useMemo } from "react";

interface VideoPlayerProps {
  /** YouTube embed URL, e.g. https://www.youtube.com/embed/VIDEO_ID */
  videoUrl: string;
  /** Optional start offset in seconds applied as ?start=N */
  videoStartTimestamp?: number | null;
  /** Optional title shown as an overlay on the player */
  title?: string;
}

/**
 * Builds the embed URL with the start timestamp applied as a `start` query
 * parameter, preserving any existing query string on the provided URL.
 */
function buildEmbedUrl(videoUrl: string, startTimestamp?: number | null): string {
  if (!videoUrl) return videoUrl;

  const start = startTimestamp && startTimestamp > 0 ? Math.floor(startTimestamp) : null;
  if (start === null) return videoUrl;

  try {
    const url = new URL(videoUrl);
    url.searchParams.set("start", String(start));
    return url.toString();
  } catch {
    // Fall back to naive concatenation if the URL cannot be parsed.
    const separator = videoUrl.includes("?") ? "&" : "?";
    return `${videoUrl}${separator}start=${start}`;
  }
}

export function VideoPlayer({ videoUrl, videoStartTimestamp, title }: VideoPlayerProps) {
  const embedUrl = useMemo(
    () => buildEmbedUrl(videoUrl, videoStartTimestamp),
    [videoUrl, videoStartTimestamp]
  );

  if (!videoUrl) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 text-sm text-gray-500">
        No video available for this lesson.
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-black shadow-sm">
      <div className="relative aspect-video w-full">
        <iframe
          src={embedUrl}
          title={title || "Lesson video"}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
      {title ? (
        <div className="pointer-events-none absolute left-0 top-0 bg-gradient-to-b from-black/70 to-transparent px-4 py-3">
          <p className="text-sm font-medium text-white drop-shadow">{title}</p>
        </div>
      ) : null}
    </div>
  );
}

export default VideoPlayer;
