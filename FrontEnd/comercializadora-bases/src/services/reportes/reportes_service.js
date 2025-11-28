import axios from "axios";

const API = "https://localhost:7132/api/Reportes";

// ===============================
// VENTAS CONTADO (requiere fechas)
// ===============================
export const getVentasContado = (fechaInicio, fechaFin) =>
  axios.get(`${API}/ventas-contado`, {
    params: { fechaInicio, fechaFin },
  });

// ====================================
// VENTAS MAYORISTAS (fechas + cliente)
// ====================================
export const getVentasMayoristas = (fechaInicio, fechaFin, idCliente = null) =>
  axios.get(`${API}/ventas-mayoristas`, {
    params: {
      fechaInicio,
      fechaFin,
      idCliente: idCliente || undefined,
    },
  });

// =======================================
// ÓRDENES DE COMPRA (fechas + proveedor)
// =======================================
export const getOrdenesCompra = (fechaInicio, fechaFin, idProveedor = null) =>
  axios.get(`${API}/ordenes-compra`, {
    params: {
      fechaInicio,
      fechaFin,
      idProveedor: idProveedor || undefined,
    },
  });

// =======================================
// PRODUCTOS MÁS VENDIDOS (SIN fechas) 🔥
// =======================================
export const getProductosMasVendidos = () =>
  axios.get(`${API}/productos-mas-vendidos`);

// =======================================
// TOP CLIENTES (SIN fechas) 🔥
// =======================================
export const getTopClientes = () =>
  axios.get(`${API}/top-clientes`);

// =======================================
// DEVOLUCIONES A PROVEEDOR (fechas + prov)
// =======================================
export const getDevolucionesProveedor = (
  idProveedor = null,
  fechaInicio,
  fechaFin
) =>
  axios.get(`${API}/devoluciones`, {
    params: {
      idProveedor: idProveedor || undefined,
      fechaInicio,
      fechaFin,
    },
  });
