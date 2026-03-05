import { Layers, TrendingUp } from "lucide-react";

/**
 * Right-side intelligence panel summarizing ML outputs.
 * Props:
 * - selectedStock: ticker currently selected so placeholders reflect active context.
 * - analysisData: object returned by /api/analysis/{ticker}.
 * - isLoading: loading state from parent fetch layer.
 * - error: optional API error message.
 */
export default function AITrendWidget({ selectedStock, analysisData, isLoading, error }) {
  const trendInfo = analysisData?.trend_analysis ?? {};
  const levels = Array.isArray(analysisData?.support_resistance_levels)
    ? analysisData.support_resistance_levels
    : [];
  const sentiment = analysisData?.news_sentiment ?? {};

  const formatNumber = (value) => {
    if (typeof value !== "number" || Number.isNaN(value)) return "N/A";
    return value.toFixed(2);
  };

  const trendClass =
    trendInfo?.trend === "Bullish"
      ? "text-emerald-400"
      : trendInfo?.trend === "Bearish"
        ? "text-rose-400"
        : "text-slate-400";

  const sentimentClass =
    sentiment?.label === "Bullish"
      ? "text-emerald-400"
      : sentiment?.label === "Bearish"
        ? "text-rose-400"
        : "text-slate-400";

  if (isLoading) {
    return (
      <section className="flex h-full flex-col bg-[#0d121b] lg:border-l lg:border-slate-800">
        <div className="flex h-10 items-center border-b border-slate-800 px-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">AI Insights</p>
        </div>
        <div className="space-y-3 p-3">
          <div className="h-14 animate-pulse rounded-sm bg-slate-800/50" />
          <div className="h-14 animate-pulse rounded-sm bg-slate-800/50" />
          <div className="h-10 animate-pulse rounded-sm bg-slate-800/50" />
        </div>
      </section>
    );
  }

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
            Trend: <span className={`font-medium ${trendClass}`}>{trendInfo?.trend ?? "N/A"}</span>
          </p>
          <p className="text-xs text-slate-500">SMA-50: {formatNumber(trendInfo?.sma_50)}</p>
          <p className="text-xs text-slate-500">SMA-200: {formatNumber(trendInfo?.sma_200)}</p>
          {error && <p className="mt-2 text-xs text-rose-400">{error}</p>}
        </article>

        <article className="p-3">
          <div className="mb-2 flex items-center gap-2">
            <Layers className="h-3.5 w-3.5 text-rose-400" />
            <h3 className="text-xs font-semibold text-slate-200">Support & Resistance</h3>
          </div>
          <div className="mb-2 flex flex-wrap gap-1.5">
            {levels.length > 0 ? (
              levels.map((level, idx) => (
                <span
                  key={`${level}-${idx}`}
                  className="rounded-sm border border-slate-700 bg-slate-900/50 px-2 py-1 text-xs text-slate-300"
                >
                  {Number(level).toFixed(2)}
                </span>
              ))
            ) : (
              <p className="text-xs text-slate-500">No levels available.</p>
            )}
          </div>
          <div className="border-t border-slate-800 pt-2 text-xs text-slate-500">
            <p>
              Sentiment:{" "}
              <span className={`font-medium ${sentimentClass}`}>{sentiment?.label ?? "N/A"}</span>
            </p>
            <p>Score: {formatNumber(sentiment?.overall_compound_score)}</p>
          </div>
        </article>
      </div>
    </section>
  );
}
