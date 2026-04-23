import type { Producto } from '../../types/producto';

interface Props {
  productos: Producto[];
  onView: (producto: Producto) => void;
  onEdit: (producto: Producto) => void;
  onAssignCategoria: (producto: Producto) => void;
  onDelete: (producto: Producto) => void;
}

export const ProductoList = ({ productos, onView, onEdit, onAssignCategoria, onDelete }: Props) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-brand-gray/40 bg-brand-gray/10">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-brand-gray/30 text-xs uppercase tracking-widest text-brand-cream/60">
          <tr>
            <th className="px-4 py-3">Nombre</th>
            <th className="px-4 py-3">Categorías</th>
            <th className="px-4 py-3">Precio</th>
            <th className="px-4 py-3">Stock</th>
            <th className="px-4 py-3">Disponible</th>
            <th className="px-4 py-3">Ingredientes</th>
            <th className="px-4 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => {
            const categoriasVisibles = producto.categorias ?? [];
            const ingredientesCount = producto.ingredientes_relacionados.length;

            return (
              <tr key={producto.id} className="border-t border-brand-gray/30 text-brand-cream/90">
                <td className="px-4 py-3 font-semibold">{producto.nombre}</td>
                <td className="px-4 py-3">
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
                    '-'
                  )}
                </td>
                <td className="px-4 py-3">${producto.precio_base}</td>
                <td className="px-4 py-3">{producto.stock_cantidad}</td>
                <td className="px-4 py-3">{producto.disponible ? 'Si' : 'No'}</td>
                <td className="px-4 py-3">{ingredientesCount}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap justify-end gap-2">
                    <button
                      onClick={() => onView(producto)}
                      className="rounded border border-brand-cream/30 px-3 py-1 text-xs font-bold uppercase text-brand-cream transition-colors hover:border-neon-amber hover:text-neon-amber"
                    >
                      Vista
                    </button>
                    <button
                      onClick={() => onEdit(producto)}
                      className="rounded border border-neon-amber/40 px-3 py-1 text-xs font-bold uppercase text-neon-amber transition-colors hover:bg-neon-amber hover:text-brand-dark"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => onAssignCategoria(producto)}
                      className="rounded border border-brand-cream/30 px-3 py-1 text-xs font-bold uppercase text-brand-cream transition-colors hover:bg-brand-cream hover:text-brand-dark"
                    >
                      Categoria
                    </button>
                    <button
                      onClick={() => onDelete(producto)}
                      className="rounded border border-red-500/30 px-3 py-1 text-xs font-bold uppercase text-red-400 transition-colors hover:border-red-400 hover:text-red-300"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};