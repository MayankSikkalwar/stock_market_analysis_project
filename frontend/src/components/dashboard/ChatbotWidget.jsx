import { Bot, SendHorizontal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

/**
 * Bottom execution/chat panel for Groq advisor interactions.
 * Props:
 * - selectedStock: current ticker used to scope user prompts.
 * - selectedTimeframe: active timeframe to frame analysis context.
 */
export default function ChatbotWidget({ selectedStock, selectedTimeframe }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [chatHistory, isTyping]);

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

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-2xl transition hover:from-blue-500 hover:to-indigo-500"
        aria-label="Open Groq AI Advisor"
      >
        <Bot className="h-6 w-6" />
      </button>
    );
  }

  return (
    <section className="fixed bottom-6 right-6 z-50 flex h-[500px] w-80 max-h-[80vh] flex-col rounded-xl border border-slate-700 bg-slate-900/95 shadow-2xl backdrop-blur-md sm:w-96">
      <div className="flex h-11 shrink-0 items-center justify-between border-b border-slate-800 px-3">
        <div className="flex items-center gap-2">
          <Bot className="h-3.5 w-3.5 text-cyan-300" />
          <p className="text-xs font-semibold text-slate-300">Groq AI Advisor</p>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="rounded-sm px-2 py-1 text-xs text-slate-400 transition hover:bg-slate-800/70 hover:text-white"
        >
          X
        </button>
      </div>

      <div className="px-3 pt-2 text-[11px] text-slate-500">
        Context: {selectedStock} • {selectedTimeframe}
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 p-4 space-y-3">
          {chatHistory.length === 0 && (
            <p className="text-xs text-slate-500">
              Ask about trend strength, risk zones, or sentiment-driven moves.
            </p>
          )}

          {chatHistory.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`max-w-[90%] rounded-sm px-2 py-1.5 text-xs ${
                message.role === "user"
                  ? "ml-auto border border-blue-500/40 bg-blue-500/10 text-slate-200"
                  : "border border-slate-700 bg-slate-800/50 text-slate-300"
              }`}
            >
              {message.role === "ai" ? (
                <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-p:mb-2 prose-strong:text-emerald-400 prose-ul:list-disc prose-ul:ml-4 prose-li:mb-1">
                  <ReactMarkdown>{message.text}</ReactMarkdown>
                </div>
              ) : (
                message.text
              )}
            </div>
          ))}

          {isTyping && <p className="text-xs text-emerald-400">AI is typing...</p>}
          <div ref={endRef} />
      </div>

      <div className="mt-auto shrink-0 border-t border-slate-800 p-3">
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
