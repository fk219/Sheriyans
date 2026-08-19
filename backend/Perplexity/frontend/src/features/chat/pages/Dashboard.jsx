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
 * ARCHITECTURE LAYER 4: VIEW / UI COMPONENT (Dashboard.jsx)
 * ============================================================================
 * 
 * WHAT IS THIS COMPONENT?
 * This is the primary user interface of the Perplexity clone.
 * It contains:
 * 1. Left Sidebar: Displays all previous chat conversations and "+ New Thread" button.
 * 2. Hero Section: Clean search bar + suggestion chips (shown when no chat is active / 0 messages).
 * 3. Conversation Feed: Markdown-rendered AI responses and user message bubbles.
 * 4. Fixed Bottom Input Bar: Allows asking follow-up questions in an ongoing conversation.
 * 
 * ----------------------------------------------------------------------------
 * HOW DASHBOARD INTERACTS WITH HOOKS, REDUX, AND API:
 * ----------------------------------------------------------------------------
 * 1. READ DATA (Redux -> Dashboard):
 *    - `useSelector((state) => state.chat.chats)` -> Gets all chat threads.
 *    - `useSelector((state) => state.chat.currentChatId)` -> Gets which chat is active.
 *    - `useSelector((state) => state.chat.loading)` -> Tells UI if AI is currently thinking.
 * 
 * 2. WRITE/TRIGGER ACTIONS (Dashboard -> useChat Hook):
 *    - `useEffect` -> Calls `handleGetChats()` to fetch past chats on mount.
 *    - User clicks sidebar item -> Calls `handleOpenChats(chatId)` to load messages.
 *    - User submits prompt -> Calls `handleSendMessage({ message, chatId })`.
 *    - User clicks "+ New Thread" -> Dispatches `setCurrentChatId(null)` to reset view.
 */
const Dashboard = () => {
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);

  // Consume functions from Controller Layer (useChat Hook)
  const {
    initializeSocketConnection,
    handleSendMessage,
    handleGetChats,
    handleOpenChats,
  } = useChat();

  // Local Component State
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [inputText, setInputText] = useState("");

  // Select Global Chat State from Redux Store
  const chats = useSelector((state) => state.chat.chats);
  const currentChatId = useSelector((state) => state.chat.currentChatId);
  const loading = useSelector((state) => state.chat.loading);

  // Derived Data for rendering
  // 1. Convert dictionary object { id1: {...}, id2: {...} } into an array for .map() in sidebar
  const chatList = Object.values(chats || {});
  
  // 2. Get the active chat object and its messages array
  const activeChat = currentChatId ? chats[currentChatId] : null;
  const messages = activeChat?.messages || [];

  /**
   * --------------------------------------------------------------------------
   * 1. INITIAL LOAD (Component Mount)
   * --------------------------------------------------------------------------
   * When Dashboard renders for the first time:
   * - Connects to WebSocket server.
   * - Calls backend `GET /api/chats` to populate sidebar threads.
   */
  useEffect(() => {
    initializeSocketConnection();
    handleGetChats();
  }, []);

  /**
   * --------------------------------------------------------------------------
   * 2. AUTO-SCROLL TO BOTTOM
   * --------------------------------------------------------------------------
   * Whenever new messages arrive or loading state changes, smoothly scroll
   * the conversation feed to the latest message.
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
   * Called when:
   * - User presses Enter in input textarea.
   * - User clicks the Send arrow button.
   * - User clicks one of the Hero suggestion chips.
   * 
   * DATA FLOW:
   * 1. Clears the input field immediately.
   * 2. Passes `{ message, chatId: currentChatId }` to `handleSendMessage` in `useChat`.
   */
  const handleSubmit = async (textToSend) => {
    const query = typeof textToSend === "string" ? textToSend : inputText;
    const trimmed = query.trim();
    if (!trimmed || loading) return;

    // Clear input box immediately for smooth UX
    setInputText("");

    // Send question to useChat controller
    await handleSendMessage({
      message: trimmed,
      chatId: currentChatId,
    });
  };

  /**
   * --------------------------------------------------------------------------
   * 4. KEYBOARD SHORTCUTS
   * --------------------------------------------------------------------------
   * Allows submitting by pressing "Enter" (Shift + Enter makes a new line).
   */
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  /**
   * --------------------------------------------------------------------------
   * 5. NEW THREAD HANDLER
   * --------------------------------------------------------------------------
   * Resets active chat ID to `null` which brings user back to the Hero search view.
   */
  const handleNewThread = () => {
    dispatch(setCurrentChatId(null));
    setInputText("");
  };

  // Quick suggestion chips for the hero landing screen
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
                      onClick={() => handleOpenChats(chat._id)}
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
                      /* AI ANSWER (Rendered with ReactMarkdown) */
                      <div className="flex gap-3 text-sm text-[#d4d4d0] leading-relaxed pt-2">
                        <div className="w-full space-y-2">
                          <div className="flex items-center gap-2 text-xs font-medium text-neutral-400 pb-1">
                            <span className="text-teal-400 flex items-center gap-1">
                              <Compass className="w-3.5 h-3.5" /> Answer
                            </span>
                          </div>
                          
                          <div className="prose prose-invert max-w-none text-sm text-[#d8d8d4] space-y-3 
                            [&_p]:leading-relaxed [&_p]:mb-3 
                            [&_pre]:bg-[#141515] [&_pre]:p-3.5 [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-white/6 [&_pre]:overflow-x-auto [&_pre]:my-3
                            [&_code]:bg-white/6 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:text-neutral-200 [&_code]:font-mono [&_code]:text-[12px]
                            [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1
                            [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1
                            [&_h1]:text-lg [&_h1]:font-semibold [&_h1]:text-white [&_h1]:mt-4
                            [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-white [&_h2]:mt-3
                            [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-white [&_h3]:mt-2
                            [&_blockquote]:border-l-2 [&_blockquote]:border-teal-400/50 [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-neutral-400"
                          >
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
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