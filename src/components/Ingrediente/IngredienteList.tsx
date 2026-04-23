import type { Ingrediente } from '../../types/ingrediente';

interface Props {
  ingredientes: Ingrediente[];
  onEdit: (ingrediente: Ingrediente) => void;
  onView: (ingrediente: Ingrediente) => void;
  onDelete: (ingrediente: Ingrediente) => void;
}

export const IngredienteList = ({ ingredientes, onEdit, onView, onDelete }: Props) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-brand-gray/40 bg-brand-gray/10">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-brand-gray/30 text-xs uppercase tracking-widest text-brand-cream/60">
          <tr>
            <th className="px-4 py-3">Nombre</th>
            <th className="px-4 py-3">Descripción</th>
            <th className="px-4 py-3">Alérgeno</th>
            <th className="px-4 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ingredientes.map((ingrediente) => (
            <tr key={ingrediente.id} className="border-t border-brand-gray/30 text-brand-cream/90">
              <td className="px-4 py-3 font-semibold">{ingrediente.nombre}</td>
              <td className="px-4 py-3 text-brand-cream/70">{ingrediente.descripcion}</td>
              <td className="px-4 py-3">{ingrediente.es_alergeno ? 'Si' : 'No'}</td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap justify-end gap-2">
                  <button
                    onClick={() => onView(ingrediente)}
                    className="rounded border border-brand-cream/30 px-3 py-1 text-xs font-bold uppercase text-brand-cream transition-colors hover:border-neon-amber hover:text-neon-amber"
                  >
                    Vista
                  </button>
                  <button
                    onClick={() => onEdit(ingrediente)}
                    className="rounded border border-neon-amber/40 px-3 py-1 text-xs font-bold uppercase text-neon-amber transition-colors hover:bg-neon-amber hover:text-brand-dark"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(ingrediente)}
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
