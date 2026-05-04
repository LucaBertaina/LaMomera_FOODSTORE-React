import type { Producto, ProductoCreate, ProductoUpdate } from '../types/producto';

const PRODUCTS_API_URL = '/api/productos/';

export async function fetchProducts(): Promise<Producto[]> {
  const response = await fetch(PRODUCTS_API_URL);
  if (!response.ok) {
    throw new Error(`Error al obtener los productos (HTTP ${response.status})`);
  }

  return response.json();
}

export async function createProductRequest(data: ProductoCreate): Promise<Producto> {
  const response = await fetch(PRODUCTS_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Error al crear el producto');
  }

  return response.json();
}

export async function updateProductRequest(params: { id: number; data: ProductoUpdate }): Promise<Producto> {
  const response = await fetch(`${PRODUCTS_API_URL}${params.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params.data),
  });

  if (!response.ok) {
    throw new Error('Error al actualizar el producto');
  }

  return response.json();
}

export async function deleteProductRequest(product: Producto): Promise<void> {
  const response = await fetch(`${PRODUCTS_API_URL}${product.id}`, { method: 'DELETE' });

  if (response.status === 404) {
    throw new Error('Ya fue eliminado o no existe.');
  }

  if (!response.ok) {
    throw new Error('Error al eliminar el producto');
  }
}

export async function assignCategoryToProductRequest(params: { productoId: number; categoriaId: number }): Promise<void> {
  const response = await fetch(`${PRODUCTS_API_URL}${params.productoId}/categorias`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ categoria_id: params.categoriaId }),
  });

  if (!response.ok) {
    throw new Error('Error al asignar la categoria al producto');
  }
}

export async function removeCategoryFromProductRequest(params: { productoId: number; categoriaId: number }): Promise<void> {
  const response = await fetch(`${PRODUCTS_API_URL}${params.productoId}/categorias/${params.categoriaId}`, {
    method: 'DELETE',
  });

  if (response.status === 404) {
    throw new Error('La categoria ya fue eliminada o no existe.');
  }

  if (!response.ok) {
    throw new Error('Error al eliminar la categoria del producto');
  }
}

export async function assignIngredientToProductRequest(params: { productoId: number; ingredienteId: number }): Promise<void> {
  const response = await fetch(`${PRODUCTS_API_URL}${params.productoId}/ingredientes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ingrediente_id: params.ingredienteId }),
  });

  if (!response.ok) {
    throw new Error('Error al asignar el ingrediente al producto');
  }
}

type SaveProductRequestParams = {
  productId?: number;
  data: ProductoCreate | ProductoUpdate;
  ingredientIds?: number[];
};

export async function saveProductRequest(params: SaveProductRequestParams): Promise<Producto> {
  let savedProduct: Producto;

  if (params.productId) {
    savedProduct = await updateProductRequest({ id: params.productId, data: params.data as ProductoUpdate });
  } else {
    savedProduct = await createProductRequest(params.data as ProductoCreate);
  }

  const ingredientIds = params.ingredientIds ?? [];
  if (ingredientIds.length > 0) {
    await Promise.all(
      ingredientIds.map((ingredienteId) =>
        assignIngredientToProductRequest({
          productoId: savedProduct.id,
          ingredienteId,
        }),
      ),
    );
  }

  return savedProduct;
}
