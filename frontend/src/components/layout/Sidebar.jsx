import { Activity } from "lucide-react";

/**
 * Left market watch panel for stock selection.
 * Props:
 * - stocks: list of available ticker symbols.
 * - selectedStock: active ticker from App-level state.
 * - onStockChange: callback to update active ticker in App.
 */
export default function Sidebar({ stocks, selectedStock, onStockChange }) {
  return (
    <aside className="flex h-full flex-col border-r border-slate-800 bg-[#0d121b]">
      <div className="flex h-10 items-center gap-2 border-b border-slate-800 px-3">
        <Activity className="h-3.5 w-3.5 text-slate-400" />
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Watchlist</p>
      </div>

      <div className="flex-1 overflow-hidden py-1">
        {stocks.map((stock) => {
          const isActive = stock === selectedStock;
          return (
            <button
              key={stock}
              onClick={() => onStockChange(stock)}
              className={`flex w-full items-center justify-between px-3 py-2 text-left text-xs transition ${
                isActive
                  ? "border-l-2 border-blue-500 bg-slate-800/30 text-white"
                  : "border-l-2 border-transparent text-slate-400 hover:bg-slate-800/50 hover:text-white"
              }`}
            >
              <span>{stock}</span>
              <span className={`${isActive ? "text-emerald-400" : "text-slate-500"}`}>NSE</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
