import React from 'react';

const Inventory = () => {
  return (
    <div className="container">
      <h2 className="section-title">Control de Inventario</h2>
      <div className="dashboard">
        <div className="card">
          <div className="card-icon">📊</div>
          <h3>Nivel de Inventario</h3>
          <div className="card-value">85%</div>
        </div>
        <div className="card">
          <div className="card-icon">🔄</div>
          <h3>Rotación</h3>
          <div className="card-value">2.8</div>
        </div>
        <div className="card">
          <div className="card-icon">📦</div>
          <h3>Productos Bajos</h3>
          <div className="card-value">18</div>
        </div>
      </div>
      
      <div style={{ marginTop: '30px' }}>
        <p>Módulo de inventario en desarrollo...</p>
      </div>
    </div>
  );
};

export default Inventory;