import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart,
  ResponsiveContainer,
} from "recharts";
import data from "../data/stock.json";

interface Stock {
  date: string;
  trade_code: string;
  high: string;
  low: string;
  open: string;
  close: string;
  volume: string;
}

const ITEMS_PER_PAGE = 10;

export default function JsonTable() {
  const [rows, setRows] = useState<Stock[]>([]);
  const [page, setPage] = useState(1);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formRow, setFormRow] = useState<Stock | null>(null);
  const [selectedCode, setSelectedCode] = useState<string>("");

  useEffect(() => {
    const sorted = [...(data as Stock[])].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    setRows(sorted);
    setSelectedCode(sorted[0].trade_code);
  }, []);

  const start = (page - 1) * ITEMS_PER_PAGE;
  const paginated = rows.slice(start, start + ITEMS_PER_PAGE);

  const tradeCodes = Array.from(new Set(rows.map((r) => r.trade_code)));

  // CRUD Handlers
  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setFormRow({ ...rows[index] });
  };

  const handleSave = () => {
    if (formRow && editingIndex !== null) {
      const updated = [...rows];
      updated[editingIndex] = formRow;
      setRows(updated);
      setEditingIndex(null);
      setFormRow(null);
    }
  };

  const handleDelete = (index: number) => {
    const updated = [...rows];
    updated.splice(index, 1);
    setRows(updated);
  };

  const handleAdd = () => {
    const newRow: Stock = {
      date: new Date().toISOString().split("T")[0],
      trade_code: selectedCode || "NEWCODE",
      high: "0",
      low: "0",
      open: "0",
      close: "0",
      volume: "0",
    };
    setRows([newRow, ...rows]);
  };

  const chartData = rows
    .filter((r) => r.trade_code === selectedCode)
    .map((r) => ({
      ...r,
      close: parseFloat(r.close),
      volume: parseInt(r.volume.replace(/,/g, "")),
    }));

  return (
    <div className="bg-white/20 backdrop-blur-lg shadow-xl rounded-2xl overflow-hidden p-6 space-y-6">
      {/* Chart with dropdown */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">
            📈 Stock Performance
          </h2>
          <select
            value={selectedCode}
            onChange={(e) => setSelectedCode(e.target.value)}
            className="px-3 py-2 rounded-lg bg-white/30 backdrop-blur-md"
          >
            {tradeCodes.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="right" dataKey="volume" barSize={20} fill="#82ca9d" />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="close"
              stroke="#8884d8"
              strokeWidth={2}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl">
        <table className="min-w-full text-sm text-gray-800">
          <thead className="bg-white/30">
            <tr>
              {[
                "Date",
                "Trade Code",
                "High",
                "Low",
                "Open",
                "Close",
                "Volume",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left font-semibold tracking-wide"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((row, i) => {
              const globalIndex = start + i;
              const isEditing = editingIndex === globalIndex;

              return (
                <tr
                  key={globalIndex}
                  className="odd:bg-white/10 hover:bg-white/30 transition-colors"
                >
                  {isEditing ? (
                    <>
                      {Object.keys(row).map((key) => (
                        <td key={key} className="px-4 py-2">
                          <input
                            type="text"
                            value={(formRow as any)[key]}
                            onChange={(e) =>
                              setFormRow({
                                ...(formRow as Stock),
                                [key]: e.target.value,
                              })
                            }
                            className="px-2 py-1 rounded bg-white/50 w-full"
                          />
                        </td>
                      ))}
                      <td className="px-4 py-2 space-x-2">
                        <button
                          onClick={handleSave}
                          className="px-3 py-1 bg-green-500 text-white rounded-lg"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingIndex(null)}
                          className="px-3 py-1 bg-gray-400 text-white rounded-lg"
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-2">{row.date}</td>
                      <td className="px-4 py-2">{row.trade_code}</td>
                      <td className="px-4 py-2">{row.high}</td>
                      <td className="px-4 py-2">{row.low}</td>
                      <td className="px-4 py-2">{row.open}</td>
                      <td className="px-4 py-2">{row.close}</td>
                      <td className="px-4 py-2">{row.volume}</td>
                      <td className="px-4 py-2 space-x-2">
                        <button
                          onClick={() => handleEdit(globalIndex)}
                          className="px-3 py-1 bg-blue-500 text-white rounded-lg"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(globalIndex)}
                          className="px-3 py-1 bg-red-500 text-white rounded-lg"
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add row + Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg"
        >
          ➕ Add Row
        </button>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 bg-gray-300 rounded-lg disabled:opacity-50"
          >
            ← Previous
          </button>
          <span className="text-gray-700 font-medium">
            Page {page} of {Math.ceil(rows.length / ITEMS_PER_PAGE)}
          </span>
          <button
            onClick={() =>
              setPage((p) => (p < rows.length / ITEMS_PER_PAGE ? p + 1 : p))
            }
            disabled={page >= rows.length / ITEMS_PER_PAGE}
            className="px-3 py-1 bg-gray-300 rounded-lg disabled:opacity-50"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
