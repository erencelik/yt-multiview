import { useState, useCallback } from "react";
import type { Cell, GridLayout, GridState, GridActions } from "../types";
import { DEFAULT_LAYOUT } from "../types";

function makeCell(): Cell {
  return { id: crypto.randomUUID(), videoId: null };
}

function makeCells(count: number): Cell[] {
  return Array.from({ length: count }, makeCell);
}

export function useGridState(): GridState & GridActions {
  const [layout, setLayoutState] = useState<GridLayout>(DEFAULT_LAYOUT);
  const [cells, setCells] = useState<Cell[]>(() =>
    makeCells(DEFAULT_LAYOUT.cols * DEFAULT_LAYOUT.rows)
  );

  const setLayout = useCallback((newLayout: GridLayout) => {
    const newCount = newLayout.cols * newLayout.rows;
    setCells((prev) => {
      if (prev.length === newCount) return prev;
      if (prev.length > newCount) return prev.slice(0, newCount);
      return [...prev, ...makeCells(newCount - prev.length)];
    });
    setLayoutState(newLayout);
  }, []);

  const setVideoId = useCallback((cellId: string, videoId: string | null) => {
    setCells((prev) =>
      prev.map((cell) => (cell.id === cellId ? { ...cell, videoId } : cell))
    );
  }, []);

  const clearCell = useCallback(
    (cellId: string) => setVideoId(cellId, null),
    [setVideoId]
  );

  return { layout, cells, setLayout, setVideoId, clearCell };
}
