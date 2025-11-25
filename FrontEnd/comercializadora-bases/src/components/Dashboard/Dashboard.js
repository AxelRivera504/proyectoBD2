import React from 'react';

const Dashboard = () => {
  const stats = [
    { icon: '📦', title: 'Productos en Stock', value: '1,245' },
    { icon: '💰', title: 'Ventas del Mes', value: 'L. 245,680' },
    { icon: '📋', title: 'Órdenes Pendientes', value: '24' },
    { icon: '⚠️', title: 'Productos por Agotarse', value: '18' }
  ];

  return (
    <div className="dashboard">
      {stats.map((stat, index) => (
        <div key={index} className="card">
          <div className="card-icon">{stat.icon}</div>
          <h3>{stat.title}</h3>
          <div className="card-value">{stat.value}</div>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;