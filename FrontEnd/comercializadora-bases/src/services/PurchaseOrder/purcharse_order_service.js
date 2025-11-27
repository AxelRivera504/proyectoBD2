import axios from "axios";

const BASE = "https://localhost:7132/api/PurchaseOrder";

export const getPurchaseOrders = () => axios.get(`${BASE}/GetAll`);

export const createPurchaseOrder = (payload) =>
  axios.post(`${BASE}/Create`, payload);
