interface Props {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  isConfirming?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal = ({
  isOpen,
  title,
  description,
  confirmLabel = 'Eliminar',
  isConfirming = false,
  onClose,
  onConfirm,
}: Props) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-red-500/40 bg-brand-dark p-8 shadow-neon">
        <h2 className="mb-4 text-2xl font-bold uppercase italic tracking-tighter text-red-300">{title}</h2>
        <p className="text-sm leading-6 text-brand-cream/80">{description}</p>

        <div className="flex justify-end gap-4 pt-8">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 text-sm font-bold uppercase text-brand-cream/50 transition-colors hover:text-brand-cream"
            disabled={isConfirming}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isConfirming}
            className="rounded bg-red-500 px-8 py-2 font-bold uppercase text-white transition-all hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isConfirming ? 'Eliminando...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};