import React from 'react';
import SearchBar from './SearchBar';
import Pagination from '../common/Pagination';

export default function ProductHeader({
  searchRef,
  inputValue,
  onInputChange,
  onSearch,
  totalProductCounts,
  page,
  onPageChange,
  onNew,
  onDelete,
  onUpload,
  fileInputRef,
  onFileChange,
  onDownload,
  loading,
}) {
  return (
    <div className="search-header">
      <SearchBar
        ref={searchRef}
        value={inputValue}
        onChange={onInputChange}
        onSearch={onSearch}
      />
      <div className="header-actions">
        <span className="total-count">총 {totalProductCounts.toLocaleString()}건</span>
        <Pagination
          currentPage={page}
          totalCount={totalProductCounts}
          pageSize={20}
          siblingCount={1}
          onPageChange={onPageChange}
        />
        <div className="button-group">
          <button className="btn btn-new" onClick={onNew}>새 상품 등록</button>
          <button className="btn btn-delete" onClick={onDelete}>삭제</button>
          <button className="btn btn-upload" onClick={onUpload}>파일 업로드</button>
          <input
            type="file"
            accept="*/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={onFileChange}
          />
          <button className="btn btn-download" onClick={onDownload} disabled={loading}>
            엑셀 다운로드
          </button>
        </div>
      </div>
    </div>
  );
}
