import axios from "axios";

const BASE_URL = "https://localhost:7132/api/Supplier";

export const getAllSuppliers = async () => {
  const res = await axios.get(`${BASE_URL}/GetAll`);
  return res.data;
};

export const addSupplier = async (data) => {
  const res = await axios.post(`${BASE_URL}/AddSupplier`, data);
  return res.data;
};

export const updateSupplier = async (data) => {
  const res = await axios.put(`${BASE_URL}/UpdateSupplier`, data);
  return res.data;
};

export const deleteSupplier = async (idProveedor) => {
  const res = await axios.put(`${BASE_URL}/DeleteSupplier`, { idProveedor });
  return res.data;
};
