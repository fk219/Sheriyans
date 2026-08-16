import React, { useState, useEffect, useRef } from "react";
import useChat from "../hook/useChat";
import { useSelector } from "react-redux";
import {
  Plus,
  MessageSquare,
  Search,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
  Paperclip,
  ArrowUp,
  Globe,
  Code2,
  BookOpen,
  PenTool,
  Copy,
  Check,
  RotateCcw,
  Share2,
  Trash2,
  ChevronRight,
  Bot,
  User,
  Settings,
  Compass,
  Layers,
} from "lucide-react";

const Dashboard = () => {
  const { initializeSocketConnection } = useChat();
  const { user } = useSelector((state) => state.auth || {});

  // UI States (Two-way Binding & Layout)
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeFocus, setActiveFocus] = useState("web");
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Initialize socket connection on mount
  useEffect(() => {
    if (initializeSocketConnection) {
      initializeSocketConnection();
    }
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedChatId]);

  // Sample data for UI demonstration (connectable to backend APIs)
  const [chats, setChats] = useState([
    {
      _id: "chat-1",
      title: "Exploring Quantum Computing Algorithms",
      createdAt: "Today",
      messages: [
        {
          _id: "m1",
          role: "user",
          content: "Explain Quantum Computing algorithms and why Shor's algorithm is important.",
        },
        {
          _id: "m2",
          role: "ai",
          content:
            "Quantum computing algorithms leverage the principles of quantum mechanics—such as superposition, entanglement, and interference—to solve complex problems significantly faster than classical computers.\n\n### Shor's Algorithm\nShor's Algorithm, developed by Peter Shor in 1994, is a quantum algorithm for integer factorization. Its significance stems from the fact that it can factor large composite numbers in polynomial time $O((\\log N)^3)$, whereas the best-known classical algorithms take sub-exponential time.\n\n- **Impact on Cryptography**: Threatens modern public-key cryptography (e.g., RSA, ECC).\n- **Quantum Speedup**: Demonstrates an exponential speedup over classical algorithms.",
          sources: [
            { title: "Quantum Algorithm Zoo", url: "https://quantumalgorithmzoo.org" },
            { title: "IBM Quantum Learning", url: "https://learning.quantum.ibm.com" },
          ],
        },
      ],
    },
    {
      _id: "chat-2",
      title: "React 19 Server Components Architecture",
      createdAt: "Today",
      messages: [
        {
          _id: "m3",
          role: "user",
          content: "What are the main benefits of React 19 Server Components?",
        },
        {
          _id: "m4",
          role: "ai",
          content:
            "React Server Components (RSC) allow developers to write components that execute exclusively on the server, bringing several benefits:\n\n1. **Zero Client-Side Bundle Size**: Server-only dependencies are never shipped to the client.\n2. **Direct Backend Access**: Access databases, filesystems, and internal microservices directly.\n3. **Automatic Code Splitting**: Client components imported in server components are automatically split into separate chunks.",
        },
      ],
    },
    {
      _id: "chat-3",
      title: "Tailwind CSS v4 New Features & Setup",
      createdAt: "Yesterday",
      messages: [],
    },
    {
      _id: "chat-4",
      title: "MongoDB Indexing Strategies for Large Collections",
      createdAt: "Previous 7 Days",
      messages: [],
    },
  ]);

  // Focus Modes Configuration (Perplexity style)
  const focusModes = [
    { id: "web", label: "Web", icon: Globe },
    { id: "academic", label: "Academic", icon: BookOpen },
    { id: "writing", label: "Writing", icon: PenTool },
    { id: "code", label: "Code", icon: Code2 },
  ];

  // Quick Prompt Suggestions for Empty State
  const promptSuggestions = [
    {
      icon: Sparkles,
      title: "Explain Concept",
      prompt: "Explain how large language models generate tokens and compute probabilities in simple terms.",
    },
    {
      icon: Code2,
      title: "Write Clean Code",
      prompt: "Create a reusable React hook with TypeScript for debouncing API search queries.",
    },
    {
      icon: Globe,
      title: "Market Analysis",
      prompt: "What are the major AI hardware breakthroughs and GPU architectures in 2026?",
    },
    {
      icon: BookOpen,
      title: "Deep Dive",
      prompt: "Compare vector embeddings vs graph databases for enterprise retrieval augmented generation (RAG).",
    },
  ];

  // Get active chat data
  const currentChat = chats.find((c) => c._id === selectedChatId);

  // Handlers (UI layer)
  const handleSelectChat = (chatId) => {
    setSelectedChatId(chatId);
  };

  const handleNewChat = () => {
    setSelectedChatId(null);
    setMessageInput("");
  };

  const handleSelectSuggestion = (suggestionPrompt) => {
    setMessageInput(suggestionPrompt);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleCopyMessage = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleDeleteChat = (e, chatId) => {
    e.stopPropagation();
    setChats((prev) => prev.filter((c) => c._id !== chatId));
    if (selectedChatId === chatId) {
      setSelectedChatId(null);
    }
  };

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!messageInput.trim()) return;

    // UI-only preview demonstration:
    const userMsg = {
      _id: `user-${Date.now()}`,
      role: "user",
      content: messageInput,
    };

    if (selectedChatId) {
      // Append to existing chat
      setChats((prev) =>
        prev.map((chat) =>
          chat._id === selectedChatId
            ? { ...chat, messages: [...chat.messages, userMsg] }
            : chat
        )
      );
    } else {
      // Create a temporary new chat in UI
      const newId = `chat-${Date.now()}`;
      const newChatObj = {
        _id: newId,
        title: messageInput.slice(0, 35) + (messageInput.length > 35 ? "..." : ""),
        createdAt: "Today",
        messages: [userMsg],
      };
      setChats((prev) => [newChatObj, ...prev]);
      setSelectedChatId(newId);
    }

    setMessageInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Filter chats by search query
  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen w-full bg-[#0b0b0c] text-neutral-200 overflow-hidden font-sans select-none">
      {/* ========================================================================= */}
      {/* 1. LEFT SIDEBAR (Perplexity / ChatGPT Style) */}
      {/* ========================================================================= */}
      <aside
        className={`h-full bg-[#141416] border-r border-neutral-800/80 flex flex-col transition-all duration-300 ease-in-out z-30 ${
          isSidebarOpen ? "w-64 min-w-64" : "w-0 min-w-0 -translate-x-full md:w-16 md:min-w-16 md:translate-x-0"
        }`}
      >
        {/* Sidebar Header & Brand Logo */}
        <div className="p-3.5 flex items-center justify-between border-b border-neutral-800/60">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-lime-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-lime-500/20 shrink-0">
              <Compass className="w-5 h-5 text-neutral-950 font-bold" />
            </div>
            {isSidebarOpen && (
              <span className="font-semibold text-base text-white tracking-tight truncate">
                Perplexity
              </span>
            )}
          </div>
          {isSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800/60 transition-colors"
              title="Collapse Sidebar"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* New Thread / Chat Action Button */}
        <div className="p-3">
          <button
            onClick={handleNewChat}
            className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 bg-[#1c1c1f] hover:bg-[#232327] border border-neutral-800/80 hover:border-lime-500/40 text-sm font-medium text-white transition-all duration-200 group shadow-sm ${
              !isSidebarOpen && "px-0"
            }`}
            title="New Thread"
          >
            <Plus className="w-4 h-4 text-lime-400 group-hover:rotate-90 transition-transform duration-200" />
            {isSidebarOpen && <span>New Thread</span>}
          </button>
        </div>

        {/* Sidebar Search Bar (Two-Way Binding) */}
        {isSidebarOpen && (
          <div className="px-3 pb-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search threads..."
                className="w-full bg-[#1c1c1f]/60 border border-neutral-800/70 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-lime-500/50 focus:ring-1 focus:ring-lime-500/30 transition-all"
              />
            </div>
          </div>
        )}

        {/* Thread History List */}
        <div className="flex-1 overflow-y-auto px-2 space-y-1 scrollbar-thin scrollbar-thumb-neutral-800">
          {isSidebarOpen && (
            <div className="px-2 pt-2 pb-1 text-[11px] font-medium text-neutral-500 uppercase tracking-wider">
              Recent Threads
            </div>
          )}

          {filteredChats.map((chat) => {
            const isActive = selectedChatId === chat._id;
            return (
              <div
                key={chat._id}
                onClick={() => handleSelectChat(chat._id)}
                className={`group relative flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs cursor-pointer transition-all duration-150 ${
                  isActive
                    ? "bg-[#1f1f23] text-white font-medium border border-neutral-700/50"
                    : "text-neutral-400 hover:bg-[#18181b] hover:text-neutral-200"
                } ${!isSidebarOpen && "justify-center px-0"}`}
                title={chat.title}
              >
                <MessageSquare
                  className={`w-3.5 h-3.5 shrink-0 ${
                    isActive ? "text-lime-400" : "text-neutral-500 group-hover:text-neutral-400"
                  }`}
                />

                {isSidebarOpen && (
                  <>
                    <span className="truncate flex-1">{chat.title}</span>
                    <button
                      onClick={(e) => handleDeleteChat(e, chat._id)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-opacity"
                      title="Delete Thread"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </>
                )}
              </div>
            );
          })}

          {filteredChats.length === 0 && isSidebarOpen && (
            <div className="text-center py-6 text-xs text-neutral-600">
              No threads found
            </div>
          )}
        </div>

        {/* User Account / Profile Section (Bottom) */}
        <div className="p-3 border-t border-neutral-800/60 bg-[#121214]">
          <div
            className={`flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-neutral-800/50 transition-colors cursor-pointer ${
              !isSidebarOpen && "justify-center p-0"
            }`}
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-lime-500 to-emerald-400 text-neutral-950 font-bold text-xs flex items-center justify-center shrink-0">
              {user?.name ? user.name[0].toUpperCase() : user?.email ? user.email[0].toUpperCase() : "U"}
            </div>
            {isSidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white truncate">
                  {user?.name || user?.email?.split("@")[0] || "Pro User"}
                </p>
                <p className="text-[10px] text-neutral-500 truncate">
                  {user?.email || "user@example.com"}
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MAIN CHAT & CONVERSATION AREA */}
      {/* ========================================================================= */}
      <main className="flex-1 flex flex-col h-full bg-[#0b0b0c] relative overflow-hidden">
        {/* Top Navbar */}
        <header className="h-14 border-b border-neutral-800/60 flex items-center justify-between px-4 sm:px-6 bg-[#0b0b0c]/80 backdrop-blur-md z-20">
          <div className="flex items-center gap-3">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800/60 transition-colors"
                title="Expand Sidebar"
              >
                <PanelLeftOpen className="w-4 h-4" />
              </button>
            )}

            {/* Model Badge / Pill */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#18181b] border border-neutral-800 text-xs text-neutral-300">
              <Sparkles className="w-3.5 h-3.5 text-lime-400" />
              <span className="font-medium text-white">Mistral AI</span>
              <span className="text-[10px] bg-lime-500/10 text-lime-400 px-1.5 py-0.2 rounded font-mono">
                Pro
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {selectedChatId && (
              <button
                onClick={handleNewChat}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#18181b] hover:bg-[#202024] text-neutral-300 hover:text-white border border-neutral-800 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New</span>
              </button>
            )}
            <button
              className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800/60 transition-colors"
              title="Share Thread"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Scrollable Conversation Content Area */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 scrollbar-thin scrollbar-thumb-neutral-800">
          <div className="max-w-3xl mx-auto space-y-8 pb-32">
            {/* ----------------------------------------------------------------- */}
            {/* A. EMPTY HERO STATE (When no chat is active or messages is empty) */}
            {/* ----------------------------------------------------------------- */}
            {(!currentChat || currentChat.messages.length === 0) && (
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 animate-fadeIn">
                {/* Glow & Title */}
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#18181b] border border-lime-500/20 text-xs text-lime-400 mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Real-time AI Search & Synthesis</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                    Where knowledge begins
                  </h1>
                  <p className="text-sm text-neutral-500 max-w-md mx-auto">
                    Ask questions, research complex topics, analyze data, and generate code with high precision.
                  </p>
                </div>

                {/* Suggestion Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl text-left">
                  {promptSuggestions.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={index}
                        onClick={() => handleSelectSuggestion(item.prompt)}
                        className="group p-3.5 rounded-xl bg-[#141416] hover:bg-[#1a1a1d] border border-neutral-800/80 hover:border-lime-500/30 transition-all duration-200 flex flex-col justify-between space-y-2 cursor-pointer shadow-sm"
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-xs font-semibold text-neutral-300 group-hover:text-lime-400 transition-colors">
                            {item.title}
                          </span>
                          <Icon className="w-4 h-4 text-neutral-500 group-hover:text-lime-400 transition-colors" />
                        </div>
                        <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                          {item.prompt}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ----------------------------------------------------------------- */}
            {/* B. ACTIVE MESSAGE FEED (User & AI Message Turns) */}
            {/* ----------------------------------------------------------------- */}
            {currentChat &&
              currentChat.messages.map((msg, index) => {
                const isUser = msg.role === "user";
                return (
                  <div
                    key={msg._id || index}
                    className={`flex flex-col space-y-3 ${
                      isUser ? "items-end" : "items-start"
                    }`}
                  >
                    {/* Message Header / Author badge */}
                    <div className="flex items-center gap-2 text-xs text-neutral-400 px-1">
                      {isUser ? (
                        <>
                          <span>You</span>
                          <div className="w-5 h-5 rounded-full bg-neutral-800 flex items-center justify-center">
                            <User className="w-3 h-3 text-neutral-300" />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-lime-400 to-emerald-500 flex items-center justify-center shadow-sm">
                            <Bot className="w-3 h-3 text-neutral-950 font-bold" />
                          </div>
                          <span className="font-medium text-neutral-300">Answer</span>
                        </>
                      )}
                    </div>

                    {/* Message Body Box */}
                    <div
                      className={`w-full rounded-2xl p-4 sm:p-5 text-sm leading-relaxed ${
                        isUser
                          ? "bg-[#18181b] border border-neutral-800 text-white max-w-2xl ml-auto rounded-tr-sm"
                          : "bg-[#141416] border border-neutral-800/80 text-neutral-200 rounded-tl-sm shadow-sm"
                      }`}
                    >
                      {/* Sources Section (Perplexity-style pills) */}
                      {!isUser && msg.sources && msg.sources.length > 0 && (
                        <div className="mb-4 pb-3 border-b border-neutral-800/70">
                          <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-2">
                            <Globe className="w-3.5 h-3.5 text-lime-400" />
                            <span>Sources</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {msg.sources.map((src, sIdx) => (
                              <a
                                key={sIdx}
                                href={src.url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#1c1c1f] hover:bg-[#252529] border border-neutral-800 text-xs text-neutral-300 hover:text-white transition-colors"
                              >
                                <span className="w-3.5 h-3.5 rounded-full bg-neutral-700 text-[9px] flex items-center justify-center text-white">
                                  {sIdx + 1}
                                </span>
                                <span className="truncate max-w-[150px]">{src.title}</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Content Paragraphs / Markdown text */}
                      <div className="whitespace-pre-wrap space-y-2">
                        {msg.content}
                      </div>

                      {/* AI Action Toolbars (Copy, Regenerate, Share) */}
                      {!isUser && (
                        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-neutral-800/50 text-neutral-400">
                          <button
                            onClick={() => handleCopyMessage(msg.content, index)}
                            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-neutral-800 hover:text-white text-xs transition-colors"
                            title="Copy response"
                          >
                            {copiedIndex === index ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-lime-400" />
                                <span className="text-lime-400 text-[11px]">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span className="text-[11px]">Copy</span>
                              </>
                            )}
                          </button>

                          <button
                            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-neutral-800 hover:text-white text-xs transition-colors"
                            title="Rewrite / Retry"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span className="text-[11px]">Retry</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. PERPLEXITY-STYLE FLOATING SEARCH / CHAT INBOX */}
        {/* ========================================================================= */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-[#0b0b0c] via-[#0b0b0c]/90 to-transparent pointer-events-none z-20">
          <div className="max-w-3xl mx-auto pointer-events-auto">
            <form
              onSubmit={handleSendMessage}
              className="relative rounded-2xl bg-[#141416] border border-neutral-800/90 focus-within:border-lime-500/60 focus-within:ring-1 focus-within:ring-lime-500/40 shadow-2xl transition-all duration-200 overflow-hidden"
            >
              {/* Textarea Input with Two-Way Binding */}
              <div className="p-3.5 pb-2">
                <textarea
                  ref={textareaRef}
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={2}
                  placeholder="Ask anything or search the web..."
                  className="w-full bg-transparent text-sm text-white placeholder-neutral-500 focus:outline-none resize-none leading-relaxed"
                />
              </div>

              {/* Action Toolbar Inside Input Box */}
              <div className="flex items-center justify-between px-3 pb-3 pt-1 border-t border-neutral-800/40">
                {/* Left Controls: Focus Modes & Attachment */}
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                  {focusModes.map((mode) => {
                    const Icon = mode.icon;
                    const isSelected = activeFocus === mode.id;
                    return (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => setActiveFocus(mode.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                          isSelected
                            ? "bg-lime-500/10 text-lime-400 border border-lime-500/30"
                            : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50"
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{mode.label}</span>
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    className="p-1.5 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50 rounded-lg transition-colors"
                    title="Attach file"
                  >
                    <Paperclip className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Right Controls: Send Button */}
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    disabled={!messageInput.trim()}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 ${
                      messageInput.trim()
                        ? "bg-gradient-to-r from-lime-400 to-emerald-500 text-neutral-950 font-bold shadow-md shadow-lime-500/20 hover:brightness-110 cursor-pointer"
                        : "bg-neutral-800 text-neutral-600 cursor-not-allowed"
                    }`}
                    title="Send message"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </form>

            {/* Footer Disclaimer */}
            <p className="text-center text-[11px] text-neutral-600 mt-2">
              Perplexity clone can make mistakes. Verify important information.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;