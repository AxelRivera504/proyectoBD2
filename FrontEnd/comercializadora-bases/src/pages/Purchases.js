import React, { useState } from 'react';

const Purchases = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([
    { 
      id: 1, 
      number: 'OC-2023-001', 
      supplier: 'Farmacéutica Nacional S.A.', 
      date: '15/10/2023', 
      status: 'Pendiente', 
      total: 12500.00 
    },
    { 
      id: 2, 
      number: 'OC-2023-002', 
      supplier: 'Laboratorios Internacionales', 
      date: '18/10/2023', 
      status: 'En Proceso', 
      total: 8750.00 
    }
  ]);

  const [formData, setFormData] = useState({
    supplier: '',
    orderDate: new Date().toISOString().split('T')[0],
    products: []
  });

  const [selectedProducts, setSelectedProducts] = useState([]);

  const suppliers = [
    { id: 1, name: 'Farmacéutica Nacional S.A.' },
    { id: 2, name: 'Laboratorios Internacionales' },
    { id: 3, name: 'Medicamentos Globales' }
  ];

  const products = [
    { id: 1, name: 'Paracetamol 500mg' },
    { id: 2, name: 'Amoxicilina 250mg' },
    { id: 3, name: 'Jeringa 10ml' }
  ];

  const handleViewDetails = (order) => {
    alert(`Detalles de ${order.number}\nProveedor: ${order.supplier}\nTotal: L. ${order.total.toFixed(2)}`);
  };

  const handleCancel = (orderId) => {
    if (confirm('¿Está seguro de cancelar esta orden?')) {
      setPurchaseOrders(purchaseOrders.filter(order => order.id !== orderId));
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleProductChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedProducts(selectedOptions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.supplier || selectedProducts.length === 0) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }

    const supplier = suppliers.find(s => s.id === parseInt(formData.supplier));
    const newOrder = {
      id: Math.max(...purchaseOrders.map(o => o.id)) + 1,
      number: `OC-2023-${String(purchaseOrders.length + 1).padStart(3, '0')}`,
      supplier: supplier.name,
      date: new Date().toLocaleDateString('es-HN'),
      status: 'Pendiente',
      total: 0 // En una app real, calcularías el total
    };

    setPurchaseOrders([...purchaseOrders, newOrder]);
    
    // Limpiar formulario
    setFormData({
      supplier: '',
      orderDate: new Date().toISOString().split('T')[0],
      products: []
    });
    setSelectedProducts([]);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Pendiente': { class: 'status-pending', label: 'Pendiente' },
      'En Proceso': { class: 'status-processing', label: 'En Proceso' }
    };
    const config = statusConfig[status] || { class: 'status-default', label: status };
    return <span className={`status-badge ${config.class}`}>{config.label}</span>;
  };

  return (
    <div className="container">
      <h2 className="section-title">Órdenes de Compra</h2>

      {/* Tabla de Órdenes de Compra */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>N° Orden</th>
              <th>Proveedor</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Total</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {purchaseOrders.map(order => (
              <tr key={order.id}>
                <td>{order.number}</td>
                <td>{order.supplier}</td>
                <td>{order.date}</td>
                <td>{getStatusBadge(order.status)}</td>
                <td>L. {order.total.toFixed(2)}</td>
                <td className="actions">
                  <button 
                    className="action-btn view-btn"
                    onClick={() => handleViewDetails(order)}
                  >
                    Ver Detalle
                  </button>
                  <button 
                    className="action-btn delete-btn"
                    onClick={() => handleCancel(order.id)}
                  >
                    Cancelar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Formulario de Nueva Orden de Compra */}
      <div className="form-container">
        <h3>Nueva Orden de Compra</h3>
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
              <label className="form-label">Fecha</label>
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
            <label className="form-label">Productos</label>
            <select 
              multiple 
              className="form-control" 
              style={{ height: '120px' }}
              value={selectedProducts}
              onChange={handleProductChange}
              required
            >
              {products.map(product => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
            <small className="form-text">Mantén presionado Ctrl para seleccionar múltiples productos</small>
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn">
              Crear Orden
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Purchases;