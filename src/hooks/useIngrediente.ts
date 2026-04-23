import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Ingrediente, IngredienteCreate } from '../types/ingrediente';

const INGREDIENTES_QUERY_KEY = ['ingredientes'];
const API_URL = '/api/ingredientes/';

async function fetchIngredientes(): Promise<Ingrediente[]> {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Error al obtener los ingredientes');
  }

  return response.json();
}

async function createIngrediente(data: IngredienteCreate) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Error al crear el ingrediente');
  }
}

async function updateIngrediente(params: { id: number; data: IngredienteCreate }) {
  const response = await fetch(`${API_URL}${params.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params.data),
  });

  if (!response.ok) {
    throw new Error('Error al actualizar el ingrediente');
  }
}

async function deleteIngrediente(ingrediente: Ingrediente) {
  const response = await fetch(`${API_URL}${ingrediente.id}`, { method: 'DELETE' });

  if (response.status === 404) {
    throw new Error('Ya fue eliminado o no existe.');
  }

  if (!response.ok) {
    throw new Error('Error al eliminar el ingrediente');
  }
}

export const useIngrediente = () => {
  const queryClient = useQueryClient();

  const ingredientesQuery = useQuery({
    queryKey: INGREDIENTES_QUERY_KEY,
    queryFn: fetchIngredientes,
  });

  const createMutation = useMutation({
    mutationFn: createIngrediente,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: INGREDIENTES_QUERY_KEY });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateIngrediente,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: INGREDIENTES_QUERY_KEY });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteIngrediente,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: INGREDIENTES_QUERY_KEY });
    },
  });

  const ingredientesActivos = (ingredientesQuery.data ?? []).filter((ingrediente) => !ingrediente.borrado);

  const saveIngrediente = (data: IngredienteCreate, ingredienteEnEdicion: Ingrediente | null) => {
    if (ingredienteEnEdicion) {
      updateMutation.mutate({ id: ingredienteEnEdicion.id, data });
      return;
    }

    createMutation.mutate(data);
  };

  return {
    ingredientesActivos,
    isLoading: ingredientesQuery.isLoading,
    isError: ingredientesQuery.isError,
    saveIngrediente,
    deleteIngrediente: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,
  };
};