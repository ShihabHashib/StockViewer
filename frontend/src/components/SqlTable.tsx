// src/components/SqlModel.tsx
import { useEffect, useState } from "react";
import {
  fetchStocks,
  createStock,
  updateStock,
  deleteStock,
} from "../services/api";
import LoadingSpinner from "./LoadingSpinner";
import Chart from "./Chart";
import EditableTable from "./EditableTable";

type Row = {
  id?: number | null;
  date: string;
  trade_code: string;
  high: number | string;
  low: number | string;
  open: number | string;
  close: number | string;
  volume: number | string;
};

export default function SqlModel() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCode, setSelectedCode] = useState<string>("");

  // Load rows from backend
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await fetchStocks(); // uses ../services/api
        const list: Row[] = Array.isArray(data) ? data : data?.stocks ?? [];

        // Normalize: ensure date strings, and sort ascending for chart
        list.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        setRows(list);
        if (list.length) setSelectedCode(list[0].trade_code);
      } catch (err) {
        console.error("Failed to fetch SQL stocks:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const tradeCodes = Array.from(new Set(rows.map((r) => r.trade_code)));

  // Called by EditableTable when user adds/edits/deletes rows.
  // Strategy: detect added items (no id) -> POST, deleted items -> DELETE,
  // updated items -> PUT. After syncing, re-fetch to get canonical state.
  const handleSetRows = async (updatedRows: Row[]) => {
    setLoading(true);
    try {
      // 1) Added rows: items that don't have an id or id not present in old rows
      const added = updatedRows.filter(
        (u) => u.id == null || !rows.some((r) => r.id === u.id)
      );

      for (const a of added) {
        try {
          const created = await createStock(a);
          // replace the temp row in updatedRows with created (match by index/content)
          updatedRows = updatedRows.map((u) => (u === a ? created : u));
        } catch (e) {
          console.error("Create failed for", a, e);
        }
      }

      // 2) Deleted rows: items present in old rows but not in updatedRows (by id)
      const deleted = rows.filter(
        (r) => r.id != null && !updatedRows.some((u) => u.id === r.id)
      );
      for (const d of deleted) {
        try {
          if (d.id != null) await deleteStock(d.id);
        } catch (e) {
          console.error("Delete failed for", d, e);
        }
      }

      // 3) Updated rows: same id exists but content changed
      for (const u of updatedRows) {
        if (u.id != null) {
          const original = rows.find((r) => r.id === u.id);
          if (original && JSON.stringify(original) !== JSON.stringify(u)) {
            try {
              await updateStock(u.id, u);
            } catch (e) {
              console.error("Update failed for", u, e);
            }
          }
        }
      }

      // 4) Re-fetch canonical list from backend to ensure IDs and ordering are correct
      const fresh = await fetchStocks();
      const freshList: Row[] = Array.isArray(fresh)
        ? fresh
        : fresh?.stocks ?? [];
      freshList.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      setRows(freshList);

      // if selectedCode disappeared, reset it
      if (
        freshList.length &&
        !freshList.some((r) => r.trade_code === selectedCode)
      ) {
        setSelectedCode(freshList[0].trade_code);
      }
    } catch (err) {
      console.error("Error syncing rows:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/20 backdrop-blur-lg shadow-xl rounded-2xl overflow-hidden p-6 space-y-6">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* Chart */}
          <Chart
            data={rows}
            tradeCodes={tradeCodes}
            selectedCode={selectedCode}
            onCodeChange={setSelectedCode}
          />

          {/* Editable Table */}
          <EditableTable
            rows={rows}
            setRows={handleSetRows}
            itemsPerPage={20}
          />
        </>
      )}
    </div>
  );
}
