import axios from "axios";

const API = "https://localhost:7132/api/Elaboracion";

export const getProductosFinales = () =>
  axios.get(`${API}/ProductosFinales`);

export const getInsumos = () =>
  axios.get(`${API}/Insumos`);

export const elaborarProducto = (payload) =>
  axios.post(`${API}/Elaborar`, payload);
