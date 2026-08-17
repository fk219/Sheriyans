import React from "react";
import {
  Compass,
  PanelLeftClose,
  Plus,
  Search,
  MessageSquare,
  Trash2,
} from "lucide-react";

/**
 * Sidebar Component
 * Represents the left navigation panel with logo, new thread button,
 * thread search, chat history list, and user profile at the bottom.
 */
const Sidebar = ({
  isSidebarOpen,
  setIsSidebarOpen,
  searchQuery,
  setSearchQuery,
  recentChats,
  selectedChatId,
  setSelectedChatId,
}) => {
  return (
    <aside
      className={`h-full bg-[#141416] border-r border-neutral-800/80 flex flex-col transition-all duration-300 ease-in-out z-30 ${
        isSidebarOpen
          ? "w-64 min-w-64"
          : "w-0 min-w-0 -translate-x-full md:w-16 md:min-w-16 md:translate-x-0"
      }`}
    >
      {/* 1. Header & Logo */}
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

      {/* 2. New Thread Button */}
      <div className="p-3">
        <button
          onClick={() => setSelectedChatId(null)}
          className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 bg-[#1c1c1f] hover:bg-[#232327] border border-neutral-800/80 hover:border-lime-500/40 text-sm font-medium text-white transition-all duration-200 group shadow-sm ${
            !isSidebarOpen && "px-0"
          }`}
        >
          <Plus className="w-4 h-4 text-lime-400 group-hover:rotate-90 transition-transform duration-200" />
          {isSidebarOpen && <span>New Thread</span>}
        </button>
      </div>

      {/* 3. Search Bar */}
      {isSidebarOpen && (
        <div className="px-3 pb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search threads..."
              className="w-full bg-[#1c1c1f]/60 border border-neutral-800/70 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-lime-500/50 transition-all"
            />
          </div>
        </div>
      )}

      {/* 4. Recent Threads List */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1 scrollbar-thin scrollbar-thumb-neutral-800">
        {isSidebarOpen && (
          <div className="px-2 pt-2 pb-1 text-[11px] font-medium text-neutral-500 uppercase tracking-wider">
            Recent Threads
          </div>
        )}

        {recentChats
          .filter((chat) =>
            chat.title.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((chat) => {
            const isActive = selectedChatId === chat.id;
            return (
              <div
                key={chat.id}
                onClick={() => setSelectedChatId(chat.id)}
                className={`group relative flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs cursor-pointer transition-all duration-150 ${
                  isActive
                    ? "bg-[#1f1f23] text-white font-medium border border-neutral-700/50"
                    : "text-neutral-400 hover:bg-[#18181b] hover:text-neutral-200"
                } ${!isSidebarOpen && "justify-center px-0"}`}
              >
                <MessageSquare
                  className={`w-3.5 h-3.5 shrink-0 ${
                    isActive
                      ? "text-lime-400"
                      : "text-neutral-500 group-hover:text-neutral-400"
                  }`}
                />
                {isSidebarOpen && (
                  <>
                    <span className="truncate flex-1">{chat.title}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
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
      </div>

      {/* 5. User Account Profile (Bottom) */}
      <div className="p-3 border-t border-neutral-800/60 bg-[#121214]">
        <div
          className={`flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-neutral-800/50 transition-colors cursor-pointer ${
            !isSidebarOpen && "justify-center p-0"
          }`}
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-lime-500 to-emerald-400 text-neutral-950 font-bold text-xs flex items-center justify-center shrink-0">
            U
          </div>
          {isSidebarOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">
                Demo User
              </p>
              <p className="text-[10px] text-neutral-500 truncate">
                demo@example.com
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
