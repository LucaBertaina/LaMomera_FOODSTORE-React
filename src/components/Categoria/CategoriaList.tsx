import type { Categoria } from '../../types/categoria';

interface Props {
  categorias: Categoria[];
  onView: (cat: Categoria) => void;
  onEdit: (cat: Categoria) => void;
  onDelete: (categoria: Categoria) => void;
}

export const CategoriaList = ({ categorias, onView, onEdit, onDelete }: Props) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-brand-gray/40 bg-brand-gray/10">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-brand-gray/30 text-xs uppercase tracking-widest text-brand-cream/60">
          <tr>
            <th className="px-4 py-3">Nombre</th>
            <th className="px-4 py-3">Padre</th>
            <th className="px-4 py-3">Descripcion</th>
            <th className="px-4 py-3">Imagen</th>
            <th className="px-4 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map((categoria) => (
            <tr key={categoria.id} className="border-t border-brand-gray/30 text-brand-cream/90">
              <td className="px-4 py-3 font-semibold">{categoria.nombre}</td>
              <td className="px-4 py-3 text-brand-cream/70">{categoria.parent_id ?? '-'}</td>
              <td className="px-4 py-3 text-brand-cream/70">{categoria.descripcion}</td>
              <td className="px-4 py-3">
                {categoria.imagen_url ? (
                  <img
                    src={categoria.imagen_url}
                    alt={categoria.nombre}
                    className="h-10 w-16 rounded object-cover"
                  />
                ) : (
                  '-'
                )}
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap justify-end gap-2">
                  <button
                    onClick={() => onView(categoria)}
                    className="rounded border border-brand-cream/30 px-3 py-1 text-xs font-bold uppercase text-brand-cream transition-colors hover:border-neon-amber hover:text-neon-amber"
                  >
                    Vista
                  </button>
                  <button
                    onClick={() => onEdit(categoria)}
                    className="rounded border border-neon-amber/40 px-3 py-1 text-xs font-bold uppercase text-neon-amber transition-colors hover:bg-neon-amber hover:text-brand-dark"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(categoria)}
                    className="rounded border border-red-500/30 px-3 py-1 text-xs font-bold uppercase text-red-400 transition-colors hover:border-red-400 hover:text-red-300"
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};