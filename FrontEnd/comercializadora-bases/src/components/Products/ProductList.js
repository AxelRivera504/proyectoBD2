import React from 'react';

const ProductList = ({ onEdit, onDelete }) => {
  const products = [
    { id: 1, code: 'PM-001', name: 'Paracetamol 500mg', category: 'Analgésicos', stock: 150, minStock: 50, price: 25.00 },
    { id: 2, code: 'PM-002', name: 'Amoxicilina 250mg', category: 'Antibióticos', stock: 80, minStock: 30, price: 45.00 },
    { id: 3, code: 'PM-003', name: 'Jeringa 10ml', category: 'Material Médico', stock: 200, minStock: 100, price: 8.50 }
  ];

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Stock Actual</th>
            <th>Stock Mínimo</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.code}</td>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>{product.stock}</td>
              <td>{product.minStock}</td>
              <td>L. {product.price.toFixed(2)}</td>
              <td className="actions">
                <button 
                  className="action-btn edit-btn" 
                  onClick={() => onEdit(product)}
                >
                  Editar
                </button>
                <button 
                  className="action-btn delete-btn"
                  onClick={() => onDelete(product.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;