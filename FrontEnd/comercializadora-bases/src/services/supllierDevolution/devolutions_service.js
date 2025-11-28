import axios from "axios";

const API = "https://localhost:7132/api/DevolucionProveedor";

export const getProveedoresConPendiente = () =>
  axios.get(`${API}/proveedores`);

export const getFacturasPendientes = (idProveedor) =>
  axios.get(`${API}/facturas/${idProveedor}`);

export const getProductosPorFactura = (idFactura) =>
  axios.get(`${API}/productos/${idFactura}`);

export const devolverProducto = (payload) =>
  axios.post(`${API}/devolver`, payload);
