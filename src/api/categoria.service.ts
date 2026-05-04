import type { Categoria, CategoriaCreate, CategoriaTree } from '../types/categoria';

const CATEGORIES_API_URL = '/api/categorias/';

export async function fetchCategories(): Promise<Categoria[]> {
  const response = await fetch(CATEGORIES_API_URL);
  if (!response.ok) {
    throw new Error('Error al obtener las categorias');
  }

  return response.json();
}

export async function fetchCategoriesTree(): Promise<CategoriaTree[]> {
  const response = await fetch(`${CATEGORIES_API_URL}tree`);
  if (!response.ok) {
    throw new Error('Error al obtener el arbol de categorias');
  }

  return response.json();
}

export async function createCategoryRequest(data: CategoriaCreate): Promise<void> {
  const response = await fetch(CATEGORIES_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Error al crear la categoria');
  }
}

export async function updateCategoryRequest(params: { id: number; data: CategoriaCreate }): Promise<void> {
  const response = await fetch(`${CATEGORIES_API_URL}${params.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params.data),
  });

  if (!response.ok) {
    throw new Error('Error al actualizar la categoria');
  }
}

export async function saveCategoryRequest(params: { categoryId?: number; data: CategoriaCreate }): Promise<void> {
  if (params.categoryId) {
    await updateCategoryRequest({ id: params.categoryId, data: params.data });
    return;
  }

  await createCategoryRequest(params.data);
}

export async function deleteCategoryRequest(category: Categoria): Promise<void> {
  const response = await fetch(`${CATEGORIES_API_URL}${category.id}`, {
    method: 'DELETE',
  });

  if (response.status === 404) {
    throw new Error('Ya fue eliminado o no existe.');
  }

  if (!response.ok) {
    throw new Error('Error al eliminar la categoria');
  }
}
