import React from "react";
import FeatureCard from "./FeatureCard";
import { features } from "../../data/index";
import type { Feature } from "../../../types/index";

const FeaturesSection: React.FC = () => (
  <section className="max-w-6xl mx-auto px-6 py-20">
    <div className="text-center mb-12">
      <span className="text-xs font-bold tracking-widest uppercase text-indigo-500">
        Why HostelEase?
      </span>
      <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2">
        Everything you need, nothing you don't.
      </h2>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {features.map((f: Feature) => (
        <FeatureCard key={f.title} {...f} />
      ))}
    </div>
  </section>
);

export default FeaturesSection;
