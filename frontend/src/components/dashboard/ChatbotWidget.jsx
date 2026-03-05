import { Bot, SendHorizontal } from "lucide-react";
import { useState } from "react";

/**
 * Bottom execution/chat panel for Groq advisor interactions.
 * Props:
 * - selectedStock: current ticker used to scope user prompts.
 * - selectedTimeframe: active timeframe to frame analysis context.
 */
export default function ChatbotWidget({ selectedStock, selectedTimeframe }) {
  const [inputText, setInputText] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  /**
   * Sends user message to backend chat endpoint and appends responses
   * into local chat history for a conversational terminal-style UI.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    const question = inputText.trim();
    if (!question || isTyping) return;

    setChatHistory((prev) => [...prev, { role: "user", text: question }]);
    setInputText("");
    setIsTyping(true);

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/chat/${selectedStock}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        throw new Error(`Chat API failed (${response.status})`);
      }

      const data = await response.json();
      const answer = typeof data?.answer === "string" ? data.answer.trim() : "";
      setChatHistory((prev) => [
        ...prev,
        {
          role: "ai",
          text: answer || "The assistant returned an empty response.",
        },
      ]);
    } catch (chatErr) {
      const errorMessage =
        chatErr instanceof Error ? chatErr.message : "Unexpected chatbot request failure.";
      setChatHistory((prev) => [
        ...prev,
        {
          role: "ai",
          text: `Request failed: ${errorMessage}`,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

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
        <div className="h-full overflow-y-auto rounded-sm border border-slate-800 bg-slate-900/30 p-3">
          {chatHistory.length === 0 && (
            <p className="text-xs text-slate-500">
              Ask about trend strength, risk zones, or sentiment-driven moves.
            </p>
          )}

          <div className="space-y-2">
            {chatHistory.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`max-w-[90%] rounded-sm px-2 py-1.5 text-xs ${
                  message.role === "user"
                    ? "ml-auto border border-blue-500/40 bg-blue-500/10 text-slate-200"
                    : "border border-slate-700 bg-slate-800/50 text-slate-300"
                }`}
              >
                {message.text}
              </div>
            ))}

            {isTyping && <p className="text-xs text-emerald-400">AI is typing...</p>}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 p-2">
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 rounded-sm border border-slate-700 bg-slate-900/40 px-2 py-1.5"
        >
          <input
            value={inputText}
            onChange={(event) => setInputText(event.target.value)}
            placeholder={`Is ${selectedStock} bullish over ${selectedTimeframe}?`}
            className="w-full bg-transparent text-xs text-slate-300 outline-none placeholder:text-slate-500"
          />
          <button
            type="submit"
            disabled={isTyping || !inputText.trim()}
            className="text-slate-500 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <SendHorizontal className="h-3.5 w-3.5" />
          </button>
        </form>
      </div>
    </section>
  );
}
