import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CategoriaDetailModal } from '../components/Categoria/CategoriaDetailModal';
import { CategoriaList } from '../components/Categoria/CategoriaList';
import { CategoriaModal } from '../components/Categoria/CategoriaModal';
import { DeleteConfirmModal } from '../components/Shared/DeleteConfirmModal';
import { Navbar } from '../components/Navbar/NavbarComponent';
import type { Categoria, CategoriaCreate } from '../types/categoria';
import { deleteCategoryRequest, fetchCategories, saveCategoryRequest } from '../api/categoria.service';

const CATEGORIES_QUERY_KEY = ['categorias'];
const CATEGORIES_TREE_QUERY_KEY = ['categorias', 'tree'];

export const CategoriasPage = () => {
  const queryClient = useQueryClient();

  const categoriesQuery = useQuery({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: fetchCategories,
  });

  const invalidateCategories = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY }),
      queryClient.invalidateQueries({ queryKey: CATEGORIES_TREE_QUERY_KEY }),
    ]);
  };

  const saveCategoryMutation = useMutation({
    mutationFn: saveCategoryRequest,
    onSuccess: invalidateCategories,
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: deleteCategoryRequest,
    onSuccess: invalidateCategories,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoriaEnEdicion, setCategoriaEnEdicion] = useState<Categoria | null>(null);
  const [categoriaDetalle, setCategoriaDetalle] = useState<Categoria | null>(null);
  const [categoriaParaEliminar, setCategoriaParaEliminar] = useState<Categoria | null>(null);
  const [errorEliminacion, setErrorEliminacion] = useState<string | null>(null);

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

  const categoriasActivas = (categoriesQuery.data ?? []).filter((categoria) => !categoria.borrado);

  const handleSubmit = (data: CategoriaCreate) => {
    saveCategoryMutation.mutate({
      categoryId: categoriaEnEdicion?.id,
      data,
    });

    setIsModalOpen(false);
    setCategoriaEnEdicion(null);
  };

  return (
    <>
      <Navbar />
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

      {categoriesQuery.isLoading ? (
        <div className="py-20 text-center font-bold uppercase tracking-widest text-neon-amber animate-pulse">
          Sincronizando categorías...
        </div>
      ) : categoriesQuery.isError ? (
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

      {isModalOpen ? (
        <CategoriaModal
          key={categoriaEnEdicion?.id ?? 'new-categoria'}
          isOpen={true}
          onClose={() => {
            setIsModalOpen(false);
            setCategoriaEnEdicion(null);
          }}
          onSubmit={handleSubmit}
          categoriasDisponibles={categoriasActivas}
          categoriaParaEditar={categoriaEnEdicion}
        />
      ) : null}

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
        isConfirming={deleteCategoryMutation.isPending}
        onClose={() => setCategoriaParaEliminar(null)}
        onConfirm={() => {
          if (categoriaParaEliminar) {
            deleteCategoryMutation.mutate(categoriaParaEliminar, {
              onSuccess: () => {
                setCategoriaParaEliminar(null);
                setErrorEliminacion(null);
              },
              onError: (error: unknown) => {
                setCategoriaParaEliminar(null);
                setErrorEliminacion(error instanceof Error ? error.message : 'Error al eliminar la categoría');
              },
            });
          }
        }}
      />
      </main>
    </>
  );
};