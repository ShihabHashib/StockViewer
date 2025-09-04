"use client";
import React, { useEffect, useState } from "react";
import {
  fetchStocks,
  createStock,
  updateStock,
  deleteStock,
} from "../services/api";

type Stock = {
  id: number;
  date: string;
  trade_code: string;
  high: number;
  low: number;
  open: number;
  close: number;
  volume: number;
};

const SqlTable = () => {
  const [data, setData] = useState<Stock[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const loadData = async (page: number) => {
    setLoading(true);
    try {
      const res = await fetchStocks(page, 20);
      setData(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(page);
  }, [page]);

  const handleAdd = async (newStock: Stock) => {
    const created = await createStock(newStock);
    setData([...data, created]);
  };

  const handleUpdate = async (id: number, updatedStock: Stock) => {
    const updated = await updateStock(id, updatedStock);
    setData(data.map((row) => (row.id === id ? updated : row)));
  };

  const handleDelete = async (id: number) => {
    await deleteStock(id);
    setData(data.filter((row) => row.id !== id));
  };

  return (
    <div className="p-6 backdrop-blur-lg bg-white/10 rounded-xl shadow-xl">
      <h2 className="text-2xl font-bold mb-4">SQL Model Table</h2>

      {loading ? (
        <div className="animate-spin border-4 border-blue-500 border-t-transparent w-12 h-12 rounded-full mx-auto" />
      ) : (
        <table className="w-full border border-gray-700 rounded-lg text-white">
          <thead className="bg-gray-800/50">
            <tr>
              <th>Date</th>
              <th>Trade Code</th>
              <th>High</th>
              <th>Low</th>
              <th>Open</th>
              <th>Close</th>
              <th>Volume</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id} className="hover:bg-gray-700/40">
                <td>{row.date}</td>
                <td>{row.trade_code}</td>
                <td>{row.high}</td>
                <td>{row.low}</td>
                <td>{row.open}</td>
                <td>{row.close}</td>
                <td>{row.volume}</td>
                <td className="space-x-2">
                  <button
                    onClick={() =>
                      handleUpdate(row.id, { ...row, close: row.close + 1 })
                    }
                    className="px-2 py-1 bg-blue-500 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(row.id)}
                    className="px-2 py-1 bg-red-500 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-4 space-x-2">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>Page {page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 bg-gray-700 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SqlTable;
