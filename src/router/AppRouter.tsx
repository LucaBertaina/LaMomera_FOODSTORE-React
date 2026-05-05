import { Navigate, Route, Routes } from 'react-router-dom';
import { CategoriasPage } from '../pages/CategoriasPage';
import { IngredientesPage } from '../pages/IngredientesPage';
import { ProductsPage } from '../pages/ProductsPage';

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/categorias" replace />} />
      <Route path="/categorias" element={<CategoriasPage />} />
      <Route path="/productos" element={<ProductsPage />} />
      <Route path="/ingredientes" element={<IngredientesPage />} />
    </Routes>
  );
};
