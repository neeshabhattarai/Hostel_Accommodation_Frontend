import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Booking", path: "/booking" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900 border-b border-slate-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">
             HostelEase
            </span>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ label, path }) => (
              <NavLink
                key={path}
                to={path}
                end={path === "/"}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "bg-indigo-600 text-white"
                      : "text-slate-300 hover:text-white hover:bg-slate-800"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                  isActive
                    ? "text-indigo-400 bg-slate-800"
                    : "text-slate-300 hover:text-white"
                }`
              }
            >
              Log In
            </NavLink>
            <NavLink
              to="/signup"
              className={({ isActive }) =>
                `px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                  isActive
                    ? "bg-indigo-700 text-white"
                    : "bg-indigo-600 text-white hover:bg-indigo-500"
                }`
              }
            >
              Sign Up
            </NavLink>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-slate-300 hover:text-white p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-5 h-0.5 bg-current mb-1 transition-all" />
            <div className="w-5 h-0.5 bg-current mb-1 transition-all" />
            <div className="w-5 h-0.5 bg-current transition-all" />
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-700 px-4 pb-4 pt-2 space-y-1">
          {navLinks.map(({ label, path }) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/"}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "text-slate-300 hover:text-white hover:bg-slate-800"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <div className="pt-2 border-t border-slate-700 flex flex-col gap-2">
            <NavLink
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-2 text-sm font-medium text-slate-300 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
            >
              Log In
            </NavLink>
            <NavLink
              to="/signup"
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors"
            >
              Sign Up
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;