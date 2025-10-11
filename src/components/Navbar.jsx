import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, Dumbbell, Home as HomeIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const links = [
  { name: "Home", to: "/", icon: <HomeIcon size={18} /> },
  {
    name: "Workout",
    dropdown: [
      { name: "Yoga", to: "/workout/yoga" },
      { name: "Meditation", to: "/workout/meditation" },
      { name: "Challenges", to: "/workout/challenges" },
    ],
    icon: <Dumbbell size={18} />,
  },
  { name: "Routine", to: "/routine" },
  { name: "Diet", to: "/diet" },
  { name: "About", to: "/about" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [desktopWorkoutOpen, setDesktopWorkoutOpen] = useState(false);
  const [mobileWorkoutOpen, setMobileWorkoutOpen] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-neutral-900 text-white shadow-md w-full fixed top-0 left-0 z-50">
      <div className="w-full px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 text-3xl font-bold bg-clip-text text-transparent flex items-center gap-2"
          >
            <Dumbbell className="text-orange-400" /> FitLife
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center font-semibold relative">
            {links.map((link) =>
              link.dropdown ? (
                <div
                  key={link.name}
                  className="relative"
                  onMouseEnter={() => setDesktopWorkoutOpen(true)}
                  onMouseLeave={() => setDesktopWorkoutOpen(false)}
                >
                  <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gradient-to-r hover:from-red-500 hover:to-purple-600 transition">
                    {link.icon} {link.name}
                  </button>
                  {desktopWorkoutOpen && (
                    <div className="absolute top-full left-0 mt-2 w-44 bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg flex flex-col text-sm z-50">
                      {link.dropdown.map((item) => (
                        <Link
                          key={item.name}
                          to={item.to}
                          className="block w-full px-4 py-2 hover:bg-blue-600 transition"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.name}
                  to={link.to}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gradient-to-r hover:from-blue-500 hover:to-green-400 transition"
                >
                  {link.icon} {link.name}
                </Link>
              )
            )}

            {!user ? (
              <Link
                to="/login"
                className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-bold px-4 py-2 rounded-lg hover:opacity-90 transition"
              >
                Login
              </Link>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/dashboard"
                  className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-600 rounded-full flex items-center justify-center text-black font-bold"
                  title={user.name}
                >
                  {user.name ? user.name[0].toUpperCase() : <User className="text-black" />}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-red-400 flex items-center gap-1 hover:text-red-500 transition"
                >
                  <LogOut className="w-5 h-5" /> Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-yellow-400"
            aria-label="Toggle Menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-neutral-900 p-4 space-y-4">
          {links.map((link) =>
            link.dropdown ? (
              <div key={link.name}>
                <button
                  onClick={() => setMobileWorkoutOpen(!mobileWorkoutOpen)}
                  className="flex justify-between w-full px-3 py-2 rounded-lg hover:bg-red-500 transition"
                >
                  {link.name} <span>{mobileWorkoutOpen ? "▲" : "▼"}</span>
                </button>
                {mobileWorkoutOpen && (
                  <div className="ml-4 mt-2 flex flex-col space-y-2">
                    {link.dropdown.map((item) => (
                      <Link
                        key={item.name}
                        to={item.to}
                        className="block w-full px-3 py-2 rounded-lg hover:bg-blue-500 transition"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={link.name}
                to={link.to}
                className="block w-full px-3 py-2 rounded-lg hover:bg-teal-500 transition"
              >
                {link.name}
              </Link>
            )
          )}

          {!user ? (
            <Link
              to="/login"
              className="block w-full text-center bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-bold px-4 py-2 rounded-lg hover:opacity-90 transition"
            >
              Login
            </Link>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                to="/dashboard"
                className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-black font-bold"
                title={user.name}
              >
                {user.name ? user.name[0].toUpperCase() : <User className="text-black" />}
              </Link>
              <button
                onClick={handleLogout}
                className="text-red-400 flex items-center gap-1 hover:text-red-500 transition"
              >
                <LogOut className="w-5 h-5" /> Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
