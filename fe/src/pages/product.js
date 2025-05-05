// Product.js
import React, { useState, useEffect, useRef } from "react";
import "../styles/product.css";
import SearchBar from "../components/product/SearchBar";
import ProductTable from "../components/product/ProductTable";
import { useAuth } from "../contexts/AuthContext";
import Pagination from "../components/common/Pagination";

function Product() {
  const { logout } = useAuth();
  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(20); // 한 페이지에 보여줄 상품 개수
  const [totalPages, setTotalPages] = useState(0);
  const searchRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          size: size.toString(),
          search: searchTerm || "",
        });
        const res = await fetch(
          `${process.env.REACT_APP_API_BASE}/api/products?${params.toString()}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (res.status === 401) {
          logout();
          return;
        }
        console.log(res);
        const data = await res.json();
        setProducts(data.content || data);
        if (data.totalPages !== undefined) setTotalPages(data.totalPages);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProducts();
  }, [searchTerm, page, size]);

  const handleNew = () => console.log("새 상품 등록");
  const handleDelete = () => console.log("삭제");
  const handleSearch = () => {
    setPage(0);
    setSearchTerm(inputValue);
  };

  return (
    <div className="home-page">
      <div className="search-header">
        <SearchBar
          ref={searchRef}
          value={inputValue}
          onChange={setInputValue}
          onSearch={handleSearch}
        />
        <div className="header-actions">
          <Pagination
            current={page}
            total={totalPages}
            onPageChange={setPage}
          />
          <div className="button-group">
            <button className="btn btn-new" onClick={handleNew}>
              새 상품 등록
            </button>
            <button className="btn btn-delete" onClick={handleDelete}>
              삭제
            </button>
          </div>
        </div>
      </div>
      <ProductTable products={products} />
    </div>
  );
}

export default Product;
