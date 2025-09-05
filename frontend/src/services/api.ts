import axios from "axios";

// Local (dev) or Render (prod)
const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

export const api = axios.create({
    baseURL: API_URL,
});

// GET all stocks (from SQL backend)
export const fetchStocks = async (page: number = 1, limit: number = 20) => {
    const skip = (page - 1) * limit;
    const res = await api.get(`/stocks/sql?skip=${skip}&limit=${limit}`);
    return res.data;
};

// CREATE
export const createStock = async (stock: any) => {
    const res = await api.post("/stocks/sql", stock);
    return res.data;
};

// UPDATE
export const updateStock = async (id: number, stock: any) => {
    const res = await api.put(`/stocks/sql/${id}`, stock);
    return res.data;
};

// DELETE
export const deleteStock = async (id: number) => {
    const res = await api.delete(`/stocks/sql/${id}`);
    return res.data;
};
