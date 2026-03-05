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
    <aside className="flex h-full w-full flex-col bg-[#0d121b] lg:border-r lg:border-slate-800">
      <div className="hidden h-10 items-center gap-2 border-b border-slate-800 px-3 lg:flex">
        <Activity className="h-3.5 w-3.5 text-slate-400" />
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Watchlist</p>
      </div>

      <div className="flex gap-2 overflow-x-auto px-2 py-2 lg:flex-1 lg:flex-col lg:gap-0 lg:overflow-hidden lg:px-0 lg:py-1">
        {stocks.map((stock) => {
          const isActive = stock === selectedStock;
          return (
            <button
              key={stock}
              onClick={() => onStockChange(stock)}
              className={`shrink-0 rounded-sm border border-slate-700 px-3 py-2 text-left text-xs transition lg:flex lg:w-full lg:items-center lg:justify-between lg:rounded-none lg:border-0 ${
                isActive
                  ? "bg-slate-800/40 text-white lg:border-l-2 lg:border-blue-500 lg:bg-slate-800/30"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-white lg:border-l-2 lg:border-transparent"
              }`}
            >
              <span>{stock}</span>
              <span className={`ml-2 hidden lg:inline ${isActive ? "text-emerald-400" : "text-slate-500"}`}>
                NSE
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
