import { useEffect, useState } from "react";
import AITrendWidget from "./components/dashboard/AITrendWidget";
import ChartWidget from "./components/dashboard/ChartWidget";
import ChatbotWidget from "./components/dashboard/ChatbotWidget";
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";

const STOCKS = ["RELIANCE.NS", "HDFCBANK.NS", "TCS.NS", "ITC.NS", "SUNPHARMA.NS"];
const TIMEFRAMES = ["1M", "3M", "6M", "1Y"];

export default function App() {
  // App-level state orchestration:
  // `selectedStock` and `selectedTimeframe` live here because both are shared dependencies
  // across Sidebar, Navbar, Chart, AI insights, and Chatbot context. Keeping shared state
  // centralized prevents inconsistent UI state between panels and simplifies data fetching later.
  const [selectedStock, setSelectedStock] = useState("RELIANCE.NS");
  const [selectedTimeframe, setSelectedTimeframe] = useState("6M");
  const [historicalData, setHistoricalData] = useState([]);
  const [analysisData, setAnalysisData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [analysisLoading, setAnalysisLoading] = useState(true);
  const [error, setError] = useState("");
  const [analysisError, setAnalysisError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    let isActive = true;

    /**
     * Decoupled fetch flow:
     * 1) Fetch historical data first and render chart immediately.
     * 2) Fetch analysis data after that without blocking chart paint.
     */
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setAnalysisLoading(true);
      setError("");
      setAnalysisError("");
      setAnalysisData(null);

      try {
        const historicalUrl = `http://127.0.0.1:8000/api/historical/${selectedStock}?period=${selectedTimeframe}&timeframe=${selectedTimeframe}`;
        const historicalRes = await fetch(historicalUrl, { signal: controller.signal });

        if (!historicalRes.ok) {
          throw new Error(`Historical API failed (${historicalRes.status})`);
        }

        const historicalJson = await historicalRes.json();

        if (!isActive) return;
        const normalizedCandles = Array.isArray(historicalJson?.candles)
          ? historicalJson.candles.map((item) => ({
              ...item,
              time: item?.time ?? item?.date ?? item?.Date,
            }))
          : [];
        setHistoricalData(normalizedCandles);
      } catch (fetchErr) {
        if (controller.signal.aborted) return;
        const message =
          fetchErr instanceof Error
            ? fetchErr.message
            : "Unexpected error while loading historical data.";
        if (!isActive) return;
        setError(message);
        setHistoricalData([]);
      } finally {
        if (!isActive) return;
        setIsLoading(false);
      }

      try {
        const analysisUrl = `http://127.0.0.1:8000/api/analysis/${selectedStock}`;
        const analysisRes = await fetch(analysisUrl, { signal: controller.signal });
        if (!analysisRes.ok) {
          throw new Error(`Analysis API failed (${analysisRes.status})`);
        }

        const analysisJson = await analysisRes.json();
        if (!isActive) return;
        setAnalysisData(analysisJson ?? null);
      } catch (fetchErr) {
        if (controller.signal.aborted) return;
        const message =
          fetchErr instanceof Error
            ? fetchErr.message
            : "Unexpected error while loading analysis data.";
        if (!isActive) return;
        setAnalysisError(message);
        setAnalysisData(null);
      } finally {
        if (!isActive) return;
        setAnalysisLoading(false);
      }
    };

    fetchDashboardData();
    return () => {
      isActive = false;
      controller.abort();
    };
  }, [selectedStock, selectedTimeframe]);

  return (
    <div className="h-screen w-screen overflow-y-auto bg-[#0b0e14] text-slate-300 flex flex-col lg:overflow-hidden">
      <Navbar
        selectedTimeframe={selectedTimeframe}
        onTimeframeChange={setSelectedTimeframe}
        timeframes={TIMEFRAMES}
      />

      {/* Responsive terminal layout:
          Mobile: stacked flow with horizontal watchlist and scrollable vertical sections.
          Desktop (lg): returns to locked, edge-to-edge trading terminal with left/center/right panels. */}
      <main className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <div className="w-full border-b border-slate-800 lg:w-56 lg:min-h-0 lg:border-b-0">
          <Sidebar stocks={STOCKS} selectedStock={selectedStock} onStockChange={setSelectedStock} />
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          <div className="w-full min-h-[360px] flex-1 min-h-0">
            <ChartWidget
              selectedStock={selectedStock}
              selectedTimeframe={selectedTimeframe}
              historicalData={historicalData}
              analysisData={analysisData}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </div>

        <div className="min-h-[360px] w-full border-t border-slate-800 lg:min-h-0 lg:w-80 lg:border-t-0">
          <AITrendWidget
            selectedStock={selectedStock}
            analysisData={analysisData}
            isLoading={analysisLoading}
            error={analysisError}
          />
        </div>
      </main>

      <ChatbotWidget selectedStock={selectedStock} selectedTimeframe={selectedTimeframe} />
    </div>
  );
}
