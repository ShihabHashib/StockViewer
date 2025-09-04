import axios from "axios";

// Local (for dev) or Render (for prod)
const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

export const api = axios.create({
    baseURL: API_URL,
});

// GET stocks with pagination
export const fetchStocks = async (page: number = 1, limit: number = 20) => {
    const skip = (page - 1) * limit;
    const res = await api.get(`/stocks/?skip=${skip}&limit=${limit}`);
    return res.data;
};

// CREATE
export const createStock = async (stock: any) => {
    const res = await api.post("/stocks/", stock);
    return res.data;
};

// UPDATE
export const updateStock = async (id: number, stock: any) => {
    const res = await api.put(`/stocks/${id}`, stock);
    return res.data;
};

// DELETE
export const deleteStock = async (id: number) => {
    const res = await api.delete(`/stocks/${id}`);
    return res.data;
};
