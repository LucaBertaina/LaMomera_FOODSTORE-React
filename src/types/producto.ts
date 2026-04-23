import type { Categoria } from './categoria';
import type { Ingrediente } from './ingrediente';


export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio_base: number | string;
  imagen_url: string[];
  stock_cantidad: number;
  disponible: boolean;
  borrado?: boolean;
  categorias: Categoria[];
  ingredientes_relacionados: Ingrediente[];
}

export interface ProductoCreate {
  nombre: string;
  descripcion: string;
  precio_base: number | string;
  imagen_url: string[];
  stock_cantidad: number;
  disponible: boolean;
  categoria_ids: number[];
}

export interface ProductoUpdate {
  nombre?: string;
  descripcion?: string;
  precio_base?: number | string;
  imagen_url?: string[];
  stock_cantidad?: number;
  disponible?: boolean;
}