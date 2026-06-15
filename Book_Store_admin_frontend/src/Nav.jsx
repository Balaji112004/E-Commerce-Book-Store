import React from "react";
import { NavLink, Outlet } from "react-router-dom";

function Nav() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header with horizontal nav */}
      <div className="flex justify-between items-center px-6 py-4 bg-white shadow">
        {/* Left side: Title and links */}
        <div className="flex items-center space-x-6">
          <h1 className="font-bold text-2xl poppins">Book Store Admin</h1>
          
          <NavLink
            to="dashboard"
            className={({ isActive }) =>
              `py-1 px-3 rounded-lg font-semibold transition ${
                isActive ? "bg-gray-200" : "hover:bg-gray-100"
              }`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="books"
            className={({ isActive }) =>
              `py-1 px-3 rounded-lg font-semibold transition ${
                isActive ? "bg-gray-200" : "hover:bg-gray-100"
              }`
            }
          >
            Books
          </NavLink>

          <NavLink
            to="order"
            className={({ isActive }) =>
              `py-1 px-3 rounded-lg font-semibold transition ${
                isActive ? "bg-gray-200" : "hover:bg-gray-100"
              }`
            }
          >
            Orders
          </NavLink>

          <NavLink
            to="user"
            className={({ isActive }) =>
              `py-1 px-3 rounded-lg font-semibold transition ${
                isActive ? "bg-gray-200" : "hover:bg-gray-100"
              }`
            }
          >
            Users
          </NavLink>
        </div>

        {/* Right side: Bell icon */}
        <i className="bx bx-bell text-black text-2xl"></i>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <Outlet />
      </div>
    </div>
  );
}

export default Nav;
