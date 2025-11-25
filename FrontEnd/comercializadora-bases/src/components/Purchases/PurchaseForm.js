import React, { useState, useEffect } from 'react';

const PurchaseForm = ({ purchaseOrder, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    supplier: '',
    orderDate: new Date().toISOString().split('T')[0],
    expectedDate: '',
    products: [],
    notes: ''
  });

  const [selectedProduct, setSelectedProduct] = useState({
    productId: '',
    quantity: 1,
    unitPrice: 0
  });

  const suppliers = [
    { id: 1, name: 'Farmacéutica Nacional S.A.', contact: '2234-5678' },
    { id: 2, name: 'Laboratorios Internacionales', contact: '2234-5679' },
    { id: 3, name: 'Medicamentos Globales', contact: '2234-5680' }
  ];

  const products = [
    { id: 1, name: 'Paracetamol 500mg', category: 'Analgésicos', currentPrice: 25.00 },
    { id: 2, name: 'Amoxicilina 250mg', category: 'Antibióticos', currentPrice: 45.00 },
    { id: 3, name: 'Jeringa 10ml', category: 'Material Médico', currentPrice: 8.50 }
  ];

  useEffect(() => {
    if (purchaseOrder) {
      setFormData({
        supplier: purchaseOrder.supplierId,
        orderDate: purchaseOrder.orderDate,
        expectedDate: purchaseOrder.expectedDate,
        products: purchaseOrder.products,
        notes: purchaseOrder.notes || ''
      });
    }
  }, [purchaseOrder]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleProductSelect = (e) => {
    const productId = e.target.value;
    const product = products.find(p => p.id === parseInt(productId));
    
    setSelectedProduct({
      ...selectedProduct,
      productId: productId,
      unitPrice: product ? product.currentPrice : 0
    });
  };

  const addProduct = () => {
    if (!selectedProduct.productId) return;

    const product = products.find(p => p.id === parseInt(selectedProduct.productId));
    const newProduct = {
      id: selectedProduct.productId,
      name: product.name,
      quantity: parseInt(selectedProduct.quantity),
      unitPrice: parseFloat(selectedProduct.unitPrice),
      total: parseInt(selectedProduct.quantity) * parseFloat(selectedProduct.unitPrice)
    };

    setFormData({
      ...formData,
      products: [...formData.products, newProduct]
    });

    setSelectedProduct({
      productId: '',
      quantity: 1,
      unitPrice: 0
    });
  };

  const removeProduct = (index) => {
    const updatedProducts = formData.products.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      products: updatedProducts
    });
  };

  const calculateTotal = () => {
    return formData.products.reduce((total, product) => total + product.total, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const orderData = {
      ...formData,
      total: calculateTotal(),
      status: 'Pendiente'
    };

    console.log('Datos de orden de compra:', orderData);
    onSave(orderData);
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h3>{purchaseOrder ? 'Editar Orden de Compra' : 'Nueva Orden de Compra'}</h3>
        <button className="btn btn-danger" onClick={onClose}>✕</button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Proveedor</label>
            <select
              name="supplier"
              className="form-control"
              value={formData.supplier}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione un proveedor</option>
              {suppliers.map(supplier => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Fecha de Orden</label>
            <input
              type="date"
              name="orderDate"
              className="form-control"
              value={formData.orderDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Fecha Esperada de Entrega</label>
          <input
            type="date"
            name="expectedDate"
            className="form-control"
            value={formData.expectedDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="products-section">
          <h4>Productos</h4>
          
          <div className="add-product-form">
            <div className="form-row">
              <div className="form-group">
                <select
                  className="form-control"
                  value={selectedProduct.productId}
                  onChange={handleProductSelect}
                >
                  <option value="">Seleccione producto</option>
                  {products.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name} - L. {product.currentPrice.toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <input
                  type="number"
                  placeholder="Cantidad"
                  className="form-control"
                  value={selectedProduct.quantity}
                  onChange={(e) => setSelectedProduct({
                    ...selectedProduct,
                    quantity: e.target.value
                  })}
                  min="1"
                />
              </div>
              
              <div className="form-group">
                <input
                  type="number"
                  placeholder="Precio unitario"
                  className="form-control"
                  value={selectedProduct.unitPrice}
                  onChange={(e) => setSelectedProduct({
                    ...selectedProduct,
                    unitPrice: e.target.value
                  })}
                  step="0.01"
                  min="0"
                />
              </div>
              
              <div className="form-group">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={addProduct}
                  disabled={!selectedProduct.productId}
                >
                  Agregar
                </button>
              </div>
            </div>
          </div>

          {formData.products.length > 0 && (
            <div className="products-list">
              <table className="table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio Unitario</th>
                    <th>Total</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.products.map((product, index) => (
                    <tr key={index}>
                      <td>{product.name}</td>
                      <td>{product.quantity}</td>
                      <td>L. {product.unitPrice.toFixed(2)}</td>
                      <td>L. {product.total.toFixed(2)}</td>
                      <td>
                        <button 
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => removeProduct(index)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3" style={{textAlign: 'right', fontWeight: 'bold'}}>Total:</td>
                    <td style={{fontWeight: 'bold'}}>L. {calculateTotal().toFixed(2)}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Notas</label>
          <textarea
            name="notes"
            className="form-control"
            rows="3"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Notas adicionales sobre la orden..."
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn" disabled={formData.products.length === 0}>
            {purchaseOrder ? 'Actualizar Orden' : 'Crear Orden'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default PurchaseForm;