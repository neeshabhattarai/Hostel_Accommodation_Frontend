import React from "react";

const Footer: React.FC = () => (
  <footer className="bg-gray-900 text-gray-400 py-10">
    <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
      <div>
        <p className="text-white font-bold text-lg">🏨 HostelEase</p>
        <p className="text-xs mt-1">
          Thamel, Kathmandu, Nepal · hello@hostelease.com
        </p>
      </div>
      <p className="text-xs">
        © {new Date().getFullYear()} HostelEase Hostel. All rights reserved.
      </p>
    </div>
  </footer>
);

export default Footer;
