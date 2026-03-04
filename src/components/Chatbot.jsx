// import { useState, useRef, useEffect } from "react";
// import { chatWithTravelBot } from "../services/ollamaService";
// import "./Chatbot.css";

// // ─── Quick suggestion chips shown below input ─────────────────────
// const SUGGESTIONS = [
//   "🌺 Best time to visit Bali?",
//   "🗼 Hidden gems in Tokyo",
//   "💶 Paris on a budget",
//   "🦁 Safari options in Kenya",
//   "🎒 Solo travel tips for Southeast Asia",
//   "🛂 Visa-free countries for Indians",
//   "🏔️ Best treks in Nepal",
//   "🍜 Street food capitals of the world",
// ];

// // ─── Initial greeting message ─────────────────────────────────────
// const INITIAL_MESSAGE = {
//   role: "assistant",
//   content: `Namaste, fellow explorer! 🌍

// I'm your personal AI travel concierge — think of me as a friend who's been everywhere and remembers everything.

// Ask me **anything** about travel:
// - Best destinations for your interests & budget
// - Visa rules, entry requirements, safety tips
// - Hidden local restaurants & experiences
// - Packing lists, weather windows, flight strategies
// - Cultural etiquette & must-know phrases

// **Where are we going today?**`,
//   timestamp: new Date(),
// };

// // ─── Markdown-lite renderer ────────────────────────────────────────
// function renderContent(text) {
//   // Bold: **text**
//   text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
//   // Italic: *text*
//   text = text.replace(/\*(.*?)\*/g, "<em>$1</em>");
//   // Bullet lines
//   text = text.replace(/^[-•] (.+)$/gm, "<li>$1</li>");
//   // Wrap consecutive <li> in <ul>
//   text = text.replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`);
//   // Line breaks
//   text = text.replace(/\n/g, "<br />");
//   return text;
// }

// export default function Chatbot() {
//   const [messages, setMessages] = useState([INITIAL_MESSAGE]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const bottomRef = useRef(null);
//   const inputRef = useRef(null);

//   // Auto-scroll to latest message
//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, loading]);

//   // Send a message
//   const sendMessage = async (text) => {
//     const userText = (text || input).trim();
//     if (!userText || loading) return;

//     setInput("");
//     setError(null);

//     const userMsg = { role: "user", content: userText, timestamp: new Date() };
//     const updatedMessages = [...messages, userMsg];
//     setMessages(updatedMessages);
//     setLoading(true);

//     try {
//       // Build conversation history for the API (exclude initial greeting)
//       const history = updatedMessages
//         .filter((m) => m.role !== "system")
//         .map((m) => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content }));

//       const reply = await chatWithTravelBot(history);

//       setMessages((prev) => [
//         ...prev,
//         { role: "assistant", content: reply, timestamp: new Date() },
//       ]);
//     } catch (err) {
//       console.error("Chat error:", err);
//       setError("Couldn't reach the AI. Check your Ollama connection and API key.");
//       setMessages((prev) => [
//         ...prev,
//         {
//           role: "assistant",
//           content: "I'm having trouble connecting right now. Please check your Ollama setup and try again. 🔌",
//           timestamp: new Date(),
//           isError: true,
//         },
//       ]);
//     } finally {
//       setLoading(false);
//       inputRef.current?.focus();
//     }
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   };

//   const clearChat = () => {
//     setMessages([INITIAL_MESSAGE]);
//     setError(null);
//   };

//   const formatTime = (date) =>
//     date?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) || "";

//   return (
//     <div className="chat-page">
//       {/* ── Hero ── */}
//       <div className="chat-hero">
//         <p className="hero-eyebrow">AI Travel Concierge</p>
//         <h1 className="hero-title" style={{ fontSize: "clamp(38px, 6vw, 70px)" }}>
//           Ask Me <em>Anything</em>
//           <br />
//           About Travel
//         </h1>
//         <p className="hero-sub" style={{ maxWidth: 480 }}>
//           Real-time answers powered by AI. From hidden beaches to visa rules — your
//           personal expert is online 24/7.
//         </p>
//       </div>

//       {/* ── Chat Container ── */}
//       <div className="chat-outer container">
//         <div className="chat-window card">

//           {/* Header */}
//           <div className="chat-header">
//             <div className="chat-header-left">
//               <div className="avatar-ai">V</div>
//               <div>
//                 <div className="chat-header-name">Voyage Concierge</div>
//                 <div className="chat-header-status">
//                   <span className="ai-dot" style={{ width: 7, height: 7 }} />
//                   Online · Powered by Ollama
//                 </div>
//               </div>
//             </div>
//             <button className="btn-ghost" onClick={clearChat} title="Clear conversation">
//               ↺ New Chat
//             </button>
//           </div>

//           {/* Messages */}
//           <div className="chat-messages">
//             {messages.map((msg, i) => (
//               <div
//                 key={i}
//                 className={`message-row ${msg.role === "user" ? "user" : "ai"} fade-up`}
//                 style={{ animationDelay: `${i * 0.03}s` }}
//               >
//                 {msg.role === "assistant" && (
//                   <div className="avatar-ai msg-avatar">V</div>
//                 )}

