import type { Categoria } from '../../types/categoria';

interface Props {
  isOpen: boolean;
  categoria: Categoria | null;
  onClose: () => void;
}

export const CategoriaDetailModal = ({ isOpen, categoria, onClose }: Props) => {
  if (!isOpen || !categoria) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl border border-neon-amber bg-brand-dark p-8 shadow-neon">
        <h2 className="mb-1 text-2xl font-bold uppercase italic tracking-tighter text-neon-amber">{categoria.nombre}</h2>
        <p className="mb-6 text-xs uppercase tracking-[0.28em] text-brand-cream/50">Detalle de categoria</p>

        <div className="rounded border border-brand-gray/40 bg-brand-gray/10 p-4 text-sm text-brand-cream/80">
          <p className="mb-1 text-xs uppercase tracking-widest text-brand-cream/50">Descripcion</p>
          <p>{categoria.descripcion}</p>
        </div>

        <div className="mt-4 rounded border border-brand-gray/40 bg-brand-gray/10 p-4 text-sm text-brand-cream/80">
          <p className="mb-1 text-xs uppercase tracking-widest text-brand-cream/50">Categoría padre</p>
          <p>{categoria.parent_id ?? 'Sin padre (raíz)'}</p>
        </div>

        <div className="mt-4 overflow-hidden rounded border border-brand-gray/40 bg-brand-gray/10">
          <img src={categoria.imagen_url} alt={categoria.nombre} className="h-48 w-full object-cover" />
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded bg-neon-amber px-8 py-2 font-bold uppercase text-brand-dark transition-all hover:bg-neon-amber/80"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};