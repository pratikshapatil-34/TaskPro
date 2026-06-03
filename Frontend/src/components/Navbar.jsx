import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Settings, ChevronDown } from 'lucide-react';

const NavBar = ({ user = {}, onLogout }) => {
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleLogout = () => {
    setMenuOpen(false);

    if (onLogout) {
      onLogout();
    }
  };

  return (
    <header
      className="sticky top-0 z-50 bg-white/90 backdrop-blur-md 
      shadow-sm border-b border-gray-200 font-sans"
    >
      <div
        className="flex items-center justify-between 
        px-4 py-3 md:px-6 max-w-7xl mx-auto"
      >

        {/* LOGO */}
        <div
          className="flex items-center space-x-2 cursor-pointer group"
          onClick={() => navigate('/')}
        >
          <div
            className="relative w-10 h-10 flex items-center 
            justify-center rounded-xl bg-gradient-to-br 
            from-fuchsia-500 via-purple-500 to-indigo-500 
            shadow-lg group-hover:shadow-purple-300/50 
            group-hover:scale-105 transition-all duration-300"
          >
            <Zap className="h-6 w-6 text-white" />
          </div>

          <span
            className="text-2xl font-extrabold bg-gradient-to-r 
            from-fuchsia-500 via-purple-500 to-indigo-500 
            bg-clip-text text-transparent tracking-wide"
          >
            TaskPro
          </span>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">

          {/* SETTINGS */}
          <button
            className="p-2 text-gray-600 hover:text-purple-500 
            hover:bg-purple-50 rounded-full transition-colors duration-300"
            onClick={() => navigate('/profile')}
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* PROFILE DROPDOWN */}
          <div className="relative" ref={menuRef}>

            {/* PROFILE BUTTON */}
            <div
              onClick={handleMenuToggle}
              className="flex items-center gap-2 px-3 py-2 
              rounded-full cursor-pointer hover:bg-purple-50 
              transition-all duration-300"
            >

              {/* AVATAR */}
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="avatar"
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div
                  className="w-8 h-8 rounded-full bg-purple-500 
                  text-white flex items-center justify-center"
                >
                  {user?.name?.[0] || 'U'}
                </div>
              )}

              {/* USER INFO */}
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium">
                  {user?.name || 'User'}
                </p>

                <p className="text-xs text-gray-500">
                  {user?.email || 'user@email.com'}
                </p>
              </div>

              {/* ICON */}
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-300 ${
                  menuOpen ? 'rotate-180' : ''
                }`}
              />
            </div>

            {/* DROPDOWN MENU */}
            {menuOpen && (
              <div
                className="absolute right-0 top-14 w-56 bg-white 
                rounded-2xl shadow-xl border border-gray-200 z-50"
              >

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    navigate('/profile');
                  }}
                  className="w-full text-left px-4 py-3 
                  hover:bg-gray-50"
                >
                  Profile
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 
                  hover:bg-gray-50 text-red-500"
                >
                  Logout
                </button>

              </div>
            )}

          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;