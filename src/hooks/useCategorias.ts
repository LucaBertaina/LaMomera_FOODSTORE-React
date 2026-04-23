import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Categoria, CategoriaCreate, CategoriaTree } from '../types/categoria';

const CATEGORIAS_QUERY_KEY = ['categorias'];
const CATEGORIAS_TREE_QUERY_KEY = ['categorias', 'tree'];
const API_URL = '/api/categorias/';

async function fetchCategorias(): Promise<Categoria[]> {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Error al obtener las categorias');
  }

  return response.json();
}

async function fetchCategoriasArbol(): Promise<CategoriaTree[]> {
  const response = await fetch(`${API_URL}tree`);
  if (!response.ok) {
    throw new Error('Error al obtener el arbol de categorias');
  }

  return response.json();
}

async function createCategoria(data: CategoriaCreate): Promise<void> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Error al crear la categoria');
  }
}

async function updateCategoria(params: { id: number; data: CategoriaCreate }): Promise<void> {
  const response = await fetch(`${API_URL}${params.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params.data),
  });

  if (!response.ok) {
    throw new Error('Error al actualizar la categoria');
  }
}

async function deleteCategoria(id: number): Promise<void> {
  const response = await fetch(`${API_URL}${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Error al borrar la categoria');
  }
}

export const useCategorias = () => {
  const queryClient = useQueryClient();

  const categoriasQuery = useQuery({
    queryKey: CATEGORIAS_QUERY_KEY,
    queryFn: fetchCategorias,
  });

  const categoriasArbolQuery = useQuery({
    queryKey: CATEGORIAS_TREE_QUERY_KEY,
    queryFn: fetchCategoriasArbol,
  });

  const invalidateCategoriaQueries = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: CATEGORIAS_QUERY_KEY }),
      queryClient.invalidateQueries({ queryKey: CATEGORIAS_TREE_QUERY_KEY }),
    ]);
  };

  const createMutation = useMutation({
    mutationFn: createCategoria,
    onSuccess: invalidateCategoriaQueries,
  });

  const updateMutation = useMutation({
    mutationFn: updateCategoria,
    onSuccess: invalidateCategoriaQueries,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategoria,
    onSuccess: invalidateCategoriaQueries,
  });

  const handleCreate = async (data: CategoriaCreate) => {
    await createMutation.mutateAsync(data);
  };

  const handleUpdate = async (id: number, data: CategoriaCreate) => {
    await updateMutation.mutateAsync({ id, data });
  };

  const handleDelete = async (id: number) => {
    await deleteMutation.mutateAsync(id);
  };

  const combinedError = categoriasQuery.error ?? categoriasArbolQuery.error;

  return {
    categorias: categoriasQuery.data ?? [],
    categoriasArbol: categoriasArbolQuery.data ?? [],
    loading: categoriasQuery.isLoading || categoriasArbolQuery.isLoading,
    error: combinedError instanceof Error ? combinedError.message : null,
    isError: categoriasQuery.isError || categoriasArbolQuery.isError,
    handleCreate,
    handleUpdate,
    handleDelete,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
