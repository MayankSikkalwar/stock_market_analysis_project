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
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    let isActive = true;

    /**
     * Fetches chart candles + analysis in parallel for lower UI wait time.
     * Robust error handling is centralized here so child widgets stay simple
     * and can render pure loading/error/data states from props.
     */
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError("");

      try {
        const historicalUrl = `http://127.0.0.1:8000/api/historical/${selectedStock}?period=${selectedTimeframe}&timeframe=${selectedTimeframe}`;
        const analysisUrl = `http://127.0.0.1:8000/api/analysis/${selectedStock}`;

        const [historicalRes, analysisRes] = await Promise.all([
          fetch(historicalUrl, { signal: controller.signal }),
          fetch(analysisUrl, { signal: controller.signal }),
        ]);

        if (!historicalRes.ok) {
          throw new Error(`Historical API failed (${historicalRes.status})`);
        }
        if (!analysisRes.ok) {
          throw new Error(`Analysis API failed (${analysisRes.status})`);
        }

        const historicalJson = await historicalRes.json();
        const analysisJson = await analysisRes.json();

        if (!isActive) return;
        setHistoricalData(Array.isArray(historicalJson?.candles) ? historicalJson.candles : []);
        setAnalysisData(analysisJson ?? null);
      } catch (fetchErr) {
        if (controller.signal.aborted) return;
        const message =
          fetchErr instanceof Error
            ? fetchErr.message
            : "Unexpected error while loading dashboard data.";
        if (!isActive) return;
        setError(message);
        setHistoricalData([]);
        setAnalysisData(null);
      } finally {
        if (!isActive) return;
        setIsLoading(false);
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
          <div className="min-h-[360px] w-full lg:min-h-0 lg:flex-1">
            <ChartWidget
              selectedStock={selectedStock}
              selectedTimeframe={selectedTimeframe}
              historicalData={historicalData}
              isLoading={isLoading}
              error={error}
            />
          </div>

          <div className="min-h-[220px] w-full lg:h-[220px] lg:min-h-0 lg:shrink-0">
            <ChatbotWidget selectedStock={selectedStock} selectedTimeframe={selectedTimeframe} />
          </div>
        </div>

        <div className="min-h-[360px] w-full border-t border-slate-800 lg:min-h-0 lg:w-80 lg:border-t-0">
          <AITrendWidget
            selectedStock={selectedStock}
            analysisData={analysisData}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </main>
    </div>
  );
}
