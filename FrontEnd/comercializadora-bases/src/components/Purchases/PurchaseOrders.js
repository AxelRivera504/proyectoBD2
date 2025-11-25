import React from 'react';

const PurchaseOrder = ({ order, onViewDetails, onEdit, onCancel }) => {
  const getStatusBadge = (status) => {
    const statusConfig = {
      'Pendiente': { class: 'status-pending', label: 'Pendiente' },
      'En Proceso': { class: 'status-processing', label: 'En Proceso' },
      'Completada': { class: 'status-completed', label: 'Completada' },
      'Cancelada': { class: 'status-cancelled', label: 'Cancelada' },
      'Recibida': { class: 'status-received', label: 'Recibida' }
    };

    const config = statusConfig[status] || { class: 'status-default', label: status };
    
    return <span className={`status-badge ${config.class}`}>{config.label}</span>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-HN');
  };

  return (
    <div className="purchase-order-card">
      <div className="order-header">
        <div className="order-info">
          <h3 className="order-number">{order.number}</h3>
          <div className="order-supplier">{order.supplier}</div>
        </div>
        <div className="order-status">
          {getStatusBadge(order.status)}
        </div>
      </div>

      <div className="order-details">
        <div className="detail-row">
          <span className="detail-label">Fecha:</span>
          <span className="detail-value">{formatDate(order.date)}</span>
        </div>
        
        <div className="detail-row">
          <span className="detail-label">Productos:</span>
          <span className="detail-value">{order.itemsCount} productos</span>
        </div>
        
        <div className="detail-row">
          <span className="detail-label">Total:</span>
          <span className="detail-value total-amount">L. {order.total.toFixed(2)}</span>
        </div>
      </div>

      <div className="order-actions">
        <button 
          className="btn btn-secondary btn-sm"
          onClick={() => onViewDetails(order)}
        >
          Ver Detalle
        </button>
        
        {order.status === 'Pendiente' && (
          <>
            <button 
              className="btn btn-warning btn-sm"
              onClick={() => onEdit(order)}
            >
              Editar
            </button>
            <button 
              className="btn btn-danger btn-sm"
              onClick={() => onCancel(order.id)}
            >
              Cancelar
            </button>
          </>
        )}
        
        {order.status === 'En Proceso' && (
          <button 
            className="btn btn-success btn-sm"
            onClick={() => console.log('Marcar como recibida', order.id)}
          >
            Recibir
          </button>
        )}
      </div>
    </div>
  );
};

export default PurchaseOrder;