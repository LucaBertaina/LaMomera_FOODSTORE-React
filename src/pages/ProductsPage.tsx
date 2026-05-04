import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ProductoList } from '../components/Producto/ProductoList';
import { ProductoDetailModal } from '../components/Producto/ProductoDetailModal';
import { ProductoModal } from '../components/Producto/ProductoModal';
import { ProductoCategoriasModal } from '../components/Producto/ProductoCategoriasModal';
import { DeleteConfirmModal } from '../components/Shared/DeleteConfirmModal';
import { Navbar } from '../components/Navbar/NavbarComponent';
import type { CategoriaTree } from '../types/categoria';
import type { Producto, ProductoCreate, ProductoUpdate } from '../types/producto';
import { fetchCategoriesTree } from '../api/categoria.service';
import { fetchIngredients } from '../api/ingrediente.service';
import {
  assignCategoryToProductRequest,
  deleteProductRequest,
  fetchProducts,
  removeCategoryFromProductRequest,
  saveProductRequest,
} from '../api/producto.service';

const CATEGORIES_TREE_QUERY_KEY = ['categorias', 'tree'];
const PRODUCTS_QUERY_KEY = ['productos'];
const INGREDIENTS_QUERY_KEY = ['ingredientes'];

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

function buildCategoriaOptions(arbol: CategoriaTree[], nivel: number = 0): Array<{ id: number; nombre: string; nivel: number; borrado?: boolean }> {
  const options: Array<{ id: number; nombre: string; nivel: number; borrado?: boolean }> = [];
  
  for (const cat of arbol) {
    options.push({
      id: cat.id,
      nombre: cat.nombre,
      nivel,
      borrado: cat.borrado,
    });
    if (cat.children && cat.children.length > 0) {
      options.push(...buildCategoriaOptions(cat.children, nivel + 1));
    }
  }
  
  return options;
}

function flattenCategories(arbol: CategoriaTree[]): CategoriaTree[] {
  const result: CategoriaTree[] = [];

  for (const categoria of arbol) {
    result.push(categoria);
    if (categoria.children.length > 0) {
      result.push(...flattenCategories(categoria.children));
    }
  }

  return result;
}

export const ProductsPage = () => {
  const queryClient = useQueryClient();

  const categoriesTreeQuery = useQuery({
    queryKey: CATEGORIES_TREE_QUERY_KEY,
    queryFn: fetchCategoriesTree,
  });

  const productsQuery = useQuery({
    queryKey: PRODUCTS_QUERY_KEY,
    queryFn: fetchProducts,
  });

  const ingredientsQuery = useQuery({
    queryKey: INGREDIENTS_QUERY_KEY,
    queryFn: fetchIngredients,
  });

  const invalidateProducts = async () => {
    await queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
  };

  const saveProductMutation = useMutation({
    mutationFn: saveProductRequest,
    onSuccess: invalidateProducts,
  });

  const deleteProductMutation = useMutation({
    mutationFn: deleteProductRequest,
    onSuccess: invalidateProducts,
  });

  const assignCategoryToProductMutation = useMutation({
    mutationFn: assignCategoryToProductRequest,
    onSuccess: invalidateProducts,
  });

  const removeCategoryFromProductMutation = useMutation({
    mutationFn: removeCategoryFromProductRequest,
    onSuccess: invalidateProducts,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productoEnEdicion, setProductoEnEdicion] = useState<Producto | null>(null);
  const [productoDetalle, setProductoDetalle] = useState<Producto | null>(null);
  const [productoParaCategorias, setProductoParaCategorias] = useState<Producto | null>(null);
  const [productoParaEliminar, setProductoParaEliminar] = useState<Producto | null>(null);
  const [errorEliminacion, setErrorEliminacion] = useState<string | null>(null);
  const [categoriaEnEliminacionId, setCategoriaEnEliminacionId] = useState<number | null>(null);
  const [categoriaFiltradaId, setCategoriaFiltradaId] = useState('');

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

  const categoriesTree = categoriesTreeQuery.data ?? [];
  const ingredients = ingredientsQuery.data ?? [];

  const todaCategoriasConNivel = buildCategoriaOptions(categoriesTree);
  const categoriasActivas = flattenCategories(categoriesTree).filter((categoria) => !categoria.borrado);

  const productosActivos = (productsQuery.data ?? []).filter((producto) => !producto.borrado);

  const productosVisibles = productosActivos.filter((producto) => {
    if (!categoriaFiltradaId) {
      return true;
    }

    const categoriaIdSeleccionada = Number(categoriaFiltradaId);

    const categoriaPadreSeleccionada = findCategoriaInTree(categoriaIdSeleccionada, categoriesTree);
    if (!categoriaPadreSeleccionada) {
      return false;
    }

   
    const idsAFiltrar = getAllDescendantCategoriaIds(categoriaPadreSeleccionada);
    const categoriasRelacionadas = producto.categorias.map((categoria) => categoria.id);

    return categoriasRelacionadas.some((catId) => idsAFiltrar.includes(catId));
  });

  const handleSubmit = async (data: ProductoCreate | ProductoUpdate, ingredienteIds: number[]) => {
    try {
      await saveProductMutation.mutateAsync({
        productId: productoEnEdicion?.id,
        data,
        ingredientIds: ingredienteIds,
      });
    } finally {
      setIsModalOpen(false);
      setProductoEnEdicion(null);
    }
  };

  const handleAssignCategoria = (categoriaId: number) => {
    if (!productoParaCategorias) {
      return;
    }

    assignCategoryToProductMutation.mutate(
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
    removeCategoryFromProductMutation.mutate(
      { productoId: productoParaCategorias.id, categoriaId },
      {
        onSuccess: () => {
          setCategoriaEnEliminacionId(null);
        },
        onError: () => {
          setCategoriaEnEliminacionId(null);
        },
      },
    );
  };

  return (
    <>
      <Navbar />
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
                .filter((cat) => !cat.borrado)
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

      {productsQuery.isLoading ? (
        <div className="py-20 text-center font-bold uppercase tracking-widest text-neon-amber animate-pulse">
          Sincronizando productos...
        </div>
      ) : productsQuery.isError ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-6 text-red-300">
          No se pudieron cargar los productos.
          <p className="mt-2 text-xs text-red-200/90">{productsQuery.error.message}</p>
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

      {isModalOpen ? (
        <ProductoModal
          key={productoEnEdicion?.id ?? 'new-producto'}
          isOpen={true}
          onClose={() => {
            setIsModalOpen(false);
            setProductoEnEdicion(null);
          }}
          onSubmit={handleSubmit}
          categoriasDisponibles={categoriasActivas}
          isLoadingCategorias={false}
          ingredientesDisponibles={ingredients}
          productoParaEditar={productoEnEdicion}
        />
      ) : null}

      {productoParaCategorias ? (
        <ProductoCategoriasModal
          key={productoParaCategorias.id}
          isOpen={true}
          producto={productoParaCategorias}
          categorias={categoriasActivas}
          isLoadingCategorias={false}
          isSaving={assignCategoryToProductMutation.isPending}
          isRemovingCategoriaId={categoriaEnEliminacionId}
          onClose={() => setProductoParaCategorias(null)}
          onAddCategoria={handleAssignCategoria}
          onRemoveCategoria={handleRemoveCategoria}
        />
      ) : null}

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
        isConfirming={deleteProductMutation.isPending}
        onClose={() => setProductoParaEliminar(null)}
        onConfirm={() => {
          if (productoParaEliminar) {
            deleteProductMutation.mutate(productoParaEliminar, {
              onSuccess: () => {
                setProductoParaEliminar(null);
                setErrorEliminacion(null);
              },
              onError: (error: unknown) => {
                setProductoParaEliminar(null);
                setErrorEliminacion(error instanceof Error ? error.message : 'Error al eliminar el producto');
              },
            });
          }
        }}
      />
      </main>
    </>
  );
};