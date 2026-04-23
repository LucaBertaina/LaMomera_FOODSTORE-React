import { useEffect, useState } from 'react';
import type { Ingrediente, IngredienteCreate } from '../../types/ingrediente';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (ingrediente: IngredienteCreate) => void;
  ingredienteParaEditar?: Ingrediente | null;
}

const emptyIngrediente = {
  nombre: '',
  descripcion: '',
  es_alergeno: false,
};

export const IngredienteModal = ({ isOpen, onClose, onSubmit, ingredienteParaEditar }: Props) => {
  const [form, setForm] = useState(emptyIngrediente);

  useEffect(() => {
    if (ingredienteParaEditar) {
      setForm({
        nombre: ingredienteParaEditar.nombre,
        descripcion: ingredienteParaEditar.descripcion,
        es_alergeno: ingredienteParaEditar.es_alergeno,
      });
    } else if (isOpen) {
      setForm(emptyIngrediente);
    }
  }, [ingredienteParaEditar, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({
      nombre: form.nombre,
      descripcion: form.descripcion,
      es_alergeno: form.es_alergeno,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-neon-amber bg-brand-dark p-8 shadow-neon">
        <h2 className="mb-6 text-2xl font-bold uppercase italic tracking-tighter text-neon-amber">
          {ingredienteParaEditar ? 'Editar ingrediente' : 'Nuevo ingrediente'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-xs uppercase tracking-widest text-brand-cream/60">Nombre</label>
            <input
              type="text"
              required
              value={form.nombre}
              onChange={(event) => setForm((current) => ({ ...current, nombre: event.target.value }))}
              className="w-full rounded border border-brand-gray/50 bg-brand-gray/20 p-3 text-brand-cream outline-none transition-all focus:border-neon-amber"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs uppercase tracking-widest text-brand-cream/60">Descripción</label>
            <textarea
              required
              value={form.descripcion}
              onChange={(event) => setForm((current) => ({ ...current, descripcion: event.target.value }))}
              className="h-28 w-full resize-none rounded border border-brand-gray/50 bg-brand-gray/20 p-3 text-brand-cream outline-none transition-all focus:border-neon-amber"
            />
          </div>

          <label className="flex items-center gap-3 text-sm text-brand-cream/80">
            <input
              type="checkbox"
              checked={form.es_alergeno}
              onChange={(event) => setForm((current) => ({ ...current, es_alergeno: event.target.checked }))}
              className="h-4 w-4 accent-neon-amber"
            />
            Es alérgeno
          </label>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-sm font-bold uppercase text-brand-cream/50 transition-colors hover:text-brand-cream"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded bg-neon-amber px-8 py-2 font-bold uppercase text-brand-dark transition-all hover:bg-neon-amber/80"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