//                 <div className={`bubble ${msg.role === "user" ? "bubble-user" : "bubble-ai"} ${msg.isError ? "bubble-error" : ""}`}>
//                   <div
//                     className="bubble-text"
//                     dangerouslySetInnerHTML={{ __html: renderContent(msg.content) }}
//                   />
//                   <div className="bubble-time">{formatTime(msg.timestamp)}</div>
//                 </div>

//                 {msg.role === "user" && (
//                   <div className="avatar-user msg-avatar">U</div>
//                 )}
//               </div>
//             ))}

//             {/* Typing indicator */}
//             {loading && (
//               <div className="message-row ai fade-up">
//                 <div className="avatar-ai msg-avatar">V</div>
//                 <div className="bubble bubble-ai">
//                   <div className="typing-dots">
//                     <span /><span /><span />
//                   </div>
//                 </div>
//               </div>
//             )}
//             <div ref={bottomRef} />
//           </div>

//           {/* Error */}
//           {error && (
//             <div className="error-banner" style={{ margin: "0 16px 8px" }}>
//               ⚠ {error}
//             </div>
//           )}

//           {/* Suggestions */}
//           <div className="suggestions-row">
//             {SUGGESTIONS.map((s) => (
//               <button
//                 key={s}
//                 className="tag"
//                 onClick={() => sendMessage(s)}
//                 disabled={loading}
//               >
//                 {s}
//               </button>
//             ))}
//           </div>

//           {/* Input */}
//           <div className="chat-input-bar">
//             <textarea
//               ref={inputRef}
//               className="form-textarea chat-input"
//               placeholder="Ask about any destination, visa, hotel, food, culture..."
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={handleKeyDown}
//               rows={1}
//               disabled={loading}
//             />
//             <button
//               className="btn-gold send-btn"
//               onClick={() => sendMessage()}
//               disabled={loading || !input.trim()}
//             >
//               {loading ? "..." : "Send ➤"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useRef, useEffect } from "react";
import { chatWithTravelBot } from "../services/ollamaService";
import "./Chatbot.css";

// ─── Suggestion chips ─────────────────────────────────────────────
const SUGGESTIONS = [
  { icon: "🌺", text: "Best time to visit Bali?" },
  { icon: "🗼", text: "Hidden gems in Tokyo" },
  { icon: "💶", text: "Paris on a tight budget" },
  { icon: "🦁", text: "Safari options in Kenya" },
  { icon: "🎒", text: "Solo travel tips for Southeast Asia" },
  { icon: "🛂", text: "Visa-free countries for Indians" },
  { icon: "🏔️", text: "Best treks in Nepal" },
  { icon: "🍜", text: "Street food capitals of the world" },
];

const GREETING = {
  role: "assistant",
  content: `# Namaste, fellow explorer! 🌍

I'm your personal **AI travel concierge** — think of me as a friend who's travelled everywhere and remembers everything.

Ask me anything:

- **Destinations** — best places, hidden gems, seasonal picks
- **Visas & Entry** — requirements, processing times, costs
- **Hotels & Stays** — where to sleep at every budget
- **Food & Culture** — local dishes, etiquette, must-try experiences
- **Practical Tips** — packing lists, safety, health, transport

**Where shall we go today?**`,
  timestamp: new Date(),
};

