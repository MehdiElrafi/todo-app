import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../hooks/useAuth";

const ProfileDropdown = () => {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    return (
        <div ref={dropdownRef} className="relative">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="cursor-pointer flex items-center gap-2 rounded-lg transition-colors duration-200"
            >
              <div className="w-6 h-6 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center font-semibold">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            </button>

            {/* Dropdown Menu with Animation */}
            {isOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 animate-slideUp">
                <button
                  onClick={() => {
                    logout();
                  }}
                  className="cursor-pointer w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
    );
};

export default ProfileDropdown;
