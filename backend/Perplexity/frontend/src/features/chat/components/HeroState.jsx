import React from "react";
import { Sparkles } from "lucide-react";

/**
 * HeroState Component
 * Displays the initial empty screen with title and quick prompt suggestion cards.
 */
const HeroState = ({ promptSuggestions, onSelectSuggestion }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 animate-fadeIn">
      {/* Hero Title & Badge */}
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
              onClick={() => onSelectSuggestion(item.prompt)}
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
  );
};

export default HeroState;
