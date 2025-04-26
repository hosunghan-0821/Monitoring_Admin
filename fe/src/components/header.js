import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/header.css'; // Header 전용 CSS 파일 import

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">Dopee Admin</Link>
      </div>
      <nav className="nav">
        <ul>
          <li><Link to="/">홈</Link></li>
          <li><Link to="/crawl">크롤링 관리</Link></li>
          <li><Link to="/about">소개</Link></li>
          <li><Link to="/contact">연락처</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;