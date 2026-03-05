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
    <div className="h-screen w-screen overflow-hidden bg-[#0b0e14] text-slate-300 flex flex-col">
      <Navbar
        selectedTimeframe={selectedTimeframe}
        onTimeframeChange={setSelectedTimeframe}
        timeframes={TIMEFRAMES}
      />

      {/* Terminal layout:
          Full-height content area is segmented into left watchlist, center trading workspace,
          and right AI panel. Borders create clear panel dividers without soft card styling,
          matching professional trading terminal conventions. */}
      <main className="grid min-h-0 flex-1 grid-cols-[220px_1fr_320px] grid-rows-[1fr_220px]">
        <div className="row-span-2 min-h-0">
          <Sidebar stocks={STOCKS} selectedStock={selectedStock} onStockChange={setSelectedStock} />
        </div>

        <div className="min-h-0">
          <ChartWidget selectedStock={selectedStock} selectedTimeframe={selectedTimeframe} />
        </div>

        <div className="row-span-2 min-h-0">
          <AITrendWidget selectedStock={selectedStock} />
        </div>

        <div className="min-h-0">
          <ChatbotWidget selectedStock={selectedStock} selectedTimeframe={selectedTimeframe} />
        </div>
      </main>
    </div>
  );
}
