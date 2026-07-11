import React from "react";
import { useNavigate } from "react-router-dom";

const HeroSection: React.FC = () => {
  const navigate=useNavigate();
  const HandleBook=()=>navigate("/room");
  return(
  <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-600 text-white">
    {/* Decorative blobs */}
    <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
    <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-violet-400/20 blur-2xl" />

    <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-36 flex flex-col md:flex-row items-center gap-12">
      {/* Left — text */}
      <div className="flex-1 text-center md:text-left">
        <span className="inline-block mb-4 text-xs font-semibold tracking-widest uppercase bg-white/20 rounded-full px-4 py-1">
          📍 Kathmandu, Nepal
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
          Your Home Away
          <br />
          <span className="text-yellow-300">From Home.</span>
        </h1>
        <p className="text-lg md:text-xl text-indigo-100 mb-8 max-w-lg mx-auto md:mx-0">
          Affordable, clean, and full of life. Whether you're backpacking solo
          or travelling with friends — HostelEase has a bed waiting for you.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
          <button onClick={HandleBook} className="bg-yellow-400 hover:bg-yellow-300 text-indigo-900 font-bold px-8 py-3 rounded-full text-base transition-all duration-200 shadow-lg hover:shadow-yellow-300/40 hover:-translate-y-0.5">
            Book a Room
          </button>
          <button className="border border-white/40 hover:bg-white/10 text-white font-medium px-8 py-3 rounded-full text-base transition-all duration-200">
            Take a Tour →
          </button>
        </div>
      </div>

      {/* Right — hostel card */}
      <div className="flex-1 flex justify-center">
        <div className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-3xl p-6 w-72 shadow-2xl">
          <div className="bg-indigo-400/30 rounded-2xl h-44 flex items-center justify-center text-7xl mb-4">
            🏨
          </div>
          <p className="text-white font-semibold text-lg mb-1">HostelEase Hostel</p>
          <p className="text-indigo-200 text-sm mb-3">Thamel District · Est. 2012</p>
          <div className="flex gap-2 flex-wrap">
            {["Free Wi-Fi", "Breakfast", "24/7 Desk"].map((t: string) => (
              <span
                key={t}
                className="text-xs bg-white/20 text-white px-3 py-1 rounded-full"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
          )};

export default HeroSection;
