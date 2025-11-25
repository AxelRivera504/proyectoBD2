import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };

  return (
    <nav className="navigation">
      <div className="container">
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className={isActive('/')}>Inicio</Link>
          </li>
          <li className="nav-item">
            <Link to="/productos" className={isActive('/productos')}>Productos</Link>
          </li>
          <li className="nav-item">
            <Link to="/compras" className={isActive('/compras')}>Compras</Link>
          </li>
          <li className="nav-item">
            <Link to="/ventas" className={isActive('/ventas')}>Ventas</Link>
          </li>
          <li className="nav-item">
            <Link to="/inventario" className={isActive('/inventario')}>Inventario</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;