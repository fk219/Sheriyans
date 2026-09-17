import { JUDGE_NAME, MODEL_1_NAME, MODEL_2_NAME, WINNER_LABELS } from "../constants.js"
import SolutionText from "./SolutionText.jsx"
import Icon from "./Icon.jsx"

const SolutionCard = ({ name, solution, score, feedback, isWinner, loading }) => (
  <div
    className={`min-w-0 flex-1 rounded-xl border p-4 ${
      isWinner ? "border-zinc-500 bg-zinc-900" : "border-zinc-800 bg-zinc-900/50"
    }`}
  >
    <div className="mb-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {isWinner && <Icon name="trophy" size={15} className="text-amber-300" />}
        <span className="text-sm font-medium text-zinc-300">{name}</span>
      </div>
      <span className="rounded-md border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-xs font-mono text-zinc-300">
        {loading ? "–" : `${score}/10`}
      </span>
    </div>

    {loading ? (
      <p className="font-mono text-xs text-zinc-500">Generating...</p>
    ) : (
      <SolutionText text={solution} />
    )}

    {!loading && feedback && (
      <div className="mt-4 border-t border-zinc-800 pt-3">
        <span className="text-[10px] uppercase tracking-widest text-zinc-600">
          {JUDGE_NAME} feedback
        </span>
        <p className="mt-1 text-xs leading-relaxed text-zinc-500">{feedback}</p>
      </div>
    )}
  </div>
)

const BattleMessage = ({ result, error }) => {
  if (error) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-sm text-red-400">
        {error}
      </div>
    )
  }
  if (!result) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-sm text-zinc-500">
        <span className="flex items-center gap-2"><Icon name="sword" size={16} className="animate-pulse" /> Models are battling...</span>
      </div>
    )
  }

  const { solution_1, solution_2, judge } = result

  return (
    <div className="min-w-0 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 shadow-lg shadow-black/10">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 px-4 py-3">
        <span className="flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-500">
          <Icon name="sword" size={14} /> Battle Result
        </span>
        <span className="rounded-md bg-amber-950/60 px-2.5 py-1 text-xs font-medium text-amber-300">
          {WINNER_LABELS[judge.winner] || "It's a tie"} — {judge.solution_1_score} vs{" "}
          {judge.solution_2_score}
        </span>
      </div>
      <div className="flex min-w-0 flex-col gap-3 p-4 md:flex-row">
        <SolutionCard
          name={MODEL_1_NAME}
          solution={solution_1}
          score={judge.solution_1_score}
          feedback={judge.solution_1_feedback}
          isWinner={judge.winner === "solution_1"}
        />
        <SolutionCard
          name={MODEL_2_NAME}
          solution={solution_2}
          score={judge.solution_2_score}
          feedback={judge.solution_2_feedback}
          isWinner={judge.winner === "solution_2"}
        />
      </div>
    </div>
  )
}

export default BattleMessage
