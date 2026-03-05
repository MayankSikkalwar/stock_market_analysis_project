import { BarChart3 } from "lucide-react";
import { CandlestickSeries, createChart } from "lightweight-charts";
import { useEffect, useMemo, useRef } from "react";

/**
 * Central chart workspace.
 * Props:
 * - selectedStock: ticker symbol currently in focus.
 * - selectedTimeframe: timeframe currently selected in navbar.
 * - historicalData: OHLC array from backend.
 * - isLoading: loading flag for UX feedback.
 * - error: optional error message from parent fetch layer.
 */
export default function ChartWidget({
  selectedStock,
  selectedTimeframe,
  historicalData,
  isLoading,
  error,
}) {
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const candleSeriesRef = useRef(null);

  /**
   * Maps backend candle shape into lightweight-charts expected format:
   * { time: "YYYY-MM-DD", open, high, low, close }.
   * Supports both lowercase and TitleCase keys defensively.
   */
  const candleData = useMemo(() => {
    if (!Array.isArray(historicalData)) return [];
    return historicalData
      .map((item) => ({
        time: item?.date ?? item?.Date,
        open: Number(item?.open ?? item?.Open),
        high: Number(item?.high ?? item?.High),
        low: Number(item?.low ?? item?.Low),
        close: Number(item?.close ?? item?.Close),
      }))
      .filter(
        (candle) =>
          typeof candle.time === "string" &&
          !Number.isNaN(candle.open) &&
          !Number.isNaN(candle.high) &&
          !Number.isNaN(candle.low) &&
          !Number.isNaN(candle.close)
      );
  }, [historicalData]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const chart = createChart(container, {
      width: container.clientWidth,
      height: container.clientHeight,
      layout: {
        background: { type: "solid", color: "transparent" },
        textColor: "#cbd5e1",
      },
      grid: {
        vertLines: { color: "rgba(51, 65, 85, 0.35)" },
        horzLines: { color: "rgba(51, 65, 85, 0.35)" },
      },
      crosshair: {
        vertLine: { color: "rgba(148, 163, 184, 0.5)" },
        horzLine: { color: "rgba(148, 163, 184, 0.5)" },
      },
      rightPriceScale: { borderColor: "rgba(51, 65, 85, 0.6)" },
      timeScale: { borderColor: "rgba(51, 65, 85, 0.6)" },
    });

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#10b981",
      downColor: "#ef4444",
      borderUpColor: "#10b981",
      borderDownColor: "#ef4444",
      wickUpColor: "#10b981",
      wickDownColor: "#ef4444",
    });

    chartRef.current = chart;
    candleSeriesRef.current = candleSeries;

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry || !chartRef.current) return;
      const { width, height } = entry.contentRect;
      chartRef.current.applyOptions({ width, height });
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
      chartRef.current = null;
      candleSeriesRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!candleSeriesRef.current) return;
    candleSeriesRef.current.setData(candleData);
    chartRef.current?.timeScale().fitContent();
  }, [candleData]);

  return (
    <section className="flex h-full min-h-0 flex-col bg-[#0b0f18]">
      <div className="flex h-10 items-center justify-between border-b border-slate-800 px-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-3.5 w-3.5 text-slate-400" />
          <p className="text-xs font-semibold text-slate-300">Candlestick Chart</p>
        </div>
        <p className="text-xs text-slate-500">
          {selectedStock} • {selectedTimeframe}
        </p>
      </div>

      <div className="relative flex-1 min-h-0 p-3">
        <div className="relative h-full min-h-0 rounded-sm border border-slate-700 bg-slate-900/20">
          <div ref={containerRef} className="h-full w-full" />

          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#0b0f18]/70 backdrop-blur-[1px]">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-600 border-t-emerald-400" />
            </div>
          )}

          {!isLoading && error && (
            <div className="absolute inset-0 flex items-center justify-center px-6">
              <p className="text-center text-xs text-rose-400">{error}</p>
            </div>
          )}

          {!isLoading && !error && candleData.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center px-6">
              <p className="text-center text-xs text-slate-500">No candle data available.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
