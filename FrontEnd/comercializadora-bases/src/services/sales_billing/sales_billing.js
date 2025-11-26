import axios from "axios";

const BASE = "https://localhost:7132/api/SalesBilling";

export const crearVentaContado = async (payload) =>
  (await axios.post(`${BASE}/Create`, payload)).data;

export const obtenerVentasContado = async () =>
  (await axios.get(`${BASE}/GetAll`)).data;

export const obtenerVentaContadoPorId = async (id) =>
  (await axios.get(`${BASE}/GetById/${id}`)).data;

export const getAllMayorista = async () => {
  const res = await axios.get(BASE + "/GetAllMayorista");
  return res.data;
};

export const createMayorista = async (payload) => {
  const res = await axios.post(BASE + "/CreateVentaMayorista", payload);
  return res.data;
};