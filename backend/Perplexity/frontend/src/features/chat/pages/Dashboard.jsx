import React, { useState } from "react";
import { Sparkles, Code2, Globe, BookOpen, PenTool } from "lucide-react";

// Sub-components
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";
import HeroState from "../components/HeroState";
import MessageList from "../components/MessageList";
import ChatInputBox from "../components/ChatInputBox";

/**
 * ============================================================================
 * DASHBOARD PAGE COMPONENT (Modular & Clean)
 * ============================================================================
 * Each section is extracted into its own component in `../components/`:
 * 1. <Sidebar />       -> Left navigation panel
 * 2. <TopNavbar />     -> Header with model status & buttons
 * 3. <HeroState />     -> Empty screen with prompt suggestions
 * 4. <MessageList />   -> Chat history messages & AI responses
 * 5. <ChatInputBox />  -> Floating search/prompt bar at the bottom
 */
const Dashboard = () => {
  // --------------------------------------------------------------------------
  // Simple UI States
  // --------------------------------------------------------------------------
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeFocus, setActiveFocus] = useState("web");
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChatId, setSelectedChatId] = useState("chat-1"); // null = Hero state, string = active chat
  const [copied, setCopied] = useState(false);

  // --------------------------------------------------------------------------
  // Mock / Design Preview Data
  // --------------------------------------------------------------------------
  const focusModes = [
    { id: "web", label: "Web", icon: Globe },
    { id: "academic", label: "Academic", icon: BookOpen },
    { id: "writing", label: "Writing", icon: PenTool },
    { id: "code", label: "Code", icon: Code2 },
  ];

  const recentChats = [
    { id: "chat-1", title: "Exploring Quantum Computing Algorithms" },
    { id: "chat-2", title: "React 19 Server Components Architecture" },
    { id: "chat-3", title: "Tailwind CSS Design System & Colors" },
    { id: "chat-4", title: "MongoDB Indexing Strategies" },
  ];

  const promptSuggestions = [
    {
      icon: Sparkles,
      title: "Explain Concept",
      prompt: "Explain how large language models generate tokens in simple terms.",
    },
    {
      icon: Code2,
      title: "Write Clean Code",
      prompt: "Create a reusable React custom hook for handling API search queries.",
    },
    {
      icon: Globe,
      title: "Market Analysis",
      prompt: "What are the major AI hardware breakthroughs and GPU architectures in 2026?",
    },
    {
      icon: BookOpen,
      title: "Deep Dive",
      prompt: "Compare vector embeddings vs graph databases for enterprise RAG.",
    },
  ];

  const sampleMessages = [
    {
      id: "m1",
      role: "user",
      content: "Explain Quantum Computing algorithms and why Shor's algorithm is important.",
    },
    {
      id: "m2",
      role: "ai",
      content:
        "Quantum computing algorithms leverage the principles of quantum mechanics—such as superposition and entanglement—to solve complex problems exponentially faster than classical computers.\n\n### Shor's Algorithm\nDeveloped by Peter Shor in 1994, Shor's algorithm can factor large composite numbers in polynomial time, posing a fundamental challenge to classical RSA encryption.",
      sources: [
        { title: "Quantum Algorithm Zoo", url: "https://quantumalgorithmzoo.org" },
        { title: "IBM Quantum Learning", url: "https://learning.quantum.ibm.com" },
      ],
    },
  ];

  // --------------------------------------------------------------------------
  // Simple Handlers
  // --------------------------------------------------------------------------
  const handleCopy = (text) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSelectSuggestion = (promptText) => {
    setMessageInput(promptText);
    setSelectedChatId("chat-1");
  };

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      setSelectedChatId("chat-1");
      setMessageInput("");
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#0b0b0c] text-neutral-200 overflow-hidden font-sans select-none">
      {/* 1. LEFT SIDEBAR */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        recentChats={recentChats}
        selectedChatId={selectedChatId}
        setSelectedChatId={setSelectedChatId}
      />

      {/* 2. MAIN CONVERSATION / CONTENT AREA */}
      <main className="flex-1 flex flex-col h-full bg-[#0b0b0c] relative overflow-hidden">
        {/* Top Navbar */}
        <TopNavbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          selectedChatId={selectedChatId}
          onNewChat={() => setSelectedChatId(null)}
        />

        {/* Scrollable Center Feed */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 scrollbar-thin scrollbar-thumb-neutral-800">
          <div className="max-w-3xl mx-auto space-y-8 pb-32">
            {!selectedChatId ? (
              // Empty Hero View
              <HeroState
                promptSuggestions={promptSuggestions}
                onSelectSuggestion={handleSelectSuggestion}
              />
            ) : (
              // Active Conversation Messages View
              <MessageList
                messages={sampleMessages}
                copied={copied}
                onCopy={handleCopy}
              />
            )}
          </div>
        </div>

        {/* 3. FLOATING PROMPT INPUT BAR */}
        <ChatInputBox
          messageInput={messageInput}
          setMessageInput={setMessageInput}
          focusModes={focusModes}
          activeFocus={activeFocus}
          setActiveFocus={setActiveFocus}
          onSendMessage={handleSendMessage}
        />
      </main>
    </div>
  );
};

export default Dashboard;