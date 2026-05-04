import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { IngredienteDetailModal } from '../components/Ingrediente/IngredienteDetailModal';
import { IngredienteList } from '../components/Ingrediente/IngredienteList';
import { IngredienteModal } from '../components/Ingrediente/IngredienteModal';
import { DeleteConfirmModal } from '../components/Shared/DeleteConfirmModal';
import { Navbar } from '../components/Navbar/NavbarComponent';
import type { Ingrediente, IngredienteCreate } from '../types/ingrediente';
import { deleteIngredientRequest, fetchIngredients, saveIngredientRequest } from '../api/ingrediente.service';

const INGREDIENTS_QUERY_KEY = ['ingredientes'];

export const IngredientesPage = () => {
  const queryClient = useQueryClient();

  const ingredientsQuery = useQuery({
    queryKey: INGREDIENTS_QUERY_KEY,
    queryFn: fetchIngredients,
  });

  const invalidateIngredients = async () => {
    await queryClient.invalidateQueries({ queryKey: INGREDIENTS_QUERY_KEY });
  };

  const saveIngredientMutation = useMutation({
    mutationFn: saveIngredientRequest,
    onSuccess: invalidateIngredients,
  });

  const deleteIngredientMutation = useMutation({
    mutationFn: deleteIngredientRequest,
    onSuccess: invalidateIngredients,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ingredienteEnEdicion, setIngredienteEnEdicion] = useState<Ingrediente | null>(null);
  const [ingredienteDetalle, setIngredienteDetalle] = useState<Ingrediente | null>(null);
  const [ingredienteParaEliminar, setIngredienteParaEliminar] = useState<Ingrediente | null>(null);
  const [errorEliminacion, setErrorEliminacion] = useState<string | null>(null);

  const ingredientesActivos = (ingredientsQuery.data ?? []).filter((ingrediente) => !ingrediente.borrado);
  const isLoading = ingredientsQuery.isLoading;
  const isError = ingredientsQuery.isError;

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
    saveIngredientMutation.mutate({
      ingredientId: ingredienteEnEdicion?.id,
      data,
    });

    setIsModalOpen(false);
    setIngredienteEnEdicion(null);
  };

  const handleDeleteConfirm = () => {
    if (!ingredienteParaEliminar) {
      return;
    }

    deleteIngredientMutation.mutate(ingredienteParaEliminar, {
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
    <>
      <Navbar />
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

      {errorEliminacion || deleteIngredientMutation.error ? (
        <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {errorEliminacion ?? (deleteIngredientMutation.error instanceof Error ? deleteIngredientMutation.error.message : 'Error al eliminar el ingrediente')}
        </div>
      ) : null}

      {isModalOpen ? (
        <IngredienteModal
          key={ingredienteEnEdicion?.id ?? 'new-ingrediente'}
          isOpen={true}
          onClose={() => {
            setIsModalOpen(false);
            setIngredienteEnEdicion(null);
          }}
          onSubmit={handleSubmit}
          ingredienteParaEditar={ingredienteEnEdicion}
        />
      ) : null}

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
        isConfirming={deleteIngredientMutation.isPending}
        onClose={() => setIngredienteParaEliminar(null)}
        onConfirm={handleDeleteConfirm}
      />
      </main>
    </>
  );
};
