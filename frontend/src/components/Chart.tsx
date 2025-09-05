// src/components/Chart.tsx
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ChartProps {
  data: any[];
  tradeCodes: string[];
  selectedCode: string;
  onCodeChange: (code: string) => void;
}

export default function Chart({
  data,
  tradeCodes,
  selectedCode,
  onCodeChange,
}: ChartProps) {
  const chartData = data
    .filter((r) => r.trade_code === selectedCode)
    .map((r) => ({
      ...r,
      close: parseFloat(r.close),
      volume:
        typeof r.volume === "string"
          ? parseInt(r.volume.replace(/,/g, ""))
          : Number(r.volume),
    }));

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">
          📈 Stock Performance
        </h2>
        <select
          value={selectedCode}
          onChange={(e) => onCodeChange(e.target.value)}
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
  );
}
