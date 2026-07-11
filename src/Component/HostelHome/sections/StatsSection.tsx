import React from "react";
import { stats } from "../../data/index";
import type { Stat } from "../../../types/index";

const StatsSection: React.FC = () => (
  <section className="bg-indigo-50 border-y border-indigo-100">
    <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
      {stats.map((s: Stat) => (
        <div key={s.label}>
          <p className="text-3xl font-extrabold text-indigo-600">{s.value}</p>
          <p className="text-sm text-gray-500 mt-1">{s.label}</p>
        </div>
      ))}
    </div>
  </section>
);

export default StatsSection;
