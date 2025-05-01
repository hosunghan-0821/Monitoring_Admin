import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/header.css'; // Header 전용 CSS 파일 import

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">Dopee</Link>
      </div>
      <nav className="nav">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/crawl">Crawl Management</Link></li>
          <li><Link to="/about">Brand Products</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;