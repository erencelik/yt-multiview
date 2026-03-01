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

export function VideoCell({ cell, onSetVideoId, onClearCell }: VideoCellProps) {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(() => {
    const videoId = extractVideoId(inputValue);
    if (videoId) {
      setError(false);
      setInputValue("");
      onSetVideoId(cell.id, videoId);
    } else {
      setError(true);
    }
  }, [inputValue, cell.id, onSetVideoId]);

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
          type="url"
          placeholder="Paste YouTube URL and press Enter..."
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setError(false);
          }}
          onKeyDown={handleKeyDown}
          onClick={(e) => e.stopPropagation()}
        />
        <button className="video-cell__submit-btn" onClick={handleSubmit}>
          Load
        </button>
      </div>
      {error && (
        <span className="video-cell__error-msg">Invalid YouTube URL</span>
      )}
    </div>
  );
}
