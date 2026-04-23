import { useEffect, useState } from 'react';
import type { Categoria } from '../../types/categoria';
import type { Producto } from '../../types/producto';

interface Props {
  isOpen: boolean;
  producto: Producto | null;
  categorias: Categoria[];
  isLoadingCategorias: boolean;
  isSaving: boolean;
  isRemovingCategoriaId?: number | null;
  onClose: () => void;
  onAddCategoria: (categoriaId: number) => void;
  onRemoveCategoria: (categoriaId: number) => void;
}

export const ProductoCategoriasModal = ({
  isOpen,
  producto,
  categorias,
  isLoadingCategorias,
  isSaving,
  isRemovingCategoriaId = null,
  onClose,
  onAddCategoria,
  onRemoveCategoria,
}: Props) => {
  const [categoriaId, setCategoriaId] = useState('');

  useEffect(() => {
    if (isOpen) {
      setCategoriaId('');
    }
  }, [isOpen, producto]);

  if (!isOpen || !producto) return null;

  const categoriasAsignadas = producto.categorias;
  const categoriasAsignadasIds = new Set(categoriasAsignadas.map((categoria) => categoria.id));
  const categoriasDisponibles = categorias.filter((categoria) => !categoriasAsignadasIds.has(categoria.id));

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onAddCategoria(Number(categoriaId));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-neon-amber bg-brand-dark p-8 shadow-neon">
        <h2 className="mb-2 text-2xl font-bold uppercase italic tracking-tighter text-neon-amber">
          Categorías del producto
        </h2>
        <p className="mb-6 text-sm text-brand-cream/60">
          Producto: <span className="font-bold text-brand-cream">{producto.nombre}</span>
        </p>

        <div className="mb-6 rounded border border-brand-gray/40 bg-brand-gray/10 p-4">
          <p className="mb-3 text-xs uppercase tracking-widest text-brand-cream/50">Categorías asignadas</p>
          {categoriasAsignadas.length > 0 ? (
            <div className="space-y-2">
              {categoriasAsignadas.map((categoria) => (
                <div key={categoria.id} className="flex items-center justify-between gap-3 rounded border border-brand-gray/30 px-3 py-2">
                  <span className="text-sm text-brand-cream">{categoria.nombre}</span>
                  <button
                    type="button"
                    onClick={() => onRemoveCategoria(categoria.id)}
                    disabled={isSaving || isRemovingCategoriaId === categoria.id}
                    className="rounded border border-red-500/30 px-3 py-1 text-xs font-bold uppercase text-red-300 transition-colors hover:border-red-400 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isRemovingCategoriaId === categoria.id ? 'Eliminando...' : 'Eliminar categoría'}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-brand-cream/50">Todavía no tiene categorías asignadas.</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-xs uppercase tracking-widest text-brand-cream/60">Agregar categoría</label>
            <select
              required
              value={categoriaId}
              onChange={(event) => setCategoriaId(event.target.value)}
              disabled={isLoadingCategorias || isSaving || categoriasDisponibles.length === 0}
              className="w-full rounded border border-brand-gray/50 bg-brand-gray/20 p-3 text-brand-cream outline-none transition-all focus:border-neon-amber disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">Seleccionar categoría</option>
              {categoriasDisponibles.map((categoria) => (
                <option key={categoria.id} value={categoria.id} className="bg-brand-dark">
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </div>

          {isLoadingCategorias ? (
            <p className="text-sm text-brand-cream/50">Cargando categorías...</p>
          ) : categoriasDisponibles.length === 0 ? (
            <p className="text-sm text-red-300">No hay categorías disponibles.</p>
          ) : null}

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-6 py-2 text-sm font-bold uppercase text-brand-cream/50 transition-colors hover:text-brand-cream disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving || isLoadingCategorias || categoriasDisponibles.length === 0}
              className="rounded bg-neon-amber px-8 py-2 font-bold uppercase text-brand-dark transition-all hover:bg-neon-amber/80 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? 'Guardando...' : 'Agregar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};