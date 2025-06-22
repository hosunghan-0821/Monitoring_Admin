import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function useProductManager() {
  const { logout } = useAuth();

  const [inputValue, setInputValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalProductCounts, setTotalProductCounts] = useState(0);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  const searchRef = useRef(null);
  const fileInputRef = useRef(null);
  const size = 20;

  const handleDownloadClick = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE}/api/products/download`, {
        method: 'GET',
        credentials: 'include',
      });
      if (res.status === 401) {
        logout();
        return;
      }
      if (!res.ok) throw new Error('다운로드 실패');

      const blob = await res.blob();
      const disposition = res.headers.get('Content-Disposition') || '';
      const match = disposition.match(/filename="(.+)"/);
      const filename = match ? match[1] : 'products.xlsx';

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.setAttribute('download', filename);
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('파일 다운로드 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE}/api/products/upload`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      if (res.status === 401) {
        logout();
        return;
      }
      if (!res.ok) {
        alert('파일 업로드에 실패했습니다.');
      } else {
        alert('파일 업로드 성공');
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
      alert('네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
      e.target.value = null;
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

  const handleSubmit = async (data) => {
    const isEdit = Boolean(editingProduct?.id);
    const payload = isEdit ? { ...data, id: editingProduct.id } : data;
    const url = `${process.env.REACT_APP_API_BASE}/api/products`;
    const method = isEdit ? 'PUT' : 'POST';
    const bodyData = isEdit ? payload : [payload];

    try {
      const res = await fetch(url, {
        method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });
      if (res.status === 401) {
        logout();
        return false;
      }
      if (!res.ok) {
        alert(isEdit ? '상품 수정에 실패했습니다.' : '상품 등록에 실패했습니다.');
        return false;
      }
      setIsModalOpen(false);
      setEditingProduct(null);
      fetchProducts();
      return true;
    } catch {
      alert('네트워크 오류가 발생했습니다.');
      return false;
    }
  };

  const handleRowSelect = (id, isSelected) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (isSelected) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        keyword: searchTerm || '',
      });
      const res = await fetch(`${process.env.REACT_APP_API_BASE}/api/products?${params}`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.status === 401) {
        logout();
        return;
      }
      const data = await res.json();
      setProducts(data.content || data);
      if (data.totalPages !== undefined) {
        setTotalProductCounts(data.totalElements);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, page]);

  const handleDelete = async () => {
    setLoading(true);
    if (selectedIds.size === 0) return alert('하나 이상 체크하세요');
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE}/api/products`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Array.from(selectedIds)),
      });
      if (!res.ok) throw new Error('삭제 실패');
      setSelectedIds(new Set());
    } catch (err) {
      console.error(err);
      alert('삭제 중 오류가 발생했습니다');
    } finally {
      setLoading(false);
      fetchProducts();
    }
  };

  const handleSearch = () => {
    setPage(0);
    setSearchTerm(inputValue);
  };

  return {
    state: {
      inputValue,
      searchTerm,
      products,
      page,
      totalProductCounts,
      selectedIds,
      isModalOpen,
      editingProduct,
      loading,
    },
    refs: {
      searchRef,
      fileInputRef,
    },
    actions: {
      setInputValue,
      setPage,
      handleSearch,
      handleDownloadClick,
      handleUploadClick,
      handleFileChange,
      handleNew,
      handleClose,
      openEditModal,
      handleSubmit,
      handleRowSelect,
      handleDelete,
    },
  };
}
