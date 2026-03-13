import { useRef, useState, useCallback } from "react";
import type { KeyboardEvent } from "react";
import type { Cell } from "../../types";
import { extractVideoId, buildEmbedUrl } from "../../utils/youtube";
import "./VideoCell.css";

interface VideoCellProps {
  cell: Cell;
  onSetVideoId: (cellId: string, videoId: string | null) => void;
  onClearCell: (cellId: string) => void;
}

const YOUTUBE_LIVE_FILTER = "EgJAAQ%3D%3D";

function looksLikeUrl(input: string): boolean {
  const s = input.trim().toLowerCase();
  return (
    s.startsWith("http://") ||
    s.startsWith("https://") ||
    s.includes("youtube.com") ||
    s.includes("youtu.be") ||
    /^[a-zA-Z0-9_-]{11}$/.test(input.trim())
  );
}

function openYouTubeSearch(query: string, onClose: () => void) {
  const params = new URLSearchParams({
    search_query: query,
    sp: YOUTUBE_LIVE_FILTER,
  });
  const popup = window.open(
    `https://www.youtube.com/results?${params.toString()}`,
    "yt-browse",
    "width=1100,height=700,scrollbars=yes,resizable=yes"
  );
  if (popup) {
    const timer = setInterval(() => {
      if (popup.closed) {
        clearInterval(timer);
        onClose();
      }
    }, 300);
  }
}

export function VideoCell({ cell, onSetVideoId, onClearCell }: VideoCellProps) {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState(false);
  const [hint, setHint] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(() => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    // If it looks like a URL or video ID, try to load it directly
    if (looksLikeUrl(trimmed)) {
      const videoId = extractVideoId(trimmed);
      if (videoId) {
        setError(false);
        setHint(false);
        setInputValue("");
        onSetVideoId(cell.id, videoId);
      } else {
        setError(true);
      }
      return;
    }

    // Otherwise treat as a search query
    setError(false);
    setHint(true);
    openYouTubeSearch(trimmed, () => {
      // When popup closes, clear search and focus input for pasting
      setInputValue("");
      setHint(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    });
  }, [inputValue, cell.id, onSetVideoId]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") handleSubmit();
      if (e.key === "Escape") {
        setInputValue("");
        setError(false);
        setHint(false);
      }
    },
    [handleSubmit]
  );

  const handleClear = useCallback(() => {
    onClearCell(cell.id);
  }, [cell.id, onClearCell]);

  if (cell.videoId !== null) {
    return (
      <div className="video-cell video-cell--filled">
        <iframe
          className="video-cell__iframe"
          src={buildEmbedUrl(cell.videoId)}
          title={`YouTube video ${cell.videoId}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
        <button
          className="video-cell__clear-btn"
          onClick={handleClear}
          aria-label="Remove video"
          title="Remove video"
        >
          &#x2715;
        </button>
      </div>
    );
  }

  return (
    <div
      className="video-cell video-cell--empty"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="video-cell__input-group">
        <input
          ref={inputRef}
          className={`video-cell__input${error ? " video-cell__input--error" : ""}`}
          type="text"
          placeholder="Paste URL or search livestreams..."
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setError(false);
          }}
          onKeyDown={handleKeyDown}
          onClick={(e) => e.stopPropagation()}
        />
        <button className="video-cell__submit-btn" onClick={handleSubmit}>
          Go
        </button>
      </div>
      {error && (
        <span className="video-cell__error-msg">Invalid YouTube URL</span>
      )}
      {hint && (
        <span className="video-cell__hint">
          Copy a stream URL from the popup, then paste it here
        </span>
      )}
    </div>
  );
}
