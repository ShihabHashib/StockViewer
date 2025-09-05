// src/components/JsonModel.tsx
import { useEffect, useState } from "react";
import data from "../../../backend/data/stock.json";
import LoadingSpinner from "./LoadingSpinner";
import Chart from "./Chart";
import EditableTable from "./EditableTable";

export default function JsonModel() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCode, setSelectedCode] = useState<string>("");

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      const sorted = [...data].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      setRows(sorted);
      setSelectedCode(sorted[0].trade_code);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timeout);
  }, []);

  const tradeCodes = Array.from(new Set(rows.map((r) => r.trade_code)));

  return (
    <div className="bg-white/20 backdrop-blur-lg shadow-xl rounded-2xl overflow-hidden p-6 space-y-6">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <Chart
            data={rows}
            tradeCodes={tradeCodes}
            selectedCode={selectedCode}
            onCodeChange={setSelectedCode}
          />
          <EditableTable rows={rows} setRows={setRows} itemsPerPage={20} />
        </>
      )}
    </div>
  );
}
