import axios from "axios";

const API_URL = "https://localhost:7132/api/PurchaseOrder";

export const receivePurchaseOrder = async (idOrdenCompra) => {
  return await axios.post(`${API_URL}/RecivePurcharOrder`, {
    idOrdenCompra: idOrdenCompra
  });
};
