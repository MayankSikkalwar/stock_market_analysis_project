import { Layers, Newspaper, TrendingUp } from "lucide-react";
export default function AITrendWidget({ selectedStock, analysisData, isLoading, error }) {
  const trendInfo = analysisData?.trend_analysis ?? {};
  const levels = Array.isArray(analysisData?.support_resistance_levels) ? analysisData.support_resistance_levels : [];
  const sentiment = analysisData?.news_sentiment ?? {};
  
  const headlines = Array.isArray(sentiment?.headlines) ? sentiment.headlines.slice(0, 4) : [];
  const headlineSentiments = Array.isArray(sentiment?.headline_sentiments) ? sentiment.headline_sentiments : [];

  const formatNumber = (value) => {
    if (typeof value !== "number" || Number.isNaN(value)) return "N/A";
    return value.toFixed(2);
  };

  const trendClass = trendInfo?.trend === "Bullish" ? "text-emerald-400" : trendInfo?.trend === "Bearish" ? "text-rose-400" : "text-slate-400";
  const sentimentClass = sentiment?.label === "Bullish" ? "text-emerald-400" : sentiment?.label === "Bearish" ? "text-rose-400" : "text-slate-400";

  const getHeadlineToneClass = (headline, index) => {
    const itemScore = headlineSentiments[index]?.compound;
    if (typeof itemScore === "number") {
      if (itemScore > 0.05) return "border-emerald-400/70";
      if (itemScore < -0.05) return "border-rose-400/70";
      return "border-slate-600";
    }
    const text = String(headline || "").toLowerCase();
    if (/(gain|surge|rally|beat|upgrade|strong|bullish|profit|high|up)/.test(text)) return "border-emerald-400/70";
    if (/(fall|drop|slump|miss|downgrade|weak|bearish|loss|down|low)/.test(text)) return "border-rose-400/70";
    return "border-slate-600";
  };

  if (isLoading) {
    return (
      <section className="flex h-full flex-col bg-[#0d121b] lg:border-l lg:border-slate-800">
        <div className="flex h-10 items-center border-b border-slate-800 px-3"><p className="text-xs font-semibold text-slate-400">AI Insights</p></div>
        <div className="space-y-3 p-3"><div className="h-14 animate-pulse bg-slate-800/50" /><div className="h-14 animate-pulse bg-slate-800/50" /><div className="h-40 animate-pulse bg-slate-800/50" /></div>
      </section>
    );
  }

  return (
    <section className="flex h-full flex-col bg-[#0d121b] lg:border-l lg:border-slate-800">
      <div className="flex h-10 shrink-0 items-center border-b border-slate-800 px-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">AI Insights</p>
      </div>

      <div className="flex flex-1 min-h-0 flex-col">
        
        {/* COMPACT AI TREND ANALYSIS */}
        <article className="shrink-0 border-b border-slate-800 px-3 py-2.5">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2"><TrendingUp className="h-3.5 w-3.5 text-emerald-400" /><h3 className="text-[13px] font-semibold text-slate-200">AI Trend Analysis</h3></div>
            <span className={`text-[11px] font-medium ${trendClass}`}>{trendInfo?.trend ?? "N/A"}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center justify-between rounded-sm border border-slate-800 bg-slate-900/40 p-1.5"><p className="text-[10px] uppercase text-slate-500">SMA-50</p><p className="text-[11px] text-slate-300">{formatNumber(trendInfo?.sma_50)}</p></div>
            <div className="flex items-center justify-between rounded-sm border border-slate-800 bg-slate-900/40 p-1.5"><p className="text-[10px] uppercase text-slate-500">SMA-200</p><p className="text-[11px] text-slate-300">{formatNumber(trendInfo?.sma_200)}</p></div>
          </div>
          {error && <p className="mt-1 text-[10px] text-rose-400">{error}</p>}
        </article>

        {/* COMPACT SUPPORT & RESISTANCE */}
        <article className="shrink-0 border-b border-slate-800 px-3 py-2.5">
          <div className="mb-2 flex items-center gap-2">
            <Layers className="h-3.5 w-3.5 text-rose-400" />
            <h3 className="text-[13px] font-semibold text-slate-200">Support & Resistance</h3>
          </div>
          <div className="mb-2.5 flex flex-wrap gap-1">
            {levels.length > 0 ? levels.map((level, idx) => (
                <span key={idx} className="rounded-sm border border-slate-700 bg-slate-900/50 px-1.5 py-0.5 text-[11px] font-mono text-slate-300">{Number(level).toFixed(2)}</span>
              )) : <p className="text-[11px] text-slate-500">No levels available.</p>}
          </div>
          <div className="flex items-center justify-between border-t border-slate-800 pt-1.5">
            <p className="text-[11px] text-slate-500">Sentiment: <span className={`font-medium ${sentimentClass}`}>{sentiment?.label ?? "N/A"}</span></p>
            <p className="text-[11px] text-slate-500">Score: <span className="font-mono text-slate-300">{formatNumber(sentiment?.overall_compound_score)}</span></p>
          </div>
        </article>

        {/* SCROLLABLE NEWS INTELLIGENCE */}
        <article className="flex flex-1 min-h-0 flex-col p-3">
          <div className="mb-2 flex shrink-0 items-center justify-between">
            <div className="flex items-center gap-1.5"><Newspaper className="h-3.5 w-3.5 text-slate-400" /><h4 className="text-[13px] font-semibold text-slate-300">News Intelligence</h4></div>
            <span className="rounded-sm border border-slate-700 px-1.5 py-0.5 text-[9px] uppercase tracking-wide text-slate-400">Recent</span>
          </div>

          <div className="custom-scrollbar flex-1 space-y-1.5 overflow-y-auto pr-1">
            {headlines.length > 0 ? headlines.map((headline, index) => (
                <div key={index} className={`border-l-2 bg-slate-900/40 px-2.5 py-2 ${getHeadlineToneClass(headline, index)}`}>
                  <p className="line-clamp-2 text-[11px] leading-relaxed text-slate-300">{headline}</p>
                </div>
              )) : <p className="text-[11px] text-slate-500 italic py-2">No recent headlines found for this ticker.</p>}
          </div>
        </article>

      </div>
    </section>
  );
}