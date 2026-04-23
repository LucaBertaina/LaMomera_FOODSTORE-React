import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CategoriaDetailModal } from '../components/Categoria/CategoriaDetailModal';
import { CategoriaList } from '../components/Categoria/CategoriaList';
import { CategoriaModal } from '../components/Categoria/CategoriaModal';
import { DeleteConfirmModal } from '../components/Shared/DeleteConfirmModal';
import type { Categoria, CategoriaCreate } from '../types/categoria';

const CATEGORIAS_QUERY_KEY = ['categorias'];
const API_URL = '/api/categorias/';

async function fetchCategorias(): Promise<Categoria[]> {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Error al obtener las categorías');
  }

  return response.json();
}

async function createCategoria(data: CategoriaCreate) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Error al crear la categoría');
  }
}

async function updateCategoria(params: { id: number; data: CategoriaCreate }) {
  const response = await fetch(`${API_URL}${params.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params.data),
  });

  if (!response.ok) {
    throw new Error('Error al actualizar la categoría');
  }
}

async function deleteCategoria(categoria: Categoria) {
  const response = await fetch(`${API_URL}${categoria.id}`, { method: 'DELETE' });

  if (response.status === 404) {
    throw new Error('Ya fue eliminado o no existe.');
  }

  if (!response.ok) {
    throw new Error('Error al eliminar la categoría');
  }
}

export const CategoriasPage = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoriaEnEdicion, setCategoriaEnEdicion] = useState<Categoria | null>(null);
  const [categoriaDetalle, setCategoriaDetalle] = useState<Categoria | null>(null);
  const [categoriaParaEliminar, setCategoriaParaEliminar] = useState<Categoria | null>(null);
  const [errorEliminacion, setErrorEliminacion] = useState<string | null>(null);

  const categoriasQuery = useQuery({
    queryKey: CATEGORIAS_QUERY_KEY,
    queryFn: fetchCategorias,
  });

  const createMutation = useMutation({
    mutationFn: createCategoria,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: CATEGORIAS_QUERY_KEY });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateCategoria,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: CATEGORIAS_QUERY_KEY });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategoria,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: CATEGORIAS_QUERY_KEY });
      setCategoriaParaEliminar(null);
      setErrorEliminacion(null);
    },
    onError: (error: unknown) => {
      setCategoriaParaEliminar(null);
      setErrorEliminacion(error instanceof Error ? error.message : 'Error al eliminar la categoría');
    },
  });

  const openNewCategoriaModal = () => {
    setCategoriaEnEdicion(null);
    setIsModalOpen(true);
  };

  const openEditCategoriaModal = (categoria: Categoria) => {
    setCategoriaEnEdicion(categoria);
    setIsModalOpen(true);
  };

  const openDeleteCategoriaModal = (categoria: Categoria) => {
    setCategoriaParaEliminar(categoria);
    setErrorEliminacion(null);
  };

  const categoriasActivas = (categoriasQuery.data ?? []).filter((categoria) => !categoria.borrado);

  const handleSubmit = (data: CategoriaCreate) => {
    if (categoriaEnEdicion) {
      updateMutation.mutate({ id: categoriaEnEdicion.id, data });
    } else {
      createMutation.mutate(data);
    }

    setIsModalOpen(false);
    setCategoriaEnEdicion(null);
  };

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-4xl font-black uppercase italic tracking-tighter">Categorías</h2>
          <p className="text-brand-cream/40 text-sm tracking-[0.3em] uppercase">Gestión de menú</p>
        </div>

        <button
          onClick={openNewCategoriaModal}
          className="rounded-full border-2 border-neon-amber bg-transparent px-6 py-2 text-xs font-bold uppercase text-neon-amber shadow-neon transition-all hover:bg-neon-amber hover:text-brand-dark"
        >
          Nueva categoría
        </button>
      </div>

      {categoriasQuery.isLoading ? (
        <div className="py-20 text-center font-bold uppercase tracking-widest text-neon-amber animate-pulse">
          Sincronizando categorías...
        </div>
      ) : categoriasQuery.isError ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-6 text-red-300">
          No se pudieron cargar las categorías.
        </div>
      ) : (
        <CategoriaList
          categorias={categoriasActivas}
          onView={setCategoriaDetalle}
          onEdit={openEditCategoriaModal}
          onDelete={openDeleteCategoriaModal}
        />
      )}

      {errorEliminacion ? (
        <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {errorEliminacion}
        </div>
      ) : null}

      <CategoriaModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setCategoriaEnEdicion(null);
        }}
        onSubmit={handleSubmit}
        categoriasDisponibles={categoriasActivas}
        categoriaParaEditar={categoriaEnEdicion}
      />

      <CategoriaDetailModal
        isOpen={categoriaDetalle !== null}
        categoria={categoriaDetalle}
        onClose={() => setCategoriaDetalle(null)}
      />

      <DeleteConfirmModal
        isOpen={categoriaParaEliminar !== null}
        title="Eliminar categoría"
        description={
          categoriaParaEliminar
            ? `Vas a eliminar "${categoriaParaEliminar.nombre}". El backend la marcará como borrada.`
            : ''
        }
        isConfirming={deleteMutation.isPending}
        onClose={() => setCategoriaParaEliminar(null)}
        onConfirm={() => {
          if (categoriaParaEliminar) {
            deleteMutation.mutate(categoriaParaEliminar);
          }
        }}
      />
    </main>
  );
};