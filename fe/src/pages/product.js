// Product.js
import React, { useState, useEffect, useRef } from "react";
import "../styles/product.css";
import SearchBar from "../components/product/SearchBar";
import ProductTable from "../components/product/ProductTable";
import { useAuth } from "../contexts/AuthContext";
import Pagination from "../components/common/Pagination";
import ProductRegistrationModal from "../components/product/ProductRegistrationModal";

function Product() {
  const { logout } = useAuth();
  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const searchRef = useRef(null);
  const [loading, setLoading] = useState(false); // 로딩 상태 추가
  const size = 20; //한페이지에 나올 값

  //TODO Refactoring 테이블 선택 (useState 위치가 살짝 애매한거 같다. 데이터 호출하는 부분도 그렇고..)
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // file upload ref
  const fileInputRef = useRef(null);

  // 파일 업로드 핸들러
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE}/api/products/upload`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );
      if (res.status === 401) {
        logout();
        return;
      }
      if (!res.ok) {
        alert("파일 업로드에 실패했습니다.");
      } else {
        alert("파일 업로드 성공");
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
      alert("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
      e.target.value = null; // 같은 파일 재업로드 가능
    }
  };

  const handleNew = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };
  const handleClose = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  // 등록/수정 핸들러
  const handleSubmit = async (data) => {
    const isEdit = Boolean(editingProduct?.id);
    const payload = isEdit ? { ...data, id: editingProduct.id } : data;
    const url = isEdit
      ? `${process.env.REACT_APP_API_BASE}/api/products`
      : `${process.env.REACT_APP_API_BASE}/api/products`;
    const method = isEdit ? "PUT" : "POST";
    // POST 시 배열 형태, PUT 시 단일 객체
    const bodyData = isEdit ? payload : [payload];

    try {
      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });
      if (res.status === 401) {
        logout();
        return false;
      }
      if (!res.ok) {
        alert(
          isEdit ? "상품 수정에 실패했습니다." : "상품 등록에 실패했습니다."
        );
        return false;
      }
      setIsModalOpen(false);
      setEditingProduct(null);
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
        keyword: searchTerm || "",
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
            <button className="btn btn-upload" onClick={handleUploadClick}>
              파일 업로드
            </button>
            <input
              type="file"
              accept="*/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>
        </div>
      </div>
      <ProductTable
        loading={loading}
        products={products}
        selectedIds={selectedIds}
        onRowSelect={handleRowSelect}
        onRowClick={openEditModal}
      />
      {isModalOpen && (
        <ProductRegistrationModal
          isOpen={isModalOpen}
          onClose={handleClose}
          onSubmit={handleSubmit}
          initialData={editingProduct}
        />
      )}
    </div>
  );
}

export default Product;
