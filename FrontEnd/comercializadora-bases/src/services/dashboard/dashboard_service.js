import axios from "axios";

const API = "https://localhost:7132/api/Dashboard";

export const getDashboardSummary = () =>
  axios.get(`${API}/summary`);

export const getLowStockProducts = () =>
  axios.get(`${API}/low-stock`);

export const getPagosProveedorPeriodo = (fechaInicio, fechaFin) =>
  axios.get(`${API}/pagos-proveedor`, {
    params: { fechaInicio, fechaFin },
  });

export const getKardexProducto = (idProducto) =>
  axios.get(`${API}/kardex/${idProducto}`);
