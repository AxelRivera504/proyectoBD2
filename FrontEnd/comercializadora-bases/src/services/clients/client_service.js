import axios from "axios";

const API_URL = "https://localhost:7132/api/Client/";

export const getClients = () => axios.get(API_URL + "GetAll");

export const addClient = (data) => axios.post(API_URL + "AddClient", data);

export const updateClient = (data) => axios.put(API_URL + "UpdateClient", data);

export const deleteClient = (data) => axios.put(API_URL + "DeleteClient", data);