// ─── Markdown → styled HTML ───────────────────────────────────────
function renderMarkdown(raw) {
  if (!raw) return "";

  let text = raw
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Headings
  text = text.replace(/^### (.+)$/gm, '<h4 class="cb-h4">$1</h4>');
  text = text.replace(/^## (.+)$/gm,  '<h3 class="cb-h3">$1</h3>');
  text = text.replace(/^# (.+)$/gm,   '<h2 class="cb-h2">$1</h2>');

  // Bold & italic
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong class="cb-bold">$1</strong>');
  text = text.replace(/__(.+?)__/g,     '<strong class="cb-bold">$1</strong>');
  text = text.replace(/\*([^*\n]+?)\*/g,'<em class="cb-em">$1</em>');

  // HR
  text = text.replace(/^---+$/gm, '<hr class="cb-hr" />');

  // Bullet lists
  text = text.replace(/^[-•]\s+(.+)$/gm, '<li class="cb-li">$1</li>');
  text = text.replace(/(<li class="cb-li">[\s\S]*?<\/li>\n?)+/g,
    m => `<ul class="cb-ul">${m}</ul>`);

  // Numbered lists
  text = text.replace(/^\d+\.\s+(.+)$/gm, '<li class="cb-oli">$1</li>');
  text = text.replace(/(<li class="cb-oli">[\s\S]*?<\/li>\n?)+/g,
    m => `<ol class="cb-ol">${m}</ol>`);

  // Highlight box: > blockquote = tip card
  text = text.replace(/^&gt;\s+(.+)$/gm,
    '<div class="cb-tip"><span class="cb-tip-icon">💡</span><span>$1</span></div>');

  // Info badge: `inline code` = location/place name tag
  text = text.replace(/`([^`]+)`/g,
    '<span class="cb-tag">$1</span>');

  // Paragraphs
  const lines = text.split('\n');
  const wrapped = lines.map(line => {
    const t = line.trim();
    if (!t) return '<div class="cb-spacer"></div>';
    if (t.startsWith('<')) return line;
    return `<p class="cb-p">${line}</p>`;
  });

  // Clean up double spacers
  return wrapped.join('\n').replace(/(<div class="cb-spacer"><\/div>\n?){2,}/g,
    '<div class="cb-spacer"></div>');
}

// ─── Message bubble ───────────────────────────────────────────────
function Message({ msg, isLast }) {
  const isAI   = msg.role === "assistant";
  const time   = msg.timestamp?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) || "";

  return (
    <div className={`msg-row ${isAI ? "ai" : "user"} ${isLast ? "last" : ""}`}>
      {isAI && (
        <div className="msg-avatar ai-avatar" aria-label="AI">
          <span>V</span>
        </div>
      )}

      <div className={`msg-bubble ${isAI ? "ai-bubble" : "user-bubble"} ${msg.isError ? "error-bubble" : ""}`}>
        {isAI ? (
          <div
            className="cb-content"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
          />
        ) : (
          <p className="user-text">{msg.content}</p>
        )}
        <div className="msg-time">{time}</div>
      </div>

      {!isAI && (
        <div className="msg-avatar user-avatar" aria-label="You">U</div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────
export default function Chatbot() {
  const [messages, setMessages] = useState([GREETING]);
  const [input,    setInput]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);
  const bottomRef  = useRef(null);
  const inputRef   = useRef(null);
  const [showSugg, setShowSugg] = useState(true);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const userText = (text || input).trim();
    if (!userText || loading) return;
    setInput("");
    setError(null);
    setShowSugg(false);

    const userMsg = { role: "user", content: userText, timestamp: new Date() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setLoading(true);

    try {
      const history = updated.map(m => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      }));
      const reply = await chatWithTravelBot(history);
      setMessages(prev => [...prev, { role: "assistant", content: reply, timestamp: new Date() }]);
    } catch (err) {
      console.error(err);
      setError("Couldn't reach the AI. Check your Ollama connection and API key.");
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "I'm having trouble connecting right now. Please check your Ollama setup and try again. 🔌",
        timestamp: new Date(),
        isError: true,
      }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const clearChat = () => {
    setMessages([GREETING]);
    setError(null);
    setShowSugg(true);
  };

  return (
    <div className="chat-page">
      {/* Hero */}
      <div className="chat-hero">
        <p className="hero-eyebrow">AI Travel Concierge</p>
        <h1 className="hero-title" style={{ fontSize: "clamp(38px, 6vw, 70px)" }}>
          Ask Me <em>Anything</em><br />About Travel
        </h1>
        <p className="hero-sub" style={{ maxWidth: 460 }}>
          Real-time answers from your personal AI travel expert — available 24/7.
        </p>
      </div>

      <div className="chat-outer container">
        <div className="chat-window card">

          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-left">
              <div className="ai-avatar header-avatar"><span>V</span></div>
              <div>
                <div className="chat-header-name">Voyage Concierge</div>
                <div className="chat-header-status">
                  <span className="online-dot" />
                  Online · Powered by Gemini via Ollama
                </div>
              </div>
            </div>
            <button className="btn-ghost" onClick={clearChat}>↺ New Chat</button>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {messages.map((msg, i) => (
              <Message key={i} msg={msg} isLast={i === messages.length - 1} />
            ))}

            {loading && (
              <div className="msg-row ai">
                <div className="msg-avatar ai-avatar"><span>V</span></div>
                <div className="msg-bubble ai-bubble typing-bubble">
                  <div className="typing-dots"><span /><span /><span /></div>
                  <span className="typing-label">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Error */}
          {error && (
            <div className="error-banner" style={{ margin: "0 16px 8px" }}>⚠ {error}</div>
          )}

          {/* Suggestions */}
          {showSugg && (
            <div className="suggestions-area">
              <div className="suggestions-label">✦ Quick questions</div>
              <div className="suggestions-grid">
                {SUGGESTIONS.map(s => (
                  <button
                    key={s.text}
                    className="sugg-chip"
                    onClick={() => sendMessage(s.text)}
                    disabled={loading}
                  >
                    <span className="sugg-icon">{s.icon}</span>
                    <span>{s.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="chat-input-bar">
            {!showSugg && (
              <button className="sugg-toggle" onClick={() => setShowSugg(true)} title="Show suggestions">
                💡
              </button>
            )}
            <textarea
              ref={inputRef}
              className="form-textarea chat-input"
              placeholder="Ask about any destination, visa, hotel, food, culture..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              rows={1}
              disabled={loading}
            />
            <button
              className="btn-gold send-btn"
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
            >
              {loading ? "···" : "Send ➤"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}