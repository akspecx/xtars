import React from "react";
import { CheckCircle, ArrowLeft } from "lucide-react";

export default function LabShell({
  title,
  isChallengeSolved,
  isDone,
  onFinalize,
  onBack,
  children
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f6]">
      {/* HEADER */}
      <header className="flex items-center gap-4 p-6 border-b bg-white">
        <button onClick={onBack}>
          <ArrowLeft />
        </button>
        <h1 className="text-xl font-black">{title}</h1>
      </header>

      {/* CONTENT */}
      <main className="flex-1 p-6">{children}</main>

      {/* FOOTER */}
      <footer className="p-6 border-t bg-white flex justify-between items-center">
        <span className="text-sm">
          {isDone ? "Completed" : isChallengeSolved ? "Ready to finalize" : "Solve the challenge"}
        </span>

        <button
          disabled={!isChallengeSolved || isDone}
          onClick={onFinalize}
          className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2
            ${isChallengeSolved && !isDone
              ? "bg-black text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
        >
          <CheckCircle size={18} />
          Finalize
        </button>
      </footer>
    </div>
  );
}