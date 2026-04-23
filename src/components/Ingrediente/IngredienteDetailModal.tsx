import type { Ingrediente } from '../../types/ingrediente';

interface Props {
  isOpen: boolean;
  ingrediente: Ingrediente | null;
  onClose: () => void;
}

export const IngredienteDetailModal = ({ isOpen, ingrediente, onClose }: Props) => {
  if (!isOpen || !ingrediente) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-neon-amber bg-brand-dark p-8 shadow-neon">
        <h2 className="mb-1 text-2xl font-bold uppercase italic tracking-tighter text-neon-amber">
          {ingrediente.nombre}
        </h2>
        <p className="mb-6 text-xs uppercase tracking-[0.28em] text-brand-cream/50">Detalle de ingrediente</p>

        <div className="space-y-4 text-sm text-brand-cream/80">
          <div className="rounded border border-brand-gray/40 bg-brand-gray/10 p-4">
            <p className="mb-1 text-xs uppercase tracking-widest text-brand-cream/50">Descripción</p>
            <p>{ingrediente.descripcion}</p>
          </div>
          <div className="rounded border border-brand-gray/40 bg-brand-gray/10 p-4">
            <p className="mb-1 text-xs uppercase tracking-widest text-brand-cream/50">Alérgeno</p>
            <p className={`text-lg font-bold ${ingrediente.es_alergeno ? 'text-red-300' : 'text-neon-amber'}`}>
              {ingrediente.es_alergeno ? 'Si' : 'No'}
            </p>
          </div>
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
