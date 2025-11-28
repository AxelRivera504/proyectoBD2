import axios from "axios";
const API = "https://localhost:7132/api/ClientPayment";

export const pagarFacturaCliente = async (payload) => {
  return await axios.post(`${API}/PagarFactura`, payload);
};

export const pagarMultipleCliente = async (payload) => {
  return await axios.post(`${API}/PagarMultiple`, payload);
};
