import React from 'react';

const Table = ({ 
  columns, 
  data, 
  className = '',
  emptyMessage = 'No hay datos para mostrar',
  loading = false,
  onRowClick 
}) => {
  if (loading) {
    return (
      <div className="table-container">
        <div className="table-loading">
          <div className="loading-spinner"></div>
          <p>Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="table-container">
        <div className="table-empty">
          <p>{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className={`ui-table ${className}`.trim()}>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th 
                key={index}
                style={{ 
                  width: column.width,
                  textAlign: column.align || 'left'
                }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr 
              key={rowIndex}
              className={onRowClick ? 'clickable-row' : ''}
              onClick={() => onRowClick && onRowClick(row)}
            >
              {columns.map((column, colIndex) => (
                <td 
                  key={colIndex}
                  style={{ textAlign: column.align || 'left' }}
                >
                  {column.cell ? column.cell(row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const ActionColumn = ({ onEdit, onDelete, onView }) => (
  <div className="table-actions">
    {onView && (
      <button 
        className="btn btn-secondary btn-sm"
        onClick={(e) => {
          e.stopPropagation();
          onView();
        }}
        title="Ver detalles"
      >
        👁️
      </button>
    )}
    {onEdit && (
      <button 
        className="btn btn-warning btn-sm"
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
        title="Editar"
      >
        ✏️
      </button>
    )}
    {onDelete && (
      <button 
        className="btn btn-danger btn-sm"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        title="Eliminar"
      >
        🗑️
      </button>
    )}
  </div>
);

export default Table;