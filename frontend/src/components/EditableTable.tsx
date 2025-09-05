// src/components/EditableTable.tsx
import { useState } from "react";

interface TableProps {
  rows: any[];
  setRows: (rows: any[]) => void;
  itemsPerPage?: number;
}

export default function EditableTable({
  rows,
  setRows,
  itemsPerPage = 20,
}: TableProps) {
  const [page, setPage] = useState(1);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formRow, setFormRow] = useState<any | null>(null);

  const start = 0;
  const end = page * itemsPerPage;
  const paginated = rows.slice(start, end);
  const columns = [
    "date",
    "trade_code",
    "high",
    "low",
    "open",
    "close",
    "volume",
  ];

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
    const newRow = {
      date: new Date().toISOString().split("T")[0],
      trade_code: "NEWCODE",
      high: "0",
      low: "0",
      open: "0",
      close: "0",
      volume: "0",
    };
    setRows([newRow, ...rows]);
  };

  return (
    <div className="overflow-x-auto rounded-xl mt-6">
      <div className="flex justify-center items-center my-4">
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg"
        >
          ➕ Add Row
        </button>
      </div>
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
            const isEditing = editingIndex === i;

            return (
              <tr
                key={i}
                className="odd:bg-white/10 hover:bg-white/30 transition-colors"
              >
                {isEditing ? (
                  <>
                    {columns.map((key) => (
                      <td key={key} className="px-4 py-2">
                        <input
                          type="text"
                          value={formRow[key]}
                          onChange={(e) =>
                            setFormRow({ ...formRow, [key]: e.target.value })
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
                    {columns.map((key) => (
                      <td key={key} className="px-4 py-2">
                        {row[key]}
                      </td>
                    ))}
                    <td className="px-4 py-2 space-x-2">
                      <button
                        onClick={() => handleEdit(i)}
                        className="px-3 py-1 bg-blue-500 text-white rounded-lg"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(i)}
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

      {/* Pagination */}
      <div className="flex justify-center items-center mt-4">
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={end >= rows.length}
          className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
        >
          Load More ↓
        </button>
      </div>
    </div>
  );
}
