import { Layers, Newspaper, TrendingUp } from "lucide-react";
export default function AITrendWidget({ selectedStock, analysisData, isLoading, error }) {
  const trendInfo = analysisData?.trend_analysis ?? {};
  const levels = Array.isArray(analysisData?.support_resistance_levels)
    ? analysisData.support_resistance_levels
    : [];
  const sentiment = analysisData?.news_sentiment ?? {};
  
  // Maps exactly 4 headlines to keep the terminal dense
  const headlines = Array.isArray(sentiment?.headlines) ? sentiment.headlines.slice(0, 4) : [];
  const headlineSentiments = Array.isArray(sentiment?.headline_sentiments)
    ? sentiment.headline_sentiments
    : [];

  const formatNumber = (value) => {
    if (typeof value !== "number" || Number.isNaN(value)) return "N/A";
    return value.toFixed(2);
  };

  const trendClass =
    trendInfo?.trend === "Bullish"
      ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
      : trendInfo?.trend === "Bearish"
        ? "text-rose-400 bg-rose-500/10 border-rose-500/20"
        : "text-slate-400 bg-slate-800/50 border-slate-700";

  const sentimentClass =
    sentiment?.label === "Bullish"
      ? "text-emerald-400"
      : sentiment?.label === "Bearish"
        ? "text-rose-400"
        : "text-slate-400";

  // Maps VADER scores or keywords to border colors
  const getHeadlineToneClass = (headline, index) => {
    const itemScore = headlineSentiments[index]?.compound;
    if (typeof itemScore === "number") {
      if (itemScore > 0.05) return "border-emerald-400/70";
      if (itemScore < -0.05) return "border-rose-400/70";
      return "border-slate-600";
    }

    const text = String(headline || "").toLowerCase();
    const bullish = /(gain|surge|rally|beat|upgrade|strong|bullish|profit)/.test(text);
    const bearish = /(fall|drop|slump|miss|downgrade|weak|bearish|loss)/.test(text);
    if (bullish && !bearish) return "border-emerald-400/70";
    if (bearish && !bullish) return "border-rose-400/70";
    return "border-slate-600";
  };

  if (isLoading) {
    return (
      <section className="flex h-full flex-col bg-[#0d121b] lg:border-l lg:border-slate-800">
        <div className="flex h-10 shrink-0 items-center border-b border-slate-800 px-4">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-300">AI Insights</p>
        </div>
        <div className="space-y-4 p-4">
          <div className="h-16 animate-pulse rounded bg-slate-800/50" />
          <div className="h-20 animate-pulse rounded bg-slate-800/50" />
          <div className="h-40 animate-pulse rounded bg-slate-800/50" />
        </div>
      </section>
    );
  }

  return (
    <section className="flex h-full flex-col bg-[#0d121b] lg:border-l lg:border-slate-800">
      <div className="flex h-10 shrink-0 items-center border-b border-slate-800 px-4">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-300">AI Insights</p>
      </div>

      <div className="flex flex-1 min-h-0 flex-col">
        
        {/* 1. AI TREND ANALYSIS */}
        <article className="shrink-0 border-b border-slate-800 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-slate-100">AI Trend Analysis</h3>
            </div>
            <span className={`rounded border px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${trendClass}`}>
              {trendInfo?.trend ?? "N/A"}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col items-center justify-center rounded border border-slate-800 bg-slate-900/50 p-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">SMA-50</p>
              <p className="mt-1 text-sm font-mono font-medium text-slate-200">{formatNumber(trendInfo?.sma_50)}</p>
            </div>
            <div className="flex flex-col items-center justify-center rounded border border-slate-800 bg-slate-900/50 p-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">SMA-200</p>
              <p className="mt-1 text-sm font-mono font-medium text-slate-200">{formatNumber(trendInfo?.sma_200)}</p>
            </div>
          </div>
          {error && <p className="mt-2 text-[11px] text-rose-400 text-center">{error}</p>}
        </article>

        {/* 2. SUPPORT & RESISTANCE + HIGHLIGHTED SENTIMENT */}
        <article className="shrink-0 border-b border-slate-800 p-4">
          <div className="mb-3 flex items-center gap-2">
            <Layers className="h-4 w-4 text-rose-400" />
            <h3 className="text-sm font-bold text-slate-100">Support & Resistance</h3>
          </div>
          <div className="mb-4 flex flex-wrap gap-2">
            {levels.length > 0 ? (
              levels.map((level, idx) => (
                <span
                  key={`${level}-${idx}`}
                  className="rounded border border-slate-700 bg-slate-800/60 px-2 py-1 text-xs font-mono font-medium text-slate-200 shadow-sm"
                >
                  {Number(level).toFixed(2)}
                </span>
              ))
            ) : (
              <p className="text-xs text-slate-500">No levels available.</p>
            )}
          </div>
          
          <div className="flex items-center justify-between rounded-lg border border-slate-700/60 bg-slate-800/40 p-3 shadow-inner">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">NLP Sentiment</p>
              <p className={`mt-0.5 text-sm font-bold uppercase ${sentimentClass}`}>
                {sentiment?.label ?? "Neutral"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">VADER Score</p>
              <p className="mt-0.5 text-sm font-mono font-bold text-slate-200">
                {formatNumber(sentiment?.overall_compound_score)}
              </p>
            </div>
          </div>
        </article>

        {/* 3. SCROLLABLE NEWS INTELLIGENCE */}
        <article className="flex flex-1 min-h-0 flex-col p-4">
          <div className="mb-3 flex shrink-0 items-center justify-between">
            <div className="flex items-center gap-2">
              <Newspaper className="h-4 w-4 text-blue-400" />
              <h4 className="text-sm font-bold text-slate-100">News Intelligence</h4>
            </div>
            <span className="rounded bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-blue-400">
              Live Feed
            </span>
          </div>

          <div className="custom-scrollbar flex-1 space-y-2.5 overflow-y-auto pr-2 pb-2">
            {headlines.length > 0 ? (
              headlines.map((headline, index) => (
                <div
                  key={`${headline}-${index}`}
                  className={`rounded-r-md border-l-2 bg-slate-900/50 p-2.5 transition-all hover:bg-slate-800 hover:shadow-md ${getHeadlineToneClass(
                    headline,
                    index
                  )}`}
                  title={headline}
                >
                  <p className="line-clamp-2 text-xs font-medium leading-relaxed text-slate-300">{headline}</p>
                </div>
              ))
            ) : (
              <div className="flex h-full items-center justify-center rounded-md border border-dashed border-slate-700/50 bg-slate-900/20 p-4">
                <p className="text-center text-xs italic text-slate-500">No recent headlines found.</p>
              </div>
            )}
          </div>
        </article>

      </div>
    </section>
  );
}