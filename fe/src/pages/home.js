import React from 'react';
import ProductCard from '../components/ProductCard';
import '../styles/home.css'

function Home() {
    const products = [
        {
          image: "/logo192.png",
          title: "상품 1",
          brand: "브랜드 A",
          price: 19.99,
          quantity: 5,
        },
        {
            image: "/logo192.png",
          title: "상품 2",
          brand: "브랜드 B",
          price: 29.99,
          quantity: 8,
        },
        {
            image: "/logo192.png",
          title: "상품 3",
          brand: "브랜드 C",
          price: 39.99,
          quantity: 12,
        },
        {
            image: "/logo192.png",
          title: "상품 4",
          brand: "브랜드 D",
          price: 24.99,
          quantity: 7,
        },
        {
            image: "/logo192.png",
          title: "상품 5",
          brand: "브랜드 A",
          price: 34.99,
          quantity: 3,
        },
        {
            image: "/logo192.png",
          title: "상품 6",
          brand: "브랜드 B",
          price: 44.99,
          quantity: 10,
        },
        {
            image: "/logo192.png",
          title: "상품 7",
          brand: "브랜드 C",
          price: 54.99,
          quantity: 6,
        },
        {
            image: "/logo192.png",
          title: "상품 8",
          brand: "브랜드 D",
          price: 64.99,
          quantity: 4,
        },
        {
            image: "/logo192.png",
          title: "상품 9",
          brand: "브랜드 A",
          price: 74.99,
          quantity: 9,
        },
        {
            image: "/logo192.png",
          title: "상품 10",
          brand: "브랜드 B",
          price: 84.99,
          quantity: 2,
        }
      ];
    
      return (
        <div className="home-page">
        {/* 검색 필터 영역 */}
        <div className="search-filter">
          <input
            type="text"
            placeholder="검색어를 입력하세요..."
            // value={searchTerm}
            // onChange={handleSearch}
          />
          <button className="search-button">
            검색
          </button>
        </div>
  
        {/* 상품 카드 리스트 */}
        <div className='product-container'>
            <div className="product-list">
            {products.map((product, index) => (
                <ProductCard key={index} {...product} />
            ))}
            </div>
        </div>
      
      </div>
  
      );
}

export default Home;