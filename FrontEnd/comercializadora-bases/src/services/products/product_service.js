const API_URL = "https://localhost:7132/api/Product";

export const getAllProducts = async () => {
  const response = await fetch(`${API_URL}/GetAll`);
  return await response.json();
};

export const addProduct = async (payload) => {
  const response = await fetch(`${API_URL}/AddProduct`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return await response.json();
};

export const updateProduct = async (payload) => {
  const response = await fetch(`${API_URL}/UpdateProduct`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return await response.json();
};

export const deleteProduct = async (id) => {
  const response = await fetch(`${API_URL}/DeleteProduct?id=${id}`, {
    method: "DELETE"
  });
  return await response.json();
};
