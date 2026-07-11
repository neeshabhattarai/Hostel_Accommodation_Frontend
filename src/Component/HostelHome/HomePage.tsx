import React from "react";
import { ToastContainer } from "react-toastify";
import { Outlet, useNavigate } from "react-router-dom";

import HeroSection from "./sections/HeroSection";
import StatsSection from "./sections/StatsSection";
import FeaturesSection from "./sections/FeaturesSection";
import RoomsSection from "./sections/RoomsSection";
import CTASection from "./sections/CTASection";
import Footer from "./sections/Footer";

const HomePage=()=>{
  const navigate=useNavigate();
  const HandleClick=()=>{return navigate("/room")};
  return <div className="min-h-screen bg-white font-sans">
  
    <HeroSection />
    <StatsSection />
    <FeaturesSection />
    <RoomsSection />
    {/* <TestimonialsSection /> */}
    <CTASection HandleClick={HandleClick} />
    <Footer />
    <Outlet />
    <ToastContainer autoClose={5000} position="top-right" />
  </div>
};

export default HomePage;
