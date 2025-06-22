// Product.js
import React from "react";
import "../styles/product.css";
import ProductTable from "../components/product/ProductTable";
import ProductRegistrationModal from "../components/product/ProductRegistrationModal";
import ProductHeader from "../components/product/ProductHeader";
import useProductManager from "../hooks/useProductManager";

function Product() {
  const {
    state: {
      inputValue,
      products,
      page,
      totalProductCounts,
      selectedIds,
      isModalOpen,
      editingProduct,
      loading,
    },
    refs: { searchRef, fileInputRef },
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
  } = useProductManager();

  return (
    <div className="home-page">
      <ProductHeader
        searchRef={searchRef}
        inputValue={inputValue}
        onInputChange={setInputValue}
        onSearch={handleSearch}
        totalProductCounts={totalProductCounts}
        page={page}
        onPageChange={setPage}
        onNew={handleNew}
        onDelete={handleDelete}
        onUpload={handleUploadClick}
        fileInputRef={fileInputRef}
        onFileChange={handleFileChange}
        onDownload={handleDownloadClick}
        loading={loading}
      />
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
