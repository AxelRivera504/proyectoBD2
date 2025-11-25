import React, { useState, useEffect } from 'react';

const ProductForm = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    category: '',
    stock: '',
    minStock: '',
    price: ''
  });

  useEffect(() => {
    if (product) {
      setFormData({
        code: product.code,
        name: product.name,
        category: product.category,
        stock: product.stock.toString(),
        minStock: product.minStock.toString(),
        price: product.price.toString()
      });
    }
  }, [product]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="form-container">
      <h3>Agregar/Editar Producto</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Código</label>
            <input
              type="text"
              name="code"
              className="form-control"
              value={formData.code}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Categoría</label>
            <select
              name="category"
              className="form-control"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione una categoría</option>
              <option value="Analgésicos">Analgésicos</option>
              <option value="Antibióticos">Antibióticos</option>
              <option value="Material Médico">Material Médico</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Precio</label>
            <input
              type="number"
              name="price"
              className="form-control"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Stock Actual</label>
            <input
              type="number"
              name="stock"
              className="form-control"
              value={formData.stock}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Stock Mínimo</label>
            <input
              type="number"
              name="minStock"
              className="form-control"
              value={formData.minStock}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn">
            {product ? 'Actualizar Producto' : 'Guardar Producto'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;