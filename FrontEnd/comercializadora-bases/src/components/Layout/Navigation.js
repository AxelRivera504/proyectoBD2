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
            <Link to="/clients" className={isActive('/Clientes')}>Clientes</Link>
          </li>
          <li className="nav-item">
            <Link to="/suppliers" className={isActive('/Suppliers')}>Proveedores</Link>
          </li>
          <li className="nav-item">
            <Link to="/purchaseOrders" className={isActive('/purchaseOrders')}>Ordenes de compra</Link>
          </li>
          <li className="nav-item">
            <Link to="/ventasDetalle" className={isActive('/ventasDetalle')}>Ventas Contado</Link>
          </li>
          <li className="nav-item">
            <Link to="/ventasMayorista" className={isActive('/ventasMayorista')}>Ventas Mayorista</Link>
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