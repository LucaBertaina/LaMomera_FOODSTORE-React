import type { Producto } from '../../types/producto';

interface Props {
  isOpen: boolean;
  producto: Producto | null;
  onClose: () => void;
}

export const ProductoDetailModal = ({ isOpen, producto, onClose }: Props) => {
  if (!isOpen || !producto) {
    return null;
  }

  const categoriasVisibles = producto.categorias ?? [];
  const ingredientesRelacionados = producto.ingredientes_relacionados;
  const imagenVisible = producto.imagen_url[0] || 'https://via.placeholder.com/800x450?text=Sin+imagen';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-xl border border-neon-amber bg-brand-dark p-8 shadow-neon">
        <h2 className="mb-1 text-2xl font-bold uppercase italic tracking-tighter text-neon-amber">{producto.nombre}</h2>
        <p className="mb-6 text-xs uppercase tracking-[0.28em] text-brand-cream/50">Detalle de producto</p>

        <div className="space-y-4 text-sm text-brand-cream/80">
          <div className="overflow-hidden rounded border border-brand-gray/40 bg-brand-gray/10">
            <img
              src={imagenVisible}
              alt={producto.nombre}
              className="h-64 w-full object-cover"
            />
          </div>

          <div className="rounded border border-brand-gray/40 bg-brand-gray/10 p-4">
            <p className="mb-1 text-xs uppercase tracking-widest text-brand-cream/50">Descripcion</p>
            <p>{producto.descripcion}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded border border-brand-gray/40 bg-brand-gray/10 p-4">
              <p className="mb-1 text-xs uppercase tracking-widest text-brand-cream/50">Precio base</p>
              <p className="font-semibold text-neon-amber">${producto.precio_base}</p>
            </div>
            <div className="rounded border border-brand-gray/40 bg-brand-gray/10 p-4">
              <p className="mb-1 text-xs uppercase tracking-widest text-brand-cream/50">Stock</p>
              <p>{producto.stock_cantidad}</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded border border-brand-gray/40 bg-brand-gray/10 p-4">
              <p className="mb-1 text-xs uppercase tracking-widest text-brand-cream/50">Categorías</p>
              {categoriasVisibles.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {categoriasVisibles.map((categoria) => (
                    <span
                      key={categoria.id}
                      className="rounded-full border border-neon-amber/30 px-2 py-1 text-[11px] font-bold uppercase text-neon-amber"
                    >
                      {categoria.nombre}
                    </span>
                  ))}
                </div>
              ) : (
                <p>Sin categorías</p>
              )}
            </div>
            <div className="rounded border border-brand-gray/40 bg-brand-gray/10 p-4">
              <p className="mb-1 text-xs uppercase tracking-widest text-brand-cream/50">Estado</p>
              <p>{producto.disponible ? 'Disponible' : 'No disponible'}</p>
            </div>
          </div>

          <div className="rounded border border-brand-gray/40 bg-brand-gray/10 p-4">
            <p className="mb-2 text-xs uppercase tracking-widest text-brand-cream/50">Ingredientes</p>
            {ingredientesRelacionados.length > 0 ? (
              <ul className="space-y-1">
                {ingredientesRelacionados.map((ingrediente) => (
                  <li key={ingrediente.id}>
                    - {ingrediente.nombre}
                    {ingrediente.es_alergeno ? ' (alérgeno)' : ''}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Sin ingredientes asociados.</p>
            )}
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