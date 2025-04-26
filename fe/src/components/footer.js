import React from 'react';
import '../styles/footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="footer-company">
          &copy; 2022–2025 Dopee Admin. All rights reserved.
        </p>
        <p className="footer-company-details">
          사업자등록번호 123-45-67890 | 서울특별시 강남구 테헤란로 123, Dopee 빌딩
        </p>
        <div className="footer-contact">
          <span>이메일: support@dopee.com</span>
          <span>전화: 02-1234-5678</span>
        </div>
        {/* <div className="footer-links">
          <a href="/terms">이용약관</a>
          <a href="/privacy">개인정보처리방침</a>
        </div> */}
        <div className="footer-meta">
          <span>Admin v1.0.0</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;