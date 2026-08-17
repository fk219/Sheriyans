import React from "react";
import { User, Bot, Globe, Copy, Check, RotateCcw } from "lucide-react";

/**
 * MessageList Component
 * Renders the list of conversational turns between User and AI.
 */
const MessageList = ({ messages, copied, onCopy }) => {
  return (
    <div className="space-y-8">
      {messages.map((msg, index) => {
        const isUser = msg.role === "user";
        return (
          <div
            key={msg.id || index}
            className={`flex flex-col space-y-3 ${
              isUser ? "items-end" : "items-start"
            }`}
          >
            {/* User / AI Avatar Header */}
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

            {/* Message Box */}
            <div
              className={`w-full rounded-2xl p-4 sm:p-5 text-sm leading-relaxed ${
                isUser
                  ? "bg-[#18181b] border border-neutral-800 text-white max-w-2xl ml-auto rounded-tr-sm"
                  : "bg-[#141416] border border-neutral-800/80 text-neutral-200 rounded-tl-sm shadow-sm"
              }`}
            >
              {/* Sources Section (AI only) */}
              {!isUser && msg.sources && (
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

              {/* Text / Content */}
              <div className="whitespace-pre-wrap space-y-2">
                {msg.content}
              </div>

              {/* Action buttons (Copy, Retry) */}
              {!isUser && (
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-neutral-800/50 text-neutral-400">
                  <button
                    onClick={() => onCopy(msg.content)}
                    className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-neutral-800 hover:text-white text-xs transition-colors"
                    title="Copy response"
                  >
                    {copied ? (
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
    </div>
  );
};

export default MessageList;
