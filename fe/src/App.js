import Header from './components/header.js';
import Home from './pages/home';
import Crawl from './pages/crawl'
import Footer from './components/footer.js';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {useAuth } from './contexts/AuthContext';
import React, { useState } from 'react';
import './App.css';
import Login from './components/login';       // 로그인 화면

function App() {

    const { isLoggedIn,login,logout } = useAuth();

    if (!isLoggedIn) {
      // 로그인 컴포넌트만 보이도록
      return <Login/>;
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