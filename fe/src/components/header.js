import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // AuthProvider에서 export한 훅

import "../styles/header.css"; // Header 전용 CSS 파일 import

function Header() {
  const { logout } = useAuth();

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">Dopee</Link>
      </div>
      <nav className="nav">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/crawl">Crawl Management</Link>
          </li>
          <li>
            <Link to="/about">Brand Products</Link>
          </li>
          <li>
            <Link
              to="#"
              onClick={(e) => {
                e.preventDefault();
                logout();
              }}
            >
              logout
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
