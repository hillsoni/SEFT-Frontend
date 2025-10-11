import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaArrowUp,
} from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-black text-center py-12 border-t border-gray-800 relative">
      {/* Brand */}
      <Link
        to="/"
        className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent mb-2 inline-block tracking-wide"
      >
        FitLife
      </Link>
      <p className="text-gray-300 text-lg mt-1">
        Your <span className="text-green-400 font-semibold">AI-Powered</span>{" "}
        Fitness Companion
      </p>
      <p className="text-gray-500 mt-2 text-sm">
        &copy; {new Date().getFullYear()} FitLife. All rights reserved.
      </p>

      {/* Social Links */}
      <div className="flex justify-center gap-6 mt-6 text-2xl">
        <a
          href="#"
          aria-label="Facebook"
          className="text-gray-400 hover:text-blue-500 transition-colors duration-300"
        >
          <FaFacebookF />
        </a>
        <a
          href="#"
          aria-label="Twitter"
          className="text-gray-400 hover:text-sky-400 transition-colors duration-300"
        >
          <FaTwitter />
        </a>
        <a
          href="#"
          aria-label="Instagram"
          className="text-gray-400 hover:text-pink-500 transition-colors duration-300"
        >
          <FaInstagram />
        </a>
        <a
          href="#"
          aria-label="LinkedIn"
          className="text-gray-400 hover:text-blue-600 transition-colors duration-300"
        >
          <FaLinkedinIn />
        </a>
      </div>

      {/* Back to Top Button */}
      <a
        href="#top"
        aria-label="Back to top"
        className="absolute right-6 bottom-6 bg-gradient-to-r from-orange-500 via-green-400 to-blue-500 p-3 rounded-full shadow-lg hover:scale-110 transition-transform duration-300"
      >
        <FaArrowUp className="text-white text-lg" />
      </a>
    </footer>
  );
}
