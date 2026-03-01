import { useGridState } from "./hooks/useGridState";
import { GRID_PRESETS } from "./types";
import { Grid } from "./components/Grid/Grid";
import { Toolbar } from "./components/Toolbar/Toolbar";
import "./App.css";

export default function App() {
  const { layout, cells, setLayout, setVideoId, clearCell } = useGridState();

  return (
    <div className="app">
      <Grid
        layout={layout}
        cells={cells}
        onSetVideoId={setVideoId}
        onClearCell={clearCell}
      />
      <Toolbar
        presets={GRID_PRESETS}
        currentLayout={layout}
        onSelectLayout={setLayout}
      />
    </div>
  );
}
