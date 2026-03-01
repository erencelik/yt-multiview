export interface Cell {
  id: string;
  videoId: string | null;
}

export interface GridLayout {
  label: string;
  cols: number;
  rows: number;
}

export interface GridState {
  layout: GridLayout;
  cells: Cell[];
}

export interface GridActions {
  setLayout: (layout: GridLayout) => void;
  setVideoId: (cellId: string, videoId: string | null) => void;
  clearCell: (cellId: string) => void;
}

export const GRID_PRESETS: GridLayout[] = [
  { label: "1×2", cols: 1, rows: 2 },
  { label: "2×2", cols: 2, rows: 2 },
  { label: "2×3", cols: 2, rows: 3 },
  { label: "3×3", cols: 3, rows: 3 },
];

export const DEFAULT_LAYOUT = GRID_PRESETS[1]; // 2×2
