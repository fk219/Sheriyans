import React from "react";
import { PanelLeftOpen, Sparkles, Plus, Share2 } from "lucide-react";

/**
 * TopNavbar Component
 * Top bar displaying the sidebar toggle (when closed), AI model badge,
 * and header actions (New thread & Share).
 */
const TopNavbar = ({
  isSidebarOpen,
  setIsSidebarOpen,
  selectedChatId,
  onNewChat,
}) => {
  return (
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

        {/* Model Badge */}
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
            onClick={onNewChat}
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
  );
};

export default TopNavbar;
