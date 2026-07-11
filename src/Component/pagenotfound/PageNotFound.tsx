import { useNavigate } from "react-router-dom";

export default function PageNotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-6 font-sans">
      {/* Ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-700/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 text-center max-w-lg w-full">

        {/* 404 display */}
        <div className="relative mb-2 select-none">
          <span className="block text-[11rem] leading-none font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-violet-400 via-violet-600 to-transparent">
            404
          </span>
          {/* Reflection */}
          <span className="block text-[11rem] leading-none font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-violet-900/40 to-transparent scale-y-[-1] opacity-30 -mt-4">
            404
          </span>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-violet-700/50 to-transparent" />
          <span className="text-violet-400/60 text-xs font-mono tracking-[0.25em] uppercase">
            Page Not Found
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-violet-700/50 to-transparent" />
        </div>

        {/* Message */}
        <p className="text-slate-400 text-base leading-relaxed mb-10">
          The page you're looking for doesn't exist or has been moved.
          <br />
          Head back to where you were.
        </p>

        {/* CTA */}
        <button
          onClick={() => navigate(-1)}
          className="group inline-flex items-center gap-3 bg-violet-600 hover:bg-violet-500 active:scale-95 text-white font-semibold text-sm px-8 py-3.5 rounded-full transition-all duration-200 shadow-lg shadow-violet-900/40 hover:shadow-violet-700/50"
        >
          {/* Arrow */}
          <svg
            className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
          Go Back
        </button>

        {/* Subtle footer note */}
        <p className="mt-8 text-slate-600 text-xs font-mono">
          error · 404 · not_found
        </p>
      </div>
    </div>
  );
}
