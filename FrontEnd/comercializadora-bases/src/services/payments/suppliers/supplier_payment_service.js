import axios from "axios";

const API = "https://localhost:7132/api/SupplierPayment";

export const getPendingInvoices = () =>
  axios.get(`${API}/FacturasPendientes`);

export const paySingleInvoice = (data) =>
  axios.post(`${API}/PagarFactura`, data);

export const payMultipleInvoices = (data) =>
  axios.post(`${API}/PagarMultiples`, data);
