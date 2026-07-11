interface ToastProps {
  msg: string;
  type: "success" | "error";
}

export function Toast({ msg, type }: ToastProps) {
  return (
    <div
      className={`fixed top-5 right-5 z-[300] flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-white shadow-lg animate-fadeIn ${
        type === "success" ? "bg-emerald-500" : "bg-red-500"
      }`}
    >
      <span className="text-base">{type === "success" ? "✓" : "✕"}</span>
      {msg}
    </div>
  );
}
