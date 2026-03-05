import { CandlestickChart } from "lucide-react";

/**
 * Top command bar for branding and timeframe control.
 * Props:
 * - selectedTimeframe: currently active timeframe string.
 * - onTimeframeChange: callback used to update timeframe in App-level state.
 * - timeframes: available timeframe options rendered as compact buttons.
 */
export default function Navbar({ selectedTimeframe, onTimeframeChange, timeframes }) {
  return (
    <header className="flex h-12 items-center justify-between border-b border-slate-800 bg-[#0f131c] px-4">
      <div className="flex items-center gap-2">
        <CandlestickChart className="h-4 w-4 text-emerald-400" />
        <span className="text-sm font-semibold tracking-wide text-slate-100">FinVise AI</span>
        <span className="text-xs text-slate-500">Advanced Terminal</span>
      </div>

      <div className="flex items-center gap-1 rounded-sm border border-slate-800 bg-slate-900/60 p-1">
        {timeframes.map((tf) => (
          <button
            key={tf}
            onClick={() => onTimeframeChange(tf)}
            className={`px-2 py-1 text-xs transition ${
              selectedTimeframe === tf
                ? "bg-blue-500/20 text-blue-300"
                : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
            }`}
          >
            {tf}
          </button>
        ))}
      </div>
    </header>
  );
}
