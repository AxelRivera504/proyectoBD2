import React from 'react';

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="logo-container">
          <div className="logo">
            <span className="logo-icon">🏥</span>
            <h1>Comercializadora de Productos Médicos</h1>
          </div>
          <div className="user-info">
            <span>Bienvenido, Usuario</span>
            <button className="btn btn-danger">Cerrar Sesión</button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;