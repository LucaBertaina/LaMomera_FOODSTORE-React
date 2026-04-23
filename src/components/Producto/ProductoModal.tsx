import { useEffect, useState } from 'react';
import type { Categoria } from '../../types/categoria';
import type { Ingrediente } from '../../types/ingrediente';
import type { Producto, ProductoCreate, ProductoUpdate } from '../../types/producto';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (producto: ProductoCreate | ProductoUpdate, ingredienteIds: number[]) => void;
  categoriasDisponibles: Categoria[];
  isLoadingCategorias: boolean;
  ingredientesDisponibles: Ingrediente[];
  productoParaEditar?: Producto | null;
}

const emptyProducto = {
  nombre: '',
  descripcion: '',
  precio_base: '',
  stock_cantidad: 0,
  imagen_url: '',
  disponible: true,
  categoria_id: '',
  ingrediente_ids: [] as number[],
};

export const ProductoModal = ({
  isOpen,
  onClose,
  onSubmit,
  categoriasDisponibles,
  isLoadingCategorias,
  ingredientesDisponibles,
  productoParaEditar,
}: Props) => {
  const [form, setForm] = useState(emptyProducto);

  useEffect(() => {
    if (productoParaEditar) {
      const categoriaSeleccionada = productoParaEditar.categorias?.[0]?.id ?? '';

      setForm({
        nombre: productoParaEditar.nombre,
        descripcion: productoParaEditar.descripcion,
        precio_base: String(productoParaEditar.precio_base),
        stock_cantidad: productoParaEditar.stock_cantidad,
        imagen_url: productoParaEditar.imagen_url.join(', '),
        disponible: productoParaEditar.disponible,
        categoria_id: String(categoriaSeleccionada),
        ingrediente_ids: productoParaEditar.ingredientes_relacionados?.map((ingrediente) => ingrediente.id) ?? [],
      });
    } else if (isOpen) {
      setForm(emptyProducto);
    }
  }, [productoParaEditar, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payloadBase = {
      nombre: form.nombre,
      descripcion: form.descripcion,
      precio_base: form.precio_base,
      imagen_url: form.imagen_url
        .split(',')
        .map((url) => url.trim())
        .filter(Boolean),
      stock_cantidad: Number(form.stock_cantidad) || 0,
      disponible: form.disponible,
    };

    if (productoParaEditar) {
      onSubmit(payloadBase, form.ingrediente_ids);
    } else {
      onSubmit(
        {
          ...payloadBase,
          categoria_ids: form.categoria_id ? [Number(form.categoria_id)] : [],
        },
        form.ingrediente_ids,
      );
    }

    onClose();
  };

  const toggleIngrediente = (ingredienteId: number) => {
    setForm((current) => {
      const exists = current.ingrediente_ids.includes(ingredienteId);
      return {
        ...current,
        ingrediente_ids: exists
          ? current.ingrediente_ids.filter((id) => id !== ingredienteId)
          : [...current.ingrediente_ids, ingredienteId],
      };
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-neon-amber bg-brand-dark p-8 shadow-neon">
        <h2 className="mb-6 text-2xl font-bold uppercase italic tracking-tighter text-neon-amber">
          {productoParaEditar ? 'Editar producto' : 'Nuevo producto'}
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

          <div>
            <label className="mb-2 block text-xs uppercase tracking-widest text-brand-cream/60">Precio base</label>
            <input
              type="text"
              required
              value={form.precio_base}
              onChange={(event) => setForm((current) => ({ ...current, precio_base: event.target.value }))}
              className="w-full rounded border border-brand-gray/50 bg-brand-gray/20 p-3 text-brand-cream outline-none transition-all focus:border-neon-amber"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs uppercase tracking-widest text-brand-cream/60">Categoría</label>
            <select
              required={!productoParaEditar}
              value={form.categoria_id}
              onChange={(event) => setForm((current) => ({ ...current, categoria_id: event.target.value }))}
              disabled={isLoadingCategorias || categoriasDisponibles.length === 0}
              className="w-full rounded border border-brand-gray/50 bg-brand-gray/20 p-3 text-brand-cream outline-none transition-all focus:border-neon-amber disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">Seleccionar categoría</option>
              {categoriasDisponibles.map((categoria) => (
                <option key={categoria.id} value={categoria.id} className="bg-brand-dark">
                  {categoria.nombre}
                </option>
              ))}
            </select>
            {isLoadingCategorias ? (
              <p className="mt-2 text-xs text-brand-cream/50">Cargando categorías...</p>
            ) : categoriasDisponibles.length === 0 ? (
              <p className="mt-2 text-xs text-red-300">No hay categorías disponibles.</p>
            ) : productoParaEditar ? (
              <p className="mt-2 text-xs text-brand-cream/50">Para asignar múltiples categorías usá el botón "Categoría" de la tabla.</p>
            ) : null}
          </div>

          <div>
            <label className="mb-2 block text-xs uppercase tracking-widest text-brand-cream/60">Stock</label>
            <input
              type="number"
              min={0}
              required
              value={form.stock_cantidad}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  stock_cantidad: Number(event.target.value),
                }))
              }
              className="w-full rounded border border-brand-gray/50 bg-brand-gray/20 p-3 text-brand-cream outline-none transition-all focus:border-neon-amber"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs uppercase tracking-widest text-brand-cream/60">Imágenes</label>
            <input
              type="text"
              placeholder="URL1, URL2"
              value={form.imagen_url}
              onChange={(event) => setForm((current) => ({ ...current, imagen_url: event.target.value }))}
              className="w-full rounded border border-brand-gray/50 bg-brand-gray/20 p-3 text-brand-cream outline-none transition-all focus:border-neon-amber"
            />
          </div>

          <label className="flex items-center gap-3 text-sm text-brand-cream/80">
            <input
              type="checkbox"
              checked={form.disponible}
              onChange={(event) => setForm((current) => ({ ...current, disponible: event.target.checked }))}
              className="h-4 w-4 accent-neon-amber"
            />
            Disponible
          </label>

          <div>
            <label className="mb-2 block text-xs uppercase tracking-widest text-brand-cream/60">
              Ingredientes asociados
            </label>
            <div className="max-h-36 space-y-2 overflow-y-auto rounded border border-brand-gray/50 bg-brand-gray/20 p-3">
              {ingredientesDisponibles.length === 0 ? (
                <p className="text-xs text-brand-cream/50">No hay ingredientes cargados.</p>
              ) : (
                ingredientesDisponibles.map((ingrediente) => (
                  <label key={ingrediente.id} className="flex items-center gap-2 text-sm text-brand-cream/80">
                    <input
                      type="checkbox"
                      checked={form.ingrediente_ids.includes(ingrediente.id)}
                      onChange={() => toggleIngrediente(ingrediente.id)}
                      className="h-4 w-4 accent-neon-amber"
                    />
                    {ingrediente.nombre}
                    {ingrediente.es_alergeno ? <span className="text-xs text-red-300">(alérgeno)</span> : null}
                  </label>
                ))
              )}
            </div>
          </div>

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