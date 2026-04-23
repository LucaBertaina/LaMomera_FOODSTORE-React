import { useState } from 'react';
import { IngredienteDetailModal } from '../components/Ingrediente/IngredienteDetailModal';
import { IngredienteList } from '../components/Ingrediente/IngredienteList';
import { IngredienteModal } from '../components/Ingrediente/IngredienteModal';
import { DeleteConfirmModal } from '../components/Shared/DeleteConfirmModal';
import { useIngrediente } from '../hooks/useIngrediente';
import type { Ingrediente, IngredienteCreate } from '../types/ingrediente';

export const IngredientesPage = () => {
  const { ingredientesActivos, isLoading, isError, saveIngrediente, deleteIngrediente, isDeleting, deleteError } =
    useIngrediente();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ingredienteEnEdicion, setIngredienteEnEdicion] = useState<Ingrediente | null>(null);
  const [ingredienteDetalle, setIngredienteDetalle] = useState<Ingrediente | null>(null);
  const [ingredienteParaEliminar, setIngredienteParaEliminar] = useState<Ingrediente | null>(null);
  const [errorEliminacion, setErrorEliminacion] = useState<string | null>(null);

  const openNewIngredienteModal = () => {
    setIngredienteEnEdicion(null);
    setIsModalOpen(true);
  };

  const openEditIngredienteModal = (ingrediente: Ingrediente) => {
    setIngredienteEnEdicion(ingrediente);
    setIsModalOpen(true);
  };

  const openDeleteIngredienteModal = (ingrediente: Ingrediente) => {
    setIngredienteParaEliminar(ingrediente);
    setErrorEliminacion(null);
  };

  const handleSubmit = (data: IngredienteCreate) => {
    saveIngrediente(data, ingredienteEnEdicion);

    setIsModalOpen(false);
    setIngredienteEnEdicion(null);
  };

  const handleDeleteConfirm = () => {
    if (!ingredienteParaEliminar) {
      return;
    }

    deleteIngrediente(ingredienteParaEliminar, {
      onSuccess: () => {
        setIngredienteParaEliminar(null);
        setErrorEliminacion(null);
      },
      onError: (error: unknown) => {
        setIngredienteParaEliminar(null);
        setErrorEliminacion(error instanceof Error ? error.message : 'Error al eliminar el ingrediente');
      },
    });
  };

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-4xl font-black uppercase italic tracking-tighter">Ingredientes</h2>
          <p className="text-sm uppercase tracking-[0.3em] text-brand-cream/40">Administración de ingredientes y alérgenos</p>
        </div>

        <button
          onClick={openNewIngredienteModal}
          className="rounded-full border-2 border-neon-amber bg-transparent px-6 py-2 text-xs font-bold uppercase text-neon-amber shadow-neon transition-all hover:bg-neon-amber hover:text-brand-dark"
        >
          Nuevo ingrediente
        </button>
      </div>

      {isLoading ? (
        <div className="animate-pulse py-20 text-center font-bold uppercase tracking-widest text-neon-amber">
          Sincronizando ingredientes...
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-6 text-red-300">
          No se pudieron cargar los ingredientes.
        </div>
      ) : (
        <IngredienteList
          ingredientes={ingredientesActivos}
          onEdit={openEditIngredienteModal}
          onView={setIngredienteDetalle}
          onDelete={openDeleteIngredienteModal}
        />
      )}

      {errorEliminacion || deleteError ? (
        <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {errorEliminacion ?? (deleteError instanceof Error ? deleteError.message : 'Error al eliminar el ingrediente')}
        </div>
      ) : null}

      <IngredienteModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setIngredienteEnEdicion(null);
        }}
        onSubmit={handleSubmit}
        ingredienteParaEditar={ingredienteEnEdicion}
      />

      <IngredienteDetailModal
        isOpen={ingredienteDetalle !== null}
        ingrediente={ingredienteDetalle}
        onClose={() => setIngredienteDetalle(null)}
      />

      <DeleteConfirmModal
        isOpen={ingredienteParaEliminar !== null}
        title="Eliminar ingrediente"
        description={
          ingredienteParaEliminar
            ? `Vas a eliminar "${ingredienteParaEliminar.nombre}". El backend la marcará como borrada.`
            : ''
        }
        isConfirming={isDeleting}
        onClose={() => setIngredienteParaEliminar(null)}
        onConfirm={handleDeleteConfirm}
      />
    </main>
  );
};
