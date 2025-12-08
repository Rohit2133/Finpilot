import React from "react";
import { Link } from "react-router-dom";  // use Link instead of <a>
import "./Navbar.css";
import { assets } from "../../assets/assets";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={assets.main_logo} alt="Logo" />
        <span>FINPILOT</span>
      </div>

      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/chatbot">AI Assistant</Link></li>
        <li><Link to="/services">Services</Link></li>
        <li><Link to="/contact">Contact</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
