import Header from './components/header.js';
import Home from './pages/home';
import Crawl from './pages/crawl'
import LoginPage from './pages/login'
import Footer from './components/footer.js';
import { BrowserRouter, Routes, Route,useLocation } from 'react-router-dom';
import {useAuth } from './contexts/AuthContext';
import React, { useState} from 'react';
import './App.css';
import Login from './components/login';       // 로그인 화면

function App() {

    const { isLoggedIn,login,logout } = useAuth();
    // 1️useLocation을 호출해서 현재 경로 정보 획득
    const location = useLocation();
    const noLayoutPaths = ['/login'];
    const isLoginPage = noLayoutPaths.includes(location.pathname);


    if (!isLoggedIn) {
      // 로그인 컴포넌트만 보이도록
      return <Login/>;
    }

  return (
    
      <div className="app-container">
          {!isLoginPage && <Header />} 
          <div className="main-content">
            <Routes>
                <Route path="/" element={<Home />} /> 
                <Route path="/crawl" element={<Crawl/>} />
                <Route path="/login" element={<LoginPage/>} />
              </Routes>
          </div>
         {!isLoginPage && <Footer/>}
      </div>
  );
}

export default App;