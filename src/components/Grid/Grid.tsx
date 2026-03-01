import type { Cell, GridLayout } from "../../types";
import { VideoCell } from "../VideoCell/VideoCell";
import "./Grid.css";

interface GridProps {
  layout: GridLayout;
  cells: Cell[];
  onSetVideoId: (cellId: string, videoId: string | null) => void;
  onClearCell: (cellId: string) => void;
}

export function Grid({ layout, cells, onSetVideoId, onClearCell }: GridProps) {
  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: `repeat(${layout.cols}, 1fr)`,
        gridTemplateRows: `repeat(${layout.rows}, 1fr)`,
      }}
    >
      {cells.map((cell) => (
        <VideoCell
          key={cell.id}
          cell={cell}
          onSetVideoId={onSetVideoId}
          onClearCell={onClearCell}
        />
      ))}
    </div>
  );
}
