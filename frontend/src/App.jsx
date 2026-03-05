import { useState } from "react";
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
            <ChartWidget selectedStock={selectedStock} selectedTimeframe={selectedTimeframe} />
          </div>

          <div className="min-h-[220px] w-full lg:h-[220px] lg:min-h-0 lg:shrink-0">
            <ChatbotWidget selectedStock={selectedStock} selectedTimeframe={selectedTimeframe} />
          </div>
        </div>

        <div className="min-h-[360px] w-full border-t border-slate-800 lg:min-h-0 lg:w-80 lg:border-t-0">
          <AITrendWidget selectedStock={selectedStock} />
        </div>
      </main>
    </div>
  );
}
