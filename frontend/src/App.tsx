import { useState } from "react";
import Tabs from "./components/Tabs";
import JsonTable from "./components/JsonTable";
import SqlTable from "./components/SqlTable";

export default function App() {
  const [activeTab, setActiveTab] = useState<"json" | "sql">("json");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-800 drop-shadow-md">
            📊 Stock Data Viewer
          </h1>
          <p className="text-gray-600 mt-2">
            Switch between <span className="font-semibold">JSON</span> and{" "}
            <span className="font-semibold">SQL</span> models
          </p>
        </header>

        <Tabs active={activeTab} onChange={setActiveTab} />

        <div className="mt-8">
          {activeTab === "json" ? <JsonTable /> : <SqlTable />}
        </div>
      </div>
    </div>
  );
}
