import { Bot, SendHorizontal } from "lucide-react";

/**
 * Bottom execution/chat panel for Groq advisor interactions.
 * Props:
 * - selectedStock: current ticker used to scope user prompts.
 * - selectedTimeframe: active timeframe to frame analysis context.
 */
export default function ChatbotWidget({ selectedStock, selectedTimeframe }) {
  return (
    <section className="flex h-full flex-col border-t border-slate-800 bg-[#0c1119]">
      <div className="flex h-10 items-center justify-between border-b border-slate-800 px-3">
        <div className="flex items-center gap-2">
          <Bot className="h-3.5 w-3.5 text-cyan-300" />
          <p className="text-xs font-semibold text-slate-300">Groq AI Advisor</p>
        </div>
        <p className="text-xs text-slate-500">
          Context: {selectedStock} • {selectedTimeframe}
        </p>
      </div>

      <div className="flex-1 p-3">
        <div className="h-full rounded-sm border border-slate-800 bg-slate-900/30 p-3">
          <p className="text-xs text-slate-400">
            Ask about trend strength, risk zones, or sentiment-driven moves.
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Chat history and API response rendering will be wired in Phase 5.
          </p>
        </div>
      </div>

      <div className="border-t border-slate-800 p-2">
        <div className="flex items-center gap-2 rounded-sm border border-slate-700 bg-slate-900/40 px-2 py-1.5">
          <input
            disabled
            value={`Is ${selectedStock} bullish over ${selectedTimeframe}?`}
            readOnly
            className="w-full bg-transparent text-xs text-slate-500 outline-none"
          />
          <button className="text-slate-500 transition hover:text-white">
            <SendHorizontal className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
