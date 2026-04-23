export interface Ingrediente {
  id: number;
  nombre: string;
  descripcion: string;
  es_alergeno: boolean;
  borrado?: boolean;
}

export type IngredienteCreate = Omit<Ingrediente, 'id' | 'borrado'>;
