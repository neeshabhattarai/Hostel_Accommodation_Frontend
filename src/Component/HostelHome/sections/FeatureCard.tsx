import React from "react";
import type { Feature } from "../../../types/index";

const FeatureCard: React.FC<Feature> = ({ icon, title, desc }) => (
  <div className="group bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-base font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
  </div>
);

export default FeatureCard;
