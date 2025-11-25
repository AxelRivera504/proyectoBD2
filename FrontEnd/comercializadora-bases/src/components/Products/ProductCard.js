import React from 'react';
import './ProductCard.css'; // Crearemos este CSS después

const ProductCard = ({ product, onEdit, onDelete }) => {
  const getStockStatus = (stock, minStock) => {
    if (stock === 0) return { text: 'Agotado', class: 'stock-out' };
    if (stock <= minStock) return { text: 'Bajo Stock', class: 'stock-low' };
    return { text: 'En Stock', class: 'stock-ok' };
  };

  const stockStatus = getStockStatus(product.stock, product.minStock);

  return (
    <div className="product-card">
      <div className="product-header">
        <h3 className="product-name">{product.name}</h3>
        <span className={`stock-badge ${stockStatus.class}`}>
          {stockStatus.text}
        </span>
      </div>
      
      <div className="product-details">
        <div className="product-code">
          <strong>Código:</strong> {product.code}
        </div>
        <div className="product-category">
          <strong>Categoría:</strong> {product.category}
        </div>
        <div className="product-stock">
          <strong>Stock:</strong> {product.stock} / {product.minStock} mín.
        </div>
        <div className="product-price">
          <strong>Precio:</strong> L. {product.price.toFixed(2)}
        </div>
      </div>

      <div className="product-actions">
        <button 
          className="btn btn-warning btn-sm"
          onClick={() => onEdit(product)}
        >
          Editar
        </button>
        <button 
          className="btn btn-danger btn-sm"
          onClick={() => onDelete(product.id)}
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default ProductCard;