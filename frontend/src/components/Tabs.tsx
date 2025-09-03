interface TabsProps {
  active: "json" | "sql";
  onChange: (tab: "json" | "sql") => void;
}

export default function Tabs({ active, onChange }: TabsProps) {
  return (
    <div className="flex justify-center gap-4">
      {["json", "sql"].map((tab) => {
        const isActive = active === tab;
        return (
          <button
            key={tab}
            onClick={() => onChange(tab as "json" | "sql")}
            className={`px-6 py-2 text-sm font-semibold rounded-xl transition-all duration-300 ${
              isActive
                ? "bg-white/30 backdrop-blur-md text-blue-700 shadow-lg"
                : "bg-white/10 text-gray-600 hover:bg-white/20 hover:text-gray-800"
            }`}
          >
            {tab === "json" ? "JSON Model" : "SQL Model"}
          </button>
        );
      })}
    </div>
  );
}
