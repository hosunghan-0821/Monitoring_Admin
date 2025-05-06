// Product.js
import React, { useState, useEffect, useRef } from "react";
import "../styles/product.css";
import SearchBar from "../components/product/SearchBar";
import ProductTable from "../components/product/ProductTable";
import { useAuth } from "../contexts/AuthContext";
import Pagination from "../components/common/Pagination";
import ProductRegistrationModal from "../components/product/ProductRegistrationModal";

function Product() {
  console.log("렌더링");
  const { logout } = useAuth();
  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const searchRef = useRef(null);
  const [loading, setLoading] = useState(false); // 로딩 상태 추가
  const size = 2; //한페이지에 나올 값

  //TODO Refactoring 테이블 선택 (useState 위치가 살짝 애매한거 같다. 데이터 호출하는 부분도 그렇고..)
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNew = () => setIsModalOpen(true);
  const handleClose = () => setIsModalOpen(false);

  const handleSubmit = async (data) => {
    console.log("서버로 전송할 데이터:", data);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE}/api/products`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify([data]),
        }
      );
      if (res.status === 401) {
        // 인증 오류 시 로그아웃 처리
        logout();
        return false;
      }
      if (!res.ok) {
        alert("상품 등록에 실패했습니다.");
        return false;
      }
      const result = await res.json();
      // 등록 성공 후 필요한 후처리
      setIsModalOpen(false);
      fetchProducts();
      return true;
    } catch (error) {
      alert("네트워크 오류가 발생했습니다.");
      return false;
    }
  };

  // 행 선택/해제 토글
  const handleRowSelect = (id, isSelected) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (isSelected) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  // API 조회 함수
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        search: searchTerm || "",
      });
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE}/api/products?${params}`,
        {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (res.status === 401) {
        logout();
        return;
      }
      const data = await res.json();
      setProducts(data.content || data);
      if (data.totalPages !== undefined) setTotalPages(data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 검색/페이지 변경 시 데이터 재조회
  useEffect(() => {
    fetchProducts();
  }, [searchTerm, page]);

  // 삭제 버튼 클릭 시 API 호출
  const handleDelete = async () => {
    setLoading(true);
    if (selectedIds.size === 0) return alert("하나 이상 체크하세요");
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE}/api/products`,
        {
          method: "DELETE",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(Array.from(selectedIds)),
        }
      );
      if (!res.ok) throw new Error("삭제 실패");
      // 삭제 후 데이터 리로딩
      setSelectedIds(new Set());

      // 혹은 페이지 강제 리로드 로직
    } catch (err) {
      console.error(err);
      alert("삭제 중 오류가 발생했습니다");
    } finally {
      setLoading(false);
      fetchProducts();
    }
  };

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
      <ProductTable
        loading={loading}
        products={products}
        selectedIds={selectedIds}
        onRowSelect={handleRowSelect}
      />
      <ProductRegistrationModal
        isOpen={isModalOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default Product;
