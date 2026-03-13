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

function openYouTubeSearch(query: string) {
  const params = new URLSearchParams({
    search_query: query || "live",
    sp: YOUTUBE_LIVE_FILTER,
  });
  window.open(
    `https://www.youtube.com/results?${params.toString()}`,
    "yt-browse",
    "width=1100,height=700,scrollbars=yes,resizable=yes"
  );
}

export function VideoCell({ cell, onSetVideoId, onClearCell }: VideoCellProps) {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState(false);
  const [mode, setMode] = useState<"url" | "search">("url");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(() => {
    if (mode === "search") {
      openYouTubeSearch(inputValue);
      return;
    }
    const videoId = extractVideoId(inputValue);
    if (videoId) {
      setError(false);
      setInputValue("");
      onSetVideoId(cell.id, videoId);
    } else {
      setError(true);
    }
  }, [inputValue, cell.id, onSetVideoId, mode]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") handleSubmit();
      if (e.key === "Escape") {
        setInputValue("");
        setError(false);
      }
    },
    [handleSubmit]
  );

  const handleClear = useCallback(() => {
    onClearCell(cell.id);
  }, [cell.id, onClearCell]);

  const toggleMode = useCallback(() => {
    setMode((m) => (m === "url" ? "search" : "url"));
    setInputValue("");
    setError(false);
    setTimeout(() => inputRef.current?.focus(), 0);
  }, []);

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
      <div className="video-cell__mode-toggle">
        <button
          className={`video-cell__mode-btn${mode === "url" ? " video-cell__mode-btn--active" : ""}`}
          onClick={(e) => { e.stopPropagation(); if (mode !== "url") toggleMode(); }}
        >
          Paste URL
        </button>
        <button
          className={`video-cell__mode-btn${mode === "search" ? " video-cell__mode-btn--active" : ""}`}
          onClick={(e) => { e.stopPropagation(); if (mode !== "search") toggleMode(); }}
        >
          Search Live
        </button>
      </div>
      <div className="video-cell__input-group">
        <input
          ref={inputRef}
          className={`video-cell__input${error ? " video-cell__input--error" : ""}`}
          type={mode === "url" ? "url" : "text"}
          placeholder={
            mode === "url"
              ? "Paste YouTube URL and press Enter..."
              : "Search YouTube livestreams..."
          }
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setError(false);
          }}
          onKeyDown={handleKeyDown}
          onClick={(e) => e.stopPropagation()}
        />
        <button className="video-cell__submit-btn" onClick={handleSubmit}>
          {mode === "url" ? "Load" : "Search"}
        </button>
      </div>
      {error && (
        <span className="video-cell__error-msg">Invalid YouTube URL</span>
      )}
      {mode === "search" && (
        <span className="video-cell__hint">
          Opens YouTube in a popup — copy the stream URL and paste it back here
        </span>
      )}
    </div>
  );
}
