import type { Ingrediente, IngredienteCreate } from '../types/ingrediente';

const INGREDIENTS_API_URL = '/api/ingredientes/';

export async function fetchIngredients(): Promise<Ingrediente[]> {
  const response = await fetch(INGREDIENTS_API_URL);
  if (!response.ok) {
    throw new Error('Error al obtener los ingredientes');
  }

  return response.json();
}

export async function createIngredientRequest(data: IngredienteCreate): Promise<void> {
  const response = await fetch(INGREDIENTS_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Error al crear el ingrediente');
  }
}

export async function updateIngredientRequest(params: { id: number; data: IngredienteCreate }): Promise<void> {
  const response = await fetch(`${INGREDIENTS_API_URL}${params.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params.data),
  });

  if (!response.ok) {
    throw new Error('Error al actualizar el ingrediente');
  }
}

export async function saveIngredientRequest(params: { ingredientId?: number; data: IngredienteCreate }): Promise<void> {
  if (params.ingredientId) {
    await updateIngredientRequest({ id: params.ingredientId, data: params.data });
    return;
  }

  await createIngredientRequest(params.data);
}

export async function deleteIngredientRequest(ingredient: Ingrediente): Promise<void> {
  const response = await fetch(`${INGREDIENTS_API_URL}${ingredient.id}`, { method: 'DELETE' });

  if (response.status === 404) {
    throw new Error('Ya fue eliminado o no existe.');
  }

  if (!response.ok) {
    throw new Error('Error al eliminar el ingrediente');
  }
}
