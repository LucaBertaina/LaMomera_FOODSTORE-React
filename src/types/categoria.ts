export interface Categoria {
  id: number;
  parent_id: number | null;
  nombre: string;
  descripcion: string;
  imagen_url: string;
  borrado?: boolean;
}

export interface CategoriaTree extends Categoria {
  children: CategoriaTree[];
}

export type CategoriaCreate = Omit<Categoria, 'id' | 'borrado'>;