import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { 
  Plus, 
  ArrowUp, 
  PanelLeftClose, 
  PanelLeft, 
  MessageSquare, 
  Globe, 
  Code, 
  Lightbulb, 
  Compass,
  Sparkles,
  Search
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import useChat from "../hook/useChat";
import { setCurrentChatId } from "../chat.slice";

/**
 * ============================================================================
 * ARCHITECTURE LAYER 4: VIEW / UI COMPONENT LAYER (Dashboard.jsx)
 * ============================================================================
 * 
 * 1. WHAT IS THIS COMPONENT?
 *    - The main visual user interface (UI) for the Perplexity-style AI application.
 *    - Renders the sidebar (previous chats library), the hero screen (landing page),
 *      the live conversation stream (User bubble + AI Markdown response), and input controls.
 * 
 * 2. WHERE DOES DATA COME FROM & WHERE IS IT SHOWN?
 *    - `useSelector((state) => state.chat.chats)`:
 *        • Comes from: Redux store (populated initially by `handleGetChats()` via backend MongoDB `GET /api/chats`).
 *        • Used in: Left sidebar map to display the list of all user chat sessions.
 *        • Sample data shape:
 *          {
 *            "66a012bc394a8f10": { _id: "66a012bc394a8f10", title: "What is Node.js?", messages: [...] },
 *            "66a099ef412b1234": { _id: "66a099ef412b1234", title: "React State Management", messages: [...] }
 *          }
 * 
 *    - `useSelector((state) => state.chat.currentChatId)`:
 *        • Comes from: Redux store (tracks currently selected chat ID, e.g. "66a012bc394a8f10" or null).
 *        • Used in: Header title, active sidebar item highlight, and determining active conversation messages.
 * 
 *    - `activeChat.messages` (Derived from active chat in Redux):
 *        • Comes from: Redux store (populated by `handleOpenChats` or `handleSendMessage`).
 *        • Used in: Conversation stream view to render chat history.
 *        • Sample data shape:
 *          [
 *            { _id: "m1", role: "user", content: "Explain closures" },
 *            { _id: "m2", role: "ai", content: "A closure in JavaScript is..." }
 *          ]
 * 
 *    - `useSelector((state) => state.chat.loading)`:
 *        • Comes from: Redux store.
 *        • Used in: Disabling send button and showing animated loading pulse ("Searching and reasoning...").
 * 
 * 3. WHAT HAPPENS ON USER INTERACTIONS?
 *    - Initial Mount: Calls `initializeSocketConnection()` and `handleGetChats()`.
 *    - Click Sidebar Chat: Calls `handleOpenChats(chat._id)` to load message thread via Route Param `/api/chats/:chatId/messages`.
 *    - Submit Question: Calls `handleSendMessage({ message, chatId })` -> optimistic update -> sends to backend API.
 *    - Click "+ New Thread": Dispatches `setCurrentChatId(null)` to show clean Hero landing view.
 */
const Dashboard = () => {
  // Redux dispatcher to dispatch synchronous actions like setCurrentChatId
  const dispatch = useDispatch();
  // Ref attached to bottom of chat feed to auto-scroll smoothly on new messages
  const messagesEndRef = useRef(null);

  // Consume controller methods from custom hook layer (useChat)
  const {
    initializeSocketConnection,
    handleSendMessage,
    handleGetChats,
    handleOpenChats,
  } = useChat();

  // Local UI state for toggling sidebar drawer on mobile/desktop
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  // Local state for the text input box (Hero search or bottom follow-up input)
  const [inputText, setInputText] = useState("");

  // Select global chat state from Redux store
  const chats = useSelector((state) => state.chat.chats);
  const currentChatId = useSelector((state) => state.chat.currentChatId);
  const loading = useSelector((state) => state.chat.loading);

  // DERIVED DATA:
  // Convert dictionary object { id1: {...}, id2: {...} } into an array for rendering in sidebar list
  const chatList = Object.values(chats || {});
  
  // Find currently active chat object using currentChatId key
  const activeChat = currentChatId ? chats[currentChatId] : null;
  // Get messages array of current active chat with fallback to empty array
  const messages = activeChat?.messages || [];

  /**
   * --------------------------------------------------------------------------
   * 1. INITIAL MOUNT EFFECT
   * --------------------------------------------------------------------------
   * Runs once when Dashboard renders:
   * - Connects to WebSocket server.
   * - Fetches user's chat history from backend database to populate sidebar.
   */
  useEffect(() => {
    initializeSocketConnection();
    handleGetChats();
  }, []);

  /**
   * --------------------------------------------------------------------------
   * 2. AUTO-SCROLL EFFECT
   * --------------------------------------------------------------------------
   * Scrolls to bottom of chat container whenever messages change or loading begins/ends.
   */
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  /**
   * --------------------------------------------------------------------------
   * 3. SUBMIT PROMPT HANDLER
   * --------------------------------------------------------------------------
   * Triggers when user clicks Send, presses Enter, or clicks a suggestion chip.
   * 
   * @param {string|undefined} textToSend - Optional string if clicked from suggestion chip
   */
  const handleSubmit = async (textToSend) => {
    const query = typeof textToSend === "string" ? textToSend : inputText;
    const trimmed = query.trim();
    if (!trimmed || loading) return;

    // Clear input box immediately for smooth responsive feel
    setInputText("");

    // Forward message and active chatId to controller hook
    await handleSendMessage({
      message: trimmed,
      chatId: currentChatId,
    });
  };

  /**
   * --------------------------------------------------------------------------
   * 4. KEYBOARD HANDLER
   * --------------------------------------------------------------------------
   * Allows pressing Enter to submit, while Shift+Enter creates a new line.
   */
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  /**
   * --------------------------------------------------------------------------
   * 5. NEW THREAD & OPEN CHAT HANDLERS
   * --------------------------------------------------------------------------
   */
  const handleNewThread = () => {
    dispatch(setCurrentChatId(null));
    setInputText("");
  };

  // Wrapper function to open a chat and pass current chats for message caching check
  const openChat = (chatId) => {
    handleOpenChats(chatId, chats);
  };

  // Predefined suggestion cards for the hero landing screen
  const heroSuggestions = [
    { icon: Globe, label: "Explore trends in artificial intelligence", query: "What are the latest breakthroughs and trends in AI for 2025-2026?" },
    { icon: Code, label: "Write a high-performance React hook", query: "Can you create a custom performant debounce hook in React with TypeScript?" },
    { icon: Lightbulb, label: "Explain quantum computing simply", query: "Explain quantum computing and superposition with simple real-world analogies." },
  ];

  return (
    <div className="flex h-screen w-full bg-[#191a1a] text-[#e8e8e6] antialiased overflow-hidden select-none">
      
      {/* =====================================================================
          SIDEBAR: Displays Chat History & Navigation
          ===================================================================== */}
      {isSidebarOpen && (
        <aside className="w-64 min-w-64 bg-[#141515] border-r border-white/6 flex flex-col justify-between p-3 z-20 transition-all select-text">
          <div className="flex flex-col h-full space-y-3">
            {/* Sidebar Header / Logo */}
            <div className="flex items-center justify-between px-2 pt-1 pb-2">
              <div 
                onClick={handleNewThread}
                className="flex items-center gap-2 font-medium tracking-tight text-white cursor-pointer hover:opacity-80 transition-opacity"
              >
                <div className="w-5 h-5 flex items-center justify-center text-teal-400">
                  <Compass className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold tracking-tight">perplexity</span>
              </div>
              
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-1 rounded-md text-neutral-400 hover:text-white hover:bg-white/6 transition-colors cursor-pointer"
                title="Close sidebar"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            </div>

            {/* "+ New Thread" Button */}
            <button
              onClick={handleNewThread}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-white/4 hover:bg-white/8 text-xs font-medium text-neutral-200 border border-white/6 transition-all cursor-pointer group"
            >
              <span className="flex items-center gap-2">
                <Plus className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-colors" />
                New Thread
              </span>
              <kbd className="text-[10px] text-neutral-500 font-mono">Ctrl K</kbd>
            </button>

            {/* Chat History List (Library) */}
            <div className="flex-1 overflow-y-auto pt-2 space-y-0.5">
              <div className="px-2 pb-1 text-[11px] font-medium text-neutral-500">
                Library
              </div>
              
              {chatList.length === 0 ? (
                <p className="px-2 py-4 text-xs text-neutral-600">No threads yet</p>
              ) : (
                chatList.map((chat) => {
                  const isActive = currentChatId === chat._id;
                  return (
                    <button
                      key={chat._id}
                      onClick={() => openChat(chat._id)}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs text-left truncate transition-colors cursor-pointer ${
                        isActive
                          ? "bg-white/8 text-white font-medium"
                          : "text-neutral-400 hover:bg-white/4 hover:text-neutral-200"
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5 shrink-0 opacity-60" />
                      <span className="truncate">{chat.title || "Untitled"}</span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </aside>
      )}

      {/* =====================================================================
          MAIN CONTENT AREA
          ===================================================================== */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden select-text">
        
        {/* Minimal Nav Header */}
        <header className="h-12 border-b border-white/4 flex items-center justify-between px-4 sm:px-6 bg-[#191a1a]/80 backdrop-blur-sm z-10">
          <div className="flex items-center gap-3">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-1 rounded-md text-neutral-400 hover:text-white hover:bg-white/6 transition-colors cursor-pointer"
                title="Open sidebar"
              >
                <PanelLeft className="w-4 h-4" />
              </button>
            )}

            <span className="text-xs font-medium text-neutral-400 truncate max-w-sm sm:max-w-md">
              {activeChat?.title || "New Thread"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleNewThread}
              className="p-1.5 rounded-md text-neutral-400 hover:text-white hover:bg-white/6 transition-colors cursor-pointer"
              title="New Thread"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Scrollable Center Section */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
          <div className="max-w-2xl mx-auto space-y-8 pb-36 pt-4">
            
            {/* VIEW A: HERO VIEW (Rendered when messages array is empty) */}
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8">
                <div className="space-y-2">
                  <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#f3f3ee]">
                    Where knowledge begins
                  </h1>
                  <p className="text-xs text-neutral-500">
                    Ask anything, analyze data, or generate ideas.
                  </p>
                </div>

                {/* Hero Center Input Box */}
                <div className="w-full max-w-xl">
                  <div className="relative rounded-2xl bg-[#202222] border border-white/8 p-3 shadow-xl focus-within:border-white/18 transition-all">
                    <textarea
                      rows={2}
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask anything..."
                      className="w-full bg-transparent text-sm text-[#f0f0ee] placeholder-neutral-500 focus:outline-none resize-none pr-10"
                    />
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1.5 text-neutral-500 text-[11px]">
                        <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                        <span>Pro Search</span>
                      </div>

                      <button
                        onClick={() => handleSubmit()}
                        disabled={!inputText.trim() || loading}
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                          inputText.trim() && !loading
                            ? "bg-white text-black hover:opacity-90 cursor-pointer shadow-sm"
                            : "bg-white/6 text-neutral-600 cursor-not-allowed"
                        }`}
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Suggestion Chips */}
                  <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                    {heroSuggestions.map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleSubmit(item.query)}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/3 hover:bg-white/6 border border-white/5 text-[11px] text-neutral-400 hover:text-neutral-200 transition-all cursor-pointer"
                        >
                          <Icon className="w-3 h-3 text-neutral-500" />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              /* VIEW B: CONVERSATION STREAM (User message bubble + AI Markdown response) */
              messages.map((msg, index) => {
                const isUser = msg.role === "user";
                return (
                  <div
                    key={msg._id || index}
                    className="w-full space-y-2 animate-fade-in"
                  >
                    {isUser ? (
                      /* USER MESSAGE BUBBLE */
                      <div className="flex justify-end">
                        <div className="max-w-xl rounded-2xl bg-white/6 px-4 py-2.5 text-sm text-[#f0f0ee] leading-relaxed">
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                        </div>
                      </div>
                    ) : (
                      /* AI ANSWER (Rendered with ReactMarkdown custom components) */
                      <div className="flex gap-3 text-sm text-[#d4d4d0] leading-relaxed pt-2">
                        <div className="w-full space-y-2">
                          <div className="flex items-center gap-2 text-xs font-medium text-neutral-400 pb-1">
                            <span className="text-teal-400 flex items-center gap-1">
                              <Compass className="w-3.5 h-3.5" /> Answer
                            </span>
                          </div>
                          
                          <div className="text-sm text-[#d8d8d4] leading-relaxed">
                            <ReactMarkdown
                              components={{
                                h1: ({ node, ...props }) => (
                                  <h1 className="text-lg font-semibold text-white mt-4 mb-2" {...props} />
                                ),
                                h2: ({ node, ...props }) => (
                                  <h2 className="text-base font-semibold text-white mt-3 mb-2" {...props} />
                                ),
                                h3: ({ node, ...props }) => (
                                  <h3 className="text-sm font-semibold text-white mt-2 mb-1" {...props} />
                                ),
                                p: ({ node, ...props }) => (
                                  <p className="leading-relaxed mb-3 text-[#d8d8d4]" {...props} />
                                ),
                                ul: ({ node, ...props }) => (
                                  <ul className="list-disc pl-5 mb-3 space-y-1" {...props} />
                                ),
                                ol: ({ node, ...props }) => (
                                  <ol className="list-decimal pl-5 mb-3 space-y-1" {...props} />
                                ),
                                li: ({ node, ...props }) => (
                                  <li className="leading-relaxed" {...props} />
                                ),
                                blockquote: ({ node, ...props }) => (
                                  <blockquote className="border-l-2 border-teal-400/50 pl-3 my-3 italic text-neutral-400" {...props} />
                                ),
                                pre: ({ node, ...props }) => (
                                  <pre className="bg-[#141515] p-3.5 rounded-xl border border-white/6 overflow-x-auto my-3" {...props} />
                                ),
                                code: ({ node, inline, className, children, ...props }) => {
                                  if (inline) {
                                    return (
                                      <code className="bg-white/6 px-1.5 py-0.5 rounded-md text-neutral-200 font-mono text-[12px]" {...props}>
                                        {children}
                                      </code>
                                    );
                                  }
                                  return (
                                    <code className="text-neutral-200 font-mono text-[12px]" {...props}>
                                      {children}
                                    </code>
                                  );
                                },
                                a: ({ node, ...props }) => (
                                  <a className="text-teal-400 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />
                                ),
                                table: ({ node, ...props }) => (
                                  <div className="overflow-x-auto my-3">
                                    <table className="min-w-full divide-y divide-white/10 text-left text-xs border border-white/6 rounded-lg overflow-hidden" {...props} />
                                  </div>
                                ),
                                th: ({ node, ...props }) => (
                                  <th className="px-3 py-2 bg-white/5 font-semibold text-white" {...props} />
                                ),
                                td: ({ node, ...props }) => (
                                  <td className="px-3 py-2 border-t border-white/6 text-neutral-300" {...props} />
                                ),
                                hr: ({ node, ...props }) => (
                                  <hr className="border-white/10 my-4" {...props} />
                                ),
                              }}
                            >
                              {msg.content}
                            </ReactMarkdown>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}

            {/* Subtle Loading Pulse (Visible when waiting for AI) */}
            {loading && (
              <div className="flex items-center gap-2 text-xs text-neutral-500 animate-pulse pt-2">
                <div className="w-1.5 h-1.5 rounded-full bg-teal-400"></div>
                <span>Searching and reasoning...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* =====================================================================
            BOTTOM INPUT BAR (Visible during ongoing conversation)
            ===================================================================== */}
        {messages.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-[#191a1a] via-[#191a1a]/95 to-transparent pointer-events-none">
            <div className="max-w-2xl mx-auto pointer-events-auto">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
                className="flex items-center gap-2 bg-[#202222] border border-white/8 rounded-2xl px-3.5 py-2 shadow-2xl focus-within:border-white/18 transition-all"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a follow-up..."
                  className="flex-1 bg-transparent text-sm text-[#f0f0ee] placeholder-neutral-500 focus:outline-none"
                />

                <button
                  type="submit"
                  disabled={!inputText.trim() || loading}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                    inputText.trim() && !loading
                      ? "bg-white text-black hover:opacity-90 cursor-pointer shadow-sm"
                      : "bg-white/6 text-neutral-600 cursor-not-allowed"
                  }`}
                  title="Send message"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;