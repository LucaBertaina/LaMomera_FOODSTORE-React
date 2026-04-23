import { Navbar } from './components/Navbar/NavbarComponent';
import { Navigate, Route, Routes } from 'react-router-dom';
import { CategoriasPage } from './pages/CategoriasPage';
import { IngredientesPage } from './pages/IngredientesPage';
import { ProductsPage } from './pages/ProductsPage';

function App() {
  return (
    <div className="min-h-screen bg-brand-dark text-brand-cream">
      <Navbar />

      <Routes>
        <Route path="/" element={<Navigate to="/categorias" replace />} />
        <Route path="/categorias" element={<CategoriasPage />} />
        <Route path="/productos" element={<ProductsPage />} />
        <Route path="/ingredientes" element={<IngredientesPage />} />
      </Routes>
    </div>
  );
}

export default App;