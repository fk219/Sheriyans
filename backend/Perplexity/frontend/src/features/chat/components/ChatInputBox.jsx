import React from "react";
import { Paperclip, ArrowUp } from "lucide-react";

/**
 * ChatInputBox Component
 * Floating input box with textarea, focus mode selector pills,
 * attachment button, send action, and disclaimer text.
 */
const ChatInputBox = ({
  messageInput,
  setMessageInput,
  focusModes,
  activeFocus,
  setActiveFocus,
  onSendMessage,
}) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-[#0b0b0c] via-[#0b0b0c]/90 to-transparent pointer-events-none z-20">
      <div className="max-w-3xl mx-auto pointer-events-auto">
        <div className="relative rounded-2xl bg-[#141416] border border-neutral-800/90 focus-within:border-lime-500/60 focus-within:ring-1 focus-within:ring-lime-500/40 shadow-2xl transition-all duration-200 overflow-hidden">
          {/* Prompt Textarea */}
          <div className="p-3.5 pb-2">
            <textarea
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              rows={2}
              placeholder="Ask anything or search the web..."
              className="w-full bg-transparent text-sm text-white placeholder-neutral-500 focus:outline-none resize-none leading-relaxed"
            />
          </div>

          {/* Action Toolbar */}
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
                type="button"
                onClick={onSendMessage}
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
        </div>

        {/* Disclaimer Footer */}
        <p className="text-center text-[11px] text-neutral-600 mt-2">
          Perplexity clone can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  );
};

export default ChatInputBox;
