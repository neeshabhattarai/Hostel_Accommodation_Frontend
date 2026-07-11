import React from "react";
import type { Testimonial } from "../../../types/index";

const TestimonialCard: React.FC<Testimonial> = ({
  name,
  country,
  text,
  avatar,
  color,
}) => (
  <div className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-shadow duration-200">
    <p className="text-gray-600 text-sm leading-relaxed mb-6">"{text}"</p>
    <div className="flex items-center gap-3">
      <div
        className={`w-10 h-10 rounded-full ${color} flex items-center justify-center text-sm font-bold`}
      >
        {avatar}
      </div>
      <div>
        <p className="font-semibold text-gray-900 text-sm">{name}</p>
        <p className="text-xs text-gray-400">{country}</p>
      </div>
    </div>
  </div>
);

export default TestimonialCard;
