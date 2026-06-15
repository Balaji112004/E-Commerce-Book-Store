import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <div className='h-[35px] bg-black mt-5'>
<footer className="bg-gray-900 text-gray-300 mt-16">
  {/* Top Section */}
  <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-5 gap-10">
    
    {/* Brand */}
    <div className="col-span-2">
      <h2 className="text-3xl font-bold text-white mb-3">Bookify</h2>
      <p className="text-sm leading-relaxed text-gray-400 w-[70%]">
        Discover, read, and shop your favorite books from a wide range of
        genres. Your one-stop destination for readers.
      </p>
    </div>

    {/* Quick Links */}
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
      <ul className="space-y-2 text-sm">
        <li className="hover:text-white cursor-pointer">
          <Link to="/home">Home</Link>
        </li>
        <li className="hover:text-white cursor-pointer">Shop</li>
        <li className="hover:text-white cursor-pointer">
          <Link to="/order">Orders</Link>
        </li>
        <li className="hover:text-white cursor-pointer">
          <Link to="/cart">Cart</Link>
        </li>
      </ul>
    </div>

    {/* Categories */}
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">Categories</h3>
      <ul className="space-y-2 text-sm">
        <li className="hover:text-white cursor-pointer">Fiction</li>
        <li className="hover:text-white cursor-pointer">Self-Help</li>
        <li className="hover:text-white cursor-pointer">Business</li>
        <li className="hover:text-white cursor-pointer">Fantasy</li>
      </ul>
    </div>

    {/* Social */}
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
      <div className="flex gap-4 text-xl">
        <i className="bx bxl-facebook hover:text-white cursor-pointer"></i>
        <i className="bx bxl-instagram hover:text-white cursor-pointer"></i>
        <i className="bx bxl-twitter hover:text-white cursor-pointer"></i>
        <i className="bx bxl-linkedin hover:text-white cursor-pointer"></i>
      </div>
    </div>

  </div>

  {/* Bottom Bar */}
  <div className="border-t border-gray-800 py-4 text-center text-sm text-gray-400">
    © 2025 <span className="text-white font-semibold">Bookify</span>. All Rights Reserved.
  </div>
</footer>

    </div>
  )
}

export default Footer