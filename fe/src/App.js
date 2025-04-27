import Header from './components/header.js';
import Home from './pages/home';
import Crawl from './pages/crawl'
import Footer from './components/footer.js';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React, { useState } from 'react';
import './App.css';
import Login from './components/login';       // 로그인 화면

function App() {

    // 1) 인증 상태 관리
    const [isLoggedIn, setIsLoggedIn] = useState(false);


    // 2) 실제 로그인 처리 함수 (예: API 호출 후 성공 시 호출)
    const handleLogin = (credentials) => {
      console.log("로그인 성공");
      setIsLoggedIn(true);
    };

    // 3) 로그아웃 처리 (필요하다면)
    const handleLogout = () => {
      setIsLoggedIn(false);
    };

      // — 아직 로그인 안 된 경우 —
    if (!isLoggedIn) {
      // 로그인 컴포넌트만 보이도록
      return <Login onLogin={handleLogin} />;
    }

  return (
    <div className="app-container">
      <Header />
      <div className="main-content">
        <Routes>
            <Route path="/" element={<Home />} /> 
            <Route path="/crawl" element={<Crawl/>} />
          </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;