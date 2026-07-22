"use client";

import { useEffect, useRef } from "react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Styles the confirm button as a destructive (red) action instead of gold. */
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Onayla",
  cancelLabel = "Vazgeç",
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onCancel={(event) => {
        // Esc key: keep it under our own open/onCancel flow instead of the UA default.
        event.preventDefault();
        onCancel();
      }}
      className="m-auto rounded-[20px] border border-[#e0e0e0] p-0 [&::backdrop]:bg-black/40"
    >
      <div className="w-[min(90vw,380px)] p-6">
        <h2 className="font-serif text-lg font-semibold text-gray-800 mb-2">
          {title}
        </h2>
        <p className="text-[14px] text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 border border-gray-300 hover:bg-gray-50 rounded-xl text-[14px] font-medium transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-5 py-2.5 rounded-xl text-[14px] font-medium transition-colors ${
              destructive
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-gold hover:bg-gold-dark text-gold-ink hover:text-white"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}
