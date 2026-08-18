import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Compass, Plus, Send, User, Bot, Sparkles, Loader2, PanelLeftClose, PanelLeftOpen, MessageSquare } from "lucide-react";
import useChat from "../hook/useChat";
import { setCurrentChatId } from "../chat.slice";

/**
 * ============================================================================
 * DASHBOARD COMPONENT (Clean, Minimal & Beginner-Friendly)
 * ============================================================================
 * Flow:
 * 1. User types query in input box & hits Send/Enter.
 * 2. `useChat().handleSendMessage` sends { message, chatId } to backend API.
 * 3. Redux stores the new messages in `state.chat.chats`.
 * 4. We grab messages for `currentChatId` and display them in the center hero feed.
 * 5. Simple collapsible sidebar lists previous chat sessions.
 */
const Dashboard = () => {
  const dispatch = useDispatch();
  const { handleSendMessage } = useChat();

  // Local UI states
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [inputText, setInputText] = useState("");

  // Redux state: get all chats, current active chat ID, and loading status
  const chats = useSelector((state) => state.chat.chats);
  const currentChatId = useSelector((state) => state.chat.currentChatId);
  const loading = useSelector((state) => state.chat.loading);

  // Convert chats object to an array for simple list rendering in the sidebar
  const chatList = Object.values(chats || {});

  // Get current active chat's messages (or empty list if no active chat)
  const activeChat = currentChatId ? chats[currentChatId] : null;
  const messages = activeChat?.messages || [];

  // --------------------------------------------------------------------------
  // Handlers
  // --------------------------------------------------------------------------
  
  // Submit message to backend
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    const trimmed = inputText.trim();
    if (!trimmed || loading) return;

    // Clear input field immediately for good UX
    setInputText("");

    // Send to backend via hook
    await handleSendMessage({
      message: trimmed,
      chatId: currentChatId,
    });
  };

  // Allow sending on Enter key (Shift+Enter makes newline)
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Reset to empty screen / start a new thread
  const handleNewThread = () => {
    dispatch(setCurrentChatId(null));
    setInputText("");
  };

  return (
    <div className="flex h-screen w-full bg-[#0b0b0c] text-neutral-200 font-sans overflow-hidden">
      
      {/* =========================================================================
          1. SIMPLE SIDEBAR UI
         ========================================================================= */}
      {isSidebarOpen && (
        <aside className="w-64 min-w-64 bg-[#141416] border-r border-neutral-800/80 flex flex-col justify-between p-3.5 z-20 transition-all">
          <div className="space-y-3">
            {/* Sidebar Header with Logo & Toggle Button */}
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800/60">
              <div className="flex items-center gap-2 font-semibold text-white">
                <div className="w-7 h-7 rounded-lg bg-lime-400/10 border border-lime-400/30 flex items-center justify-center text-lime-400">
                  <Compass className="w-4 h-4" />
                </div>
                <span className="tracking-tight">Perplexity</span>
              </div>
              
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                title="Collapse sidebar"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            </div>

            {/* New Thread Button */}
            <button
              onClick={handleNewThread}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-[#1c1c1f] hover:bg-[#232327] text-xs font-medium text-white border border-neutral-800 transition-all shadow-sm"
            >
              <Plus className="w-4 h-4 text-lime-400" />
              <span>New Thread</span>
            </button>

            {/* Recent Threads List */}
            <div className="pt-2">
              <div className="px-2 pb-1.5 text-[11px] font-medium text-neutral-500 uppercase tracking-wider">
                Recent Threads
              </div>
              
              <div className="space-y-1 max-h-[calc(100vh-220px)] overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-800">
                {chatList.length === 0 ? (
                  <p className="px-2 py-3 text-xs text-neutral-600">No previous chats</p>
                ) : (
                  chatList.map((chat) => {
                    const isActive = currentChatId === chat._id;
                    return (
                      <button
                        key={chat._id}
                        onClick={() => dispatch(setCurrentChatId(chat._id))}
                        className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs text-left truncate transition-colors ${
                          isActive
                            ? "bg-[#1f1f23] text-white font-medium border border-neutral-700/60"
                            : "text-neutral-400 hover:bg-[#1a1a1d] hover:text-neutral-200"
                        }`}
                      >
                        <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-lime-400" : "text-neutral-500"}`} />
                        <span className="truncate">{chat.title || "Untitled Chat"}</span>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* User Profile Footer */}
          <div className="flex items-center gap-2.5 pt-3 border-t border-neutral-800/80 text-xs text-neutral-400">
            <div className="w-7 h-7 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-300">
              <User className="w-4 h-4" />
            </div>
            <span className="font-medium truncate">User Account</span>
          </div>
        </aside>
      )}

      {/* =========================================================================
          2. MAIN CHAT & HERO CONTAINER
         ========================================================================= */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden">
        
        {/* Top Header Navbar */}
        <header className="h-14 border-b border-neutral-800/60 flex items-center justify-between px-4 sm:px-6 bg-[#0b0b0c]/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            {/* Button to re-open sidebar when collapsed */}
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                title="Expand sidebar"
              >
                <PanelLeftOpen className="w-4 h-4" />
              </button>
            )}

            <div className="flex items-center gap-2 font-medium text-sm text-neutral-300">
              <span>{activeChat?.title || "New Thread"}</span>
            </div>
          </div>

          {/* New Thread Button in Header */}
          <button
            onClick={handleNewThread}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#18181b] hover:bg-[#222226] text-neutral-200 border border-neutral-800 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-lime-400" />
            <span>New</span>
          </button>
        </header>

        {/* Scrollable Center Feed */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 scrollbar-thin scrollbar-thumb-neutral-800">
          <div className="max-w-3xl mx-auto space-y-6 pb-32">
            
            {/* HERO VIEW: Shown when no messages exist yet */}
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[55vh] text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-lime-400/10 border border-lime-400/20 flex items-center justify-center text-lime-400">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight">
                  Where knowledge begins
                </h1>
                <p className="text-sm text-neutral-500 max-w-md leading-relaxed">
                  Ask any question, explore ideas, or research anything with real-time AI.
                </p>
              </div>
            ) : (
              /* MESSAGES LIST: Render user & AI bubbles */
              messages.map((msg, index) => {
                const isUser = msg.role === "user";
                return (
                  <div
                    key={msg._id || index}
                    className={`flex gap-3 ${
                      isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    {/* Bot Avatar Icon */}
                    {!isUser && (
                      <div className="w-7 h-7 rounded-lg bg-lime-400/10 border border-lime-400/30 flex items-center justify-center text-lime-400 shrink-0 mt-0.5">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    {/* Message Bubble */}
                    <div
                      className={`max-w-2xl rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        isUser
                          ? "bg-neutral-800 text-white rounded-tr-xs"
                          : "bg-[#141416] border border-neutral-800/90 text-neutral-200 rounded-tl-xs shadow-sm"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>

                    {/* User Avatar Icon */}
                    {isUser && (
                      <div className="w-7 h-7 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-300 shrink-0 mt-0.5">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                );
              })
            )}

            {/* Loading Indicator while AI is generating response */}
            {loading && (
              <div className="flex items-center gap-3 text-neutral-400 text-xs pl-2">
                <div className="w-7 h-7 rounded-lg bg-lime-400/10 border border-lime-400/30 flex items-center justify-center text-lime-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
                <span>Thinking...</span>
              </div>
            )}
          </div>
        </div>

        {/* =========================================================================
            3. BOTTOM FLOATING INPUT BAR
           ========================================================================= */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-linear-to-t from-[#0b0b0c] via-[#0b0b0c]/90 to-transparent">
          <div className="max-w-3xl mx-auto">
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 bg-[#141416] border border-neutral-800 rounded-2xl px-4 py-2.5 focus-within:border-lime-500/60 shadow-2xl transition-all"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything..."
                className="flex-1 bg-transparent text-sm text-white placeholder-neutral-500 focus:outline-none"
              />

              <button
                type="submit"
                disabled={!inputText.trim() || loading}
                className={`p-2 rounded-xl transition-all ${
                  inputText.trim() && !loading
                    ? "bg-lime-400 text-neutral-950 font-medium hover:bg-lime-300 cursor-pointer shadow-md shadow-lime-400/20"
                    : "bg-neutral-800 text-neutral-600 cursor-not-allowed"
                }`}
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;