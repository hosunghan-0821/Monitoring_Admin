import React from 'react';
import './ProductCard.css';

function ProductCard({ image, title, brand, price, quantity }) {
  return (
    <div className="product-card">
      <div className="product-image">
        <img src={image} alt={title} />
      </div>
      <div className="product-details">
        <h2 className="product-title">{title}</h2>
        <p className="product-brand">브랜드: {brand}</p>
        <p className="product-price">가격: ${price}</p>
        <p className="product-quantity">수량: {quantity}</p>
      </div>
    </div>
  );
}

export default ProductCard;