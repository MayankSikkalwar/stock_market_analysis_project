import { BarChart3 } from "lucide-react";

/**
 * Central chart workspace.
 * Props:
 * - selectedStock: ticker symbol currently in focus.
 * - selectedTimeframe: timeframe currently selected in navbar.
 */
export default function ChartWidget({ selectedStock, selectedTimeframe }) {
  return (
    <section className="flex h-full flex-col bg-[#0b0f18]">
      <div className="flex h-10 items-center justify-between border-b border-slate-800 px-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-3.5 w-3.5 text-slate-400" />
          <p className="text-xs font-semibold text-slate-300">Candlestick Chart</p>
        </div>
        <p className="text-xs text-slate-500">
          {selectedStock} • {selectedTimeframe}
        </p>
      </div>

      <div className="flex-1 p-3">
        <div className="flex h-full items-center justify-center rounded-sm border border-dashed border-slate-700 bg-slate-900/20">
          <p className="text-xs text-slate-500">
            TradingView-style OHLCV canvas placeholder (Phase 5 integration)
          </p>
        </div>
      </div>
    </section>
  );
}
