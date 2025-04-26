import React from 'react';
import Header from './components/header.js';
import Home from './pages/home';
import Crawl from './pages/crawl'
import Footer from './components/footer.js';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

function App() {
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