import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ProductoList } from '../components/Producto/ProductoList';
import { ProductoDetailModal } from '../components/Producto/ProductoDetailModal';
import { ProductoModal } from '../components/Producto/ProductoModal';
import { ProductoCategoriasModal } from '../components/Producto/ProductoCategoriasModal';
import { DeleteConfirmModal } from '../components/Shared/DeleteConfirmModal';
import type { CategoriaTree } from '../types/categoria';
import type { Ingrediente } from '../types/ingrediente';
import type { Producto, ProductoCreate, ProductoUpdate } from '../types/producto';
import { useCategorias } from '../hooks/useCategorias';

const PRODUCTOS_QUERY_KEY = ['productos'];
const INGREDIENTES_QUERY_KEY = ['ingredientes'];
const API_URL = '/api/productos/';
const INGREDIENTES_API_URL = '/api/ingredientes/';

async function fetchProductos(): Promise<Producto[]> {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error(`Error al obtener los productos (HTTP ${response.status})`);
  }

  return response.json();
}

async function fetchIngredientes(): Promise<Ingrediente[]> {
  const response = await fetch(INGREDIENTES_API_URL);
  if (!response.ok) {
    throw new Error('Error al obtener los ingredientes');
  }

  return response.json();
}

async function createProducto(data: ProductoCreate): Promise<Producto> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Error al crear el producto');
  }

  return response.json();
}

async function updateProducto(params: { id: number; data: ProductoUpdate }): Promise<Producto> {
  const response = await fetch(`${API_URL}${params.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params.data),
  });

  if (!response.ok) {
    throw new Error('Error al actualizar el producto');
  }

  return response.json();
}

async function assignCategoriaToProducto(params: { productoId: number; categoriaId: number }) {
  const response = await fetch(`${API_URL}${params.productoId}/categorias`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ categoria_id: params.categoriaId }),
  });

  if (!response.ok) {
    throw new Error('Error al asignar la categoría al producto');
  }
}

async function removeCategoriaFromProducto(params: { productoId: number; categoriaId: number }) {
  const response = await fetch(`${API_URL}${params.productoId}/categorias/${params.categoriaId}`, {
    method: 'DELETE',
  });

  if (response.status === 404) {
    throw new Error('La categoría ya fue eliminada o no existe.');
  }

  if (!response.ok) {
    throw new Error('Error al eliminar la categoría del producto');
  }
}

async function assignIngredienteToProducto(params: { productoId: number; ingredienteId: number }) {
  const response = await fetch(`${API_URL}${params.productoId}/ingredientes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ingrediente_id: params.ingredienteId }),
  });

  if (!response.ok) {
    throw new Error('Error al asignar el ingrediente al producto');
  }
}

async function deleteProducto(producto: Producto) {
  const response = await fetch(`${API_URL}${producto.id}`, { method: 'DELETE' });

  if (response.status === 404) {
    throw new Error('Ya fue eliminado o no existe.');
  }

  if (!response.ok) {
    throw new Error('Error al eliminar el producto');
  }
}

function getAllDescendantCategoriaIds(categoriaTree: CategoriaTree): number[] {
  const ids: number[] = [categoriaTree.id];
  if (categoriaTree.children && categoriaTree.children.length > 0) {
    categoriaTree.children.forEach((child) => {
      ids.push(...getAllDescendantCategoriaIds(child));
    });
  }
  return ids;
}

function findCategoriaInTree(id: number, arbol: CategoriaTree[]): CategoriaTree | null {
  for (const cat of arbol) {
    if (cat.id === id) {
      return cat;
    }
    if (cat.children && cat.children.length > 0) {
      const found = findCategoriaInTree(id, cat.children);
      if (found) return found;
    }
  }
  return null;
}

function buildCategoriaOptions(arbol: CategoriaTree[], nivel: number = 0): Array<{ id: number; nombre: string; nivel: number }> {
  const options: Array<{ id: number; nombre: string; nivel: number }> = [];
  
  for (const cat of arbol) {
    options.push({
      id: cat.id,
      nombre: cat.nombre,
      nivel,
    });
    if (cat.children && cat.children.length > 0) {
      options.push(...buildCategoriaOptions(cat.children, nivel + 1));
    }
  }
  
  return options;
}

export const ProductsPage = () => {
  const queryClient = useQueryClient();
  const { categorias, categoriasArbol } = useCategorias();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productoEnEdicion, setProductoEnEdicion] = useState<Producto | null>(null);
  const [productoDetalle, setProductoDetalle] = useState<Producto | null>(null);
  const [productoParaCategorias, setProductoParaCategorias] = useState<Producto | null>(null);
  const [productoParaEliminar, setProductoParaEliminar] = useState<Producto | null>(null);
  const [errorEliminacion, setErrorEliminacion] = useState<string | null>(null);
  const [categoriaEnEliminacionId, setCategoriaEnEliminacionId] = useState<number | null>(null);
  const [categoriaFiltradaId, setCategoriaFiltradaId] = useState('');

  const productosQuery = useQuery({
    queryKey: PRODUCTOS_QUERY_KEY,
    queryFn: fetchProductos,
  });

  const ingredientesQuery = useQuery({
    queryKey: INGREDIENTES_QUERY_KEY,
    queryFn: fetchIngredientes,
  });

  const createMutation = useMutation({
    mutationFn: createProducto,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: PRODUCTOS_QUERY_KEY });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateProducto,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: PRODUCTOS_QUERY_KEY });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProducto,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: PRODUCTOS_QUERY_KEY });
      setProductoParaEliminar(null);
      setErrorEliminacion(null);
    },
    onError: (error: unknown) => {
      setProductoParaEliminar(null);
      setErrorEliminacion(error instanceof Error ? error.message : 'Error al eliminar el producto');
    },
  });

  const assignCategoriaMutation = useMutation({
    mutationFn: assignCategoriaToProducto,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: PRODUCTOS_QUERY_KEY });
    },
  });

  const removeCategoriaMutation = useMutation({
    mutationFn: removeCategoriaFromProducto,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: PRODUCTOS_QUERY_KEY });
      setCategoriaEnEliminacionId(null);
    },
    onError: () => {
      setCategoriaEnEliminacionId(null);
    },
  });

  const assignIngredienteMutation = useMutation({
    mutationFn: assignIngredienteToProducto,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: PRODUCTOS_QUERY_KEY });
    },
  });

  const openNewProductoModal = () => {
    setProductoEnEdicion(null);
    setIsModalOpen(true);
  };

  const openEditProductoModal = (producto: Producto) => {
    setProductoEnEdicion(producto);
    setIsModalOpen(true);
  };

  const openAssignCategoriaModal = (producto: Producto) => {
    setProductoParaCategorias(producto);
  };

  const openDeleteProductoModal = (producto: Producto) => {
    setProductoParaEliminar(producto);
    setErrorEliminacion(null);
  };

  const todaCategoriasConNivel = buildCategoriaOptions(categoriasArbol);


  const categoriasActivas = categorias.filter((categoria) => !categoria.borrado);

  const productosActivos = (productosQuery.data ?? []).filter((producto) => !producto.borrado);

  const productosVisibles = productosActivos.filter((producto) => {
    if (!categoriaFiltradaId) {
      return true;
    }

    const categoriaIdSeleccionada = Number(categoriaFiltradaId);

    const categoriaPadreSeleccionada = findCategoriaInTree(categoriaIdSeleccionada, categoriasArbol);
    if (!categoriaPadreSeleccionada) {
      return false;
    }

   
    const idsAFiltrar = getAllDescendantCategoriaIds(categoriaPadreSeleccionada);
    const categoriasRelacionadas = producto.categorias.map((categoria) => categoria.id);

    return categoriasRelacionadas.some((catId) => idsAFiltrar.includes(catId));
  });

  const handleSubmit = async (data: ProductoCreate | ProductoUpdate, ingredienteIds: number[]) => {
    try {
      let productoGuardado: Producto;

      if (productoEnEdicion) {
        productoGuardado = await updateMutation.mutateAsync({ id: productoEnEdicion.id, data: data as ProductoUpdate });
      } else {
        productoGuardado = await createMutation.mutateAsync(data as ProductoCreate);
      }

      if (ingredienteIds.length > 0) {
        await Promise.all(
          ingredienteIds.map((ingredienteId) =>
            assignIngredienteMutation.mutateAsync({
              productoId: productoGuardado.id,
              ingredienteId,
            }),
          ),
        );
      }
    } finally {
      setIsModalOpen(false);
      setProductoEnEdicion(null);
    }
  };

  const handleAssignCategoria = (categoriaId: number) => {
    if (!productoParaCategorias) {
      return;
    }

    assignCategoriaMutation.mutate(
      { productoId: productoParaCategorias.id, categoriaId },
      {
        onSuccess: () => {
          setProductoParaCategorias(null);
        },
      },
    );
  };

  const handleRemoveCategoria = (categoriaId: number) => {
    if (!productoParaCategorias) {
      return;
    }

    setCategoriaEnEliminacionId(categoriaId);
    removeCategoriaMutation.mutate({ productoId: productoParaCategorias.id, categoriaId });
  };

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-4xl font-black uppercase italic tracking-tighter">Productos</h2>
          <p className="text-brand-cream/40 text-sm tracking-[0.3em] uppercase">Inventario de cocina</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="min-w-56">
            <label className="mb-2 block text-xs uppercase tracking-widest text-brand-cream/60">Filtrar por categoría</label>
            <select
              value={categoriaFiltradaId}
              onChange={(event) => setCategoriaFiltradaId(event.target.value)}
              className="w-full rounded border border-brand-gray/50 bg-brand-gray/20 p-3 text-brand-cream outline-none transition-all focus:border-neon-amber"
            >
              <option value="">Todas las categorías</option>
              {todaCategoriasConNivel
                .filter((cat) => {
                  const catData = categorias.find((c) => c.id === cat.id);
                  return catData && !catData.borrado;
                })
                .map((categoria) => (
                  <option key={categoria.id} value={categoria.id} className="bg-brand-dark">
                    {Array(categoria.nivel).fill('—').join('')} {categoria.nombre}
                  </option>
                ))}
            </select>
          </div>

          <button
            onClick={openNewProductoModal}
            className="rounded-full border-2 border-neon-amber bg-transparent px-6 py-2 text-xs font-bold uppercase text-neon-amber shadow-neon transition-all hover:bg-neon-amber hover:text-brand-dark"
          >
            Nuevo producto
          </button>
        </div>
      </div>

      {productosQuery.isLoading ? (
        <div className="py-20 text-center font-bold uppercase tracking-widest text-neon-amber animate-pulse">
          Sincronizando productos...
        </div>
      ) : productosQuery.isError ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-6 text-red-300">
          No se pudieron cargar los productos.
          <p className="mt-2 text-xs text-red-200/90">{productosQuery.error.message}</p>
        </div>
      ) : productosVisibles.length === 0 ? (
        <div className="rounded-xl border border-brand-gray/40 bg-brand-gray/10 px-4 py-10 text-center text-brand-cream/60">
          {categoriaFiltradaId ? 'No hay productos para esa categoría.' : 'No hay productos cargados.'}
        </div>
      ) : (
        <ProductoList
          productos={productosVisibles}
          onView={setProductoDetalle}
          onEdit={openEditProductoModal}
          onAssignCategoria={openAssignCategoriaModal}
          onDelete={openDeleteProductoModal}
        />
      )}

      {errorEliminacion ? (
        <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {errorEliminacion}
        </div>
      ) : null}

      <ProductoModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setProductoEnEdicion(null);
        }}
        onSubmit={handleSubmit}
        categoriasDisponibles={categoriasActivas}
        isLoadingCategorias={false}
        ingredientesDisponibles={ingredientesQuery.data ?? []}
        productoParaEditar={productoEnEdicion}
      />

      <ProductoCategoriasModal
        isOpen={productoParaCategorias !== null}
        producto={productoParaCategorias}
        categorias={categoriasActivas}
        isLoadingCategorias={false}
        isSaving={assignCategoriaMutation.isPending}
        isRemovingCategoriaId={categoriaEnEliminacionId}
        onClose={() => setProductoParaCategorias(null)}
        onAddCategoria={handleAssignCategoria}
        onRemoveCategoria={handleRemoveCategoria}
      />

      <ProductoDetailModal
        isOpen={productoDetalle !== null}
        producto={productoDetalle}
        onClose={() => setProductoDetalle(null)}
      />

      <DeleteConfirmModal
        isOpen={productoParaEliminar !== null}
        title="Eliminar producto"
        description={
          productoParaEliminar
            ? `Vas a eliminar "${productoParaEliminar.nombre}". El backend lo marcará como borrado.`
            : ''
        }
        isConfirming={deleteMutation.isPending}
        onClose={() => setProductoParaEliminar(null)}
        onConfirm={() => {
          if (productoParaEliminar) {
            deleteMutation.mutate(productoParaEliminar);
          }
        }}
      />
    </main>
  );
};