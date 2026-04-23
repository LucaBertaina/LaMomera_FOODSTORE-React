import { Link, NavLink } from 'react-router-dom';
import laMomeraLogo from '../../assets/logo/La Momera.svg';

export const Navbar = () => {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-bold uppercase tracking-widest transition-colors ${isActive ? 'text-neon-amber' : 'text-brand-cream/70 hover:text-brand-cream'}`;

  return (
    <nav className="bg-brand-dark border-b border-neon-amber/30 p-4 shadow-neon">
      <div className="container mx-auto flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-between gap-6">
          <Link to="/categorias" className="flex items-center gap-3 text-neon-amber text-3xl font-bold tracking-wider uppercase italic">
            <img src={laMomeraLogo} alt="Logo La Momera" className="h-10 w-10 object-contain" />
            <span>La Momera</span>
          </Link>
          <span className="text-brand-cream/80 text-sm font-medium uppercase tracking-widest">
            Sistema de Gestión
          </span>
        </div>

        <div className="flex items-center gap-6">
          <NavLink to="/categorias" className={navLinkClass}>
            Categorías
          </NavLink>
          <NavLink to="/productos" className={navLinkClass}>
            Productos
          </NavLink>
          <NavLink to="/ingredientes" className={navLinkClass}>
            Ingredientes
          </NavLink>
        </div>
      </div>
    </nav>
  );
};