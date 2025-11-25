import React from 'react';

const Sales = () => {
  return (
    <div className="container">
      <h2 className="section-title">Gestión de Ventas</h2>
      <div className="dashboard">
        <div className="card">
          <div className="card-icon">💰</div>
          <h3>Ventas al por Mayor</h3>
          <div className="card-value">L. 150,240</div>
        </div>
        <div className="card">
          <div className="card-icon">🛒</div>
          <h3>Ventas al Detalle</h3>
          <div className="card-value">L. 95,440</div>
        </div>
        <div className="card">
          <div className="card-icon">👥</div>
          <h3>Clientes Activos</h3>
          <div className="card-value">45</div>
        </div>
      </div>
      
      <div style={{ marginTop: '30px' }}>
        <p>Módulo de ventas en desarrollo...</p>
      </div>
    </div>
  );
};

export default Sales;