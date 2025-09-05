import React, { useEffect, useState } from "react";
import {
  fetchStocks,
  createStock,
  updateStock,
  deleteStock,
} from "../services/api";
import LoadingSpinner from "./LoadingSpinner";

interface Stock {
  id: number;
  date: string;
  trade_code: string;
  high: number;
  low: number;
  open: number;
  close: number;
  volume: number;
}

const SqlModel: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [newStock, setNewStock] = useState<Omit<Stock, "id">>({
    date: "",
    trade_code: "",
    high: 0,
    low: 0,
    open: 0,
    close: 0,
    volume: 0,
  });

  // Fetch stocks whenever page changes
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchStocks(page, 20); // 20 per page
        setStocks(data);
      } catch (err) {
        console.error("Error fetching stocks", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [page]);

  // Handle add stock
  const handleAdd = async () => {
    try {
      await createStock(newStock);
      const data = await fetchStocks(page, 20);
      setStocks(data);
      setNewStock({
        date: "",
        trade_code: "",
        high: 0,
        low: 0,
        open: 0,
        close: 0,
        volume: 0,
      });
    } catch (err) {
      console.error("Error adding stock", err);
    }
  };

  // Handle edit stock inline
  const handleUpdate = async (id: number, field: keyof Stock, value: any) => {
    try {
      const stock = stocks.find((s) => s.id === id);
      if (!stock) return;
      const updated = { ...stock, [field]: value };
      await updateStock(id, updated);
      setStocks((prev) => prev.map((s) => (s.id === id ? updated : s)));
    } catch (err) {
      console.error("Error updating stock", err);
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    try {
      await deleteStock(id);
      setStocks((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Error deleting stock", err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">SQL Model (Postgres)</h2>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* Add stock form */}
          <div className="mb-4 flex gap-2">
            {Object.keys(newStock).map((field) => (
              <input
                key={field}
                placeholder={field}
                value={(newStock as any)[field]}
                onChange={(e) =>
                  setNewStock((prev) => ({
                    ...prev,
                    [field]:
                      field === "volume" ||
                      field === "high" ||
                      field === "low" ||
                      field === "open" ||
                      field === "close"
                        ? Number(e.target.value)
                        : e.target.value,
                  }))
                }
                className="border p-1 rounded"
              />
            ))}
            <button
              onClick={handleAdd}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Add
            </button>
          </div>

          {/* Table */}
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th>ID</th>
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
              {stocks.map((stock) => (
                <tr key={stock.id} className="border-b">
                  {Object.entries(stock).map(([key, value]) =>
                    key === "id" ? (
                      <td key={key}>{value}</td>
                    ) : (
                      <td key={key}>
                        <input
                          value={value}
                          onChange={(e) =>
                            handleUpdate(
                              stock.id,
                              key as keyof Stock,
                              key === "volume" ||
                                key === "high" ||
                                key === "low" ||
                                key === "open" ||
                                key === "close"
                                ? Number(e.target.value)
                                : e.target.value
                            )
                          }
                          className="border p-1 w-full"
                        />
                      </td>
                    )
                  )}
                  <td>
                    <button
                      onClick={() => handleDelete(stock.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between mt-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="bg-gray-300 px-3 py-1 rounded"
            >
              Prev
            </button>
            <span>Page {page}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              className="bg-gray-300 px-3 py-1 rounded"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SqlModel;
