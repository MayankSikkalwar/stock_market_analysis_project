import { Layers, TrendingUp } from "lucide-react";

/**
 * Right-side intelligence panel summarizing ML outputs.
 * Props:
 * - selectedStock: ticker currently selected so placeholders reflect active context.
 */
export default function AITrendWidget({ selectedStock }) {
  return (
    <section className="flex h-full flex-col bg-[#0d121b] lg:border-l lg:border-slate-800">
      <div className="flex h-10 items-center border-b border-slate-800 px-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">AI Insights</p>
      </div>

      <div className="grid flex-1 grid-rows-2">
        <article className="border-b border-slate-800 p-3">
          <div className="mb-2 flex items-center gap-2">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
            <h3 className="text-xs font-semibold text-slate-200">AI Trend Analysis</h3>
          </div>
          <p className="text-xs text-slate-400">Symbol: {selectedStock}</p>
          <p className="mt-2 text-xs text-slate-400">
            Trend: <span className="font-medium text-emerald-400">Bullish bias</span>
          </p>
          <p className="text-xs text-slate-500">SMA-50 / SMA-200 values will sync from backend.</p>
        </article>

        <article className="p-3">
          <div className="mb-2 flex items-center gap-2">
            <Layers className="h-3.5 w-3.5 text-rose-400" />
            <h3 className="text-xs font-semibold text-slate-200">Support & Resistance</h3>
          </div>
          <div className="space-y-1 text-xs text-slate-500">
            <p>
              S1: <span className="text-emerald-400">Loading...</span>
            </p>
            <p>
              S2: <span className="text-emerald-400">Loading...</span>
            </p>
            <p>
              R1: <span className="text-rose-400">Loading...</span>
            </p>
            <p>
              R2: <span className="text-rose-400">Loading...</span>
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}
