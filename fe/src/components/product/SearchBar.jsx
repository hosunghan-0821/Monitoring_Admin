import React, { forwardRef } from "react";
import "./SearchBar.css";

const SearchBar = forwardRef(({ value, onChange, onSearch }, ref) => {
  return (
    <div className="search-bar-container">
      <input
        ref={ref}
        type="text"
        placeholder="상품 검색..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="search-bar-input"
      />
      <button className="search-bar-btn" type="button" onClick={onSearch}>
        검색
      </button>
    </div>
  );
});

export default SearchBar;
