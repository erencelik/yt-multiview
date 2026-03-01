import type { GridLayout } from "../../types";
import "./Toolbar.css";

interface ToolbarProps {
  presets: GridLayout[];
  currentLayout: GridLayout;
  onSelectLayout: (layout: GridLayout) => void;
}

export function Toolbar({ presets, currentLayout, onSelectLayout }: ToolbarProps) {
  return (
    <div className="toolbar" role="toolbar" aria-label="Grid layout selector">
      <span className="toolbar__label">Layout</span>
      {presets.map((preset) => (
        <button
          key={preset.label}
          className={`toolbar__btn${preset.label === currentLayout.label ? " toolbar__btn--active" : ""}`}
          onClick={() => onSelectLayout(preset)}
          aria-pressed={preset.label === currentLayout.label}
          title={`${preset.cols} column${preset.cols > 1 ? "s" : ""} × ${preset.rows} row${preset.rows > 1 ? "s" : ""}`}
        >
          {preset.label}
        </button>
      ))}
    </div>
  );
}
