import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Producto, ProductoCreate } from '../types/producto';

const PRODUCTOS_QUERY_KEY = ['productos'];
const API_URL = '/api/productos/';

async function fetchProductos(): Promise<Producto[]> {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Error al obtener los productos');
  }

  return response.json();
}

async function createProducto(data: ProductoCreate): Promise<void> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Error al crear el producto');
  }
}

async function deleteProducto(id: number): Promise<void> {
  const response = await fetch(`${API_URL}${id}`, { method: 'DELETE' });
  if (!response.ok) {
    throw new Error('Error al eliminar el producto');
  }
}

export const useProductos = () => {
  const queryClient = useQueryClient();

  const productosQuery = useQuery({
    queryKey: PRODUCTOS_QUERY_KEY,
    queryFn: fetchProductos,
  });

  const createMutation = useMutation({
    mutationFn: createProducto,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: PRODUCTOS_QUERY_KEY });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProducto,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: PRODUCTOS_QUERY_KEY });
    },
  });

  const handleCreate = async (data: ProductoCreate) => {
    await createMutation.mutateAsync(data);
  };

  const handleDelete = async (id: number) => {
    await deleteMutation.mutateAsync(id);
  };

  const productosActivos = (productosQuery.data ?? []).filter((producto) => !producto.borrado);

  return {
    productos: productosActivos,
    loading: productosQuery.isLoading,
    error: productosQuery.error,
    isError: productosQuery.isError,
    handleCreate,
    handleDelete,
    isCreating: createMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};