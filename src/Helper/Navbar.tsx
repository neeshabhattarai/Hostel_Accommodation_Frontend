import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "../auth/Authentication";
import isAdmin from "./isAdmin";

const IDLE_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((store) => store.isAuthenticated);
  const clearToken = useAuthStore((store) => store.clearToken);
  const role = useAuthStore().user?.role;
  const authed = isAuthenticated();
  // console.log(role);
  // Pull name/email from your auth store — adjust field names to match yours
  const userName = (useAuthStore()?.user?.firstName ?? "") + " " + (useAuthStore()?.user?.lastName ?? "");
  const userEmail = useAuthStore()?.user?.email ?? "";

  // Derive initials from name
  const initials = userName
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    
    setShowLogoutAlert(false);
    navigate("/login");
    clearToken();
  };

  // --- Auto logout after 30 minutes of inactivity ---
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!authed) return;

    const resetIdleTimer = () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
       
        navigate("/login");
        clearToken();
      }, IDLE_TIMEOUT_MS);
    };

    const activityEvents = ["mousemove", "mousedown", "keydown", "scroll", "touchstart"];
    activityEvents.forEach((evt) => window.addEventListener(evt, resetIdleTimer));
    resetIdleTimer();

    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      activityEvents.forEach((evt) => window.removeEventListener(evt, resetIdleTimer));
    };
  }, [authed, clearToken, navigate]);

  const publicLinks = [
    { label: "Home", path: "/" },
    { label: "Room", path: "/room" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  const commonAuthLinks = [
    { label: "Home", path: "/" },

  ];

  const authLinks = isAdmin(role)
    ? commonAuthLinks.concat([
        { label: "Dashboard", path: "/dashboard" },
        { label: "AllRoom", path: "/allroom" },
        { label: "AllBooking", path: "/allbooking" },
        { label: "Hostel", path: "/hostel" },
      ])
    : commonAuthLinks.concat([
      {label: "Room", path: "/room" },
      { label: "Booking", path: "/booking" },
      { label: "About", path: "/about" },
      { label: "Contact", path: "/contact" },
    ]);

  const navLinks = authed ? authLinks : publicLinks;

  return (
    <>
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

            {/* Auth Buttons / Profile Avatar */}
            <div className="hidden md:flex items-center gap-3">
              {authed ? (
                <div className="flex items-center gap-3">
                  {/* Profile avatar dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setShowProfileMenu((p) => !p)}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-slate-800 transition-colors duration-200 group"
                    >
                      {/* Avatar circle */}
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                        {initials}
                      </div>
                      <span className="text-slate-300 text-sm font-medium group-hover:text-white transition-colors max-w-[100px] truncate">
                        {userName}
                      </span>
                      {/* Chevron */}
                      <svg
                        className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${showProfileMenu ? "rotate-180" : ""}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Dropdown menu */}
                    {showProfileMenu && (
                      <>
                        {/* Click-away overlay */}
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setShowProfileMenu(false)}
                        />
                        <div className="absolute right-0 top-full mt-2 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-20 overflow-hidden">
                          {/* User info header */}
                          <div className="px-4 py-3 border-b border-slate-700/60">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                                {initials}
                              </div>
                              <div className="min-w-0">
                                <p className="text-white text-sm font-semibold truncate">{userName}</p>
                                <p className="text-slate-400 text-xs truncate">{userEmail}</p>
                              </div>
                            </div>
                          </div>

                          {/* Menu items */}
                          <div className="py-1.5">
                            <button
                              onClick={() => { setShowProfileMenu(false); navigate("/profile"); }}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                            >
                              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                              </svg>
                              View Profile
                            </button>

                            <button
                              onClick={() => { setShowProfileMenu(false); navigate("/profile/edit"); }}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                            >
                              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                              </svg>
                              Edit Profile
                            </button>
                          </div>

                          {/* Divider + Logout */}
                          <div className="border-t border-slate-700/60 py-1.5">
                            <button
                              onClick={() => { setShowProfileMenu(false); setShowLogoutAlert(true); }}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                              </svg>
                              Log out
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <>
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
                </>
              )}
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
              {authed ? (
                <>
                  {/* Mobile avatar header */}
                  <div className="flex items-center gap-3 px-4 py-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white text-sm font-semibold truncate">{userName}</p>
                      <p className="text-slate-400 text-xs truncate">{userEmail}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => { setMenuOpen(false); navigate("/profile"); }}
                    className="block w-full text-left px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => { setMenuOpen(false); navigate("/profile/edit"); }}
                    className="block w-full text-left px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={() => { setMenuOpen(false); setShowLogoutAlert(true); }}
                    className="block w-full text-left px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-500 rounded-md transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Logout Confirmation Alert */}
      {showLogoutAlert && (
        <div className="fixed inset-0 z-100 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowLogoutAlert(false)}
          />
          <div className="relative bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <div className="w-10 h-10 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
              <span className="text-red-400 text-xl">⚠</span>
            </div>
            <h2 className="text-white font-semibold text-lg mb-1">
              Log out of HostelEase?
            </h2>
            <p className="text-slate-400 text-sm mb-6">
              You'll need to sign in again to access your account.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutAlert(false)}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-500 rounded-lg transition-colors"
              >
                Yes, log out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
