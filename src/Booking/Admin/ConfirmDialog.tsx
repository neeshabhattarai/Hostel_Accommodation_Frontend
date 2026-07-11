interface ConfirmDialogProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function ConfirmDialog({ title, message, onConfirm, onCancel, loading }: ConfirmDialogProps) {
  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-500 text-lg shrink-0">
          🗑
        </div>
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      </div>
      <p className="text-sm text-gray-500 leading-relaxed pl-[52px]">{message}</p>

      <div className="flex justify-end gap-2 mt-6 pt-5 border-t border-gray-100">
        <button onClick={onCancel} disabled={loading}
          className="h-9 px-4 rounded-lg text-sm font-medium text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer">
          Cancel
        </button>
        <button onClick={onConfirm} disabled={loading}
          className="h-9 px-5 rounded-lg text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-50 cursor-pointer">
          {loading ? "Deleting…" : "Delete"}
        </button>
      </div>
    </div>
  );
}
