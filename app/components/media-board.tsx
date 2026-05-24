"use client";

import { useEffect, useMemo, useState } from "react";

interface MediaBoardProps {
  items: string[];
  className?: string;
  label?: string;
  title?: string;
  description?: string;
}

function isVideo(url: string) {
  return /\.(mp4|webm|ogg)$/i.test(url);
}

export function MediaBoard({
  items,
  className,
  label,
  title,
  description,
}: MediaBoardProps) {
  const mediaItems = useMemo(() => items.filter(Boolean), [items]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (mediaItems.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % mediaItems.length);
    }, 3800);

    return () => window.clearInterval(timer);
  }, [mediaItems.length]);

  return (
    <div className={className ? `media-board ${className}` : "media-board"}>
      <div className="media-board-screen">
        {mediaItems.map((item, index) =>
          isVideo(item) ? (
            <video
              key={item}
              src={item}
              className={index === activeIndex ? "media-board-asset is-active" : "media-board-asset"}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={item}
              src={item}
              alt={title ?? "Storefront media"}
              className={index === activeIndex ? "media-board-asset is-active" : "media-board-asset"}
              loading="lazy"
              decoding="async"
            />
          ),
        )}
        <div className="media-board-overlay" />
        {(label || title || description) ? (
          <div className="media-board-copy">
            {label ? <span className="media-board-label">{label}</span> : null}
            {title ? <strong>{title}</strong> : null}
            {description ? <p>{description}</p> : null}
          </div>
        ) : null}
      </div>
      {mediaItems.length > 1 ? (
        <div className="media-board-dots" aria-label="Media board slides">
          {mediaItems.map((item, index) => (
            <button
              key={`${item}-${index}`}
              type="button"
              className={index === activeIndex ? "media-board-dot is-active" : "media-board-dot"}
              aria-label={`Show media ${index + 1}`}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
