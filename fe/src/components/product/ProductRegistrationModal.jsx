// src/components/ProductRegistrationModal.jsx
import React, { useState, useEffect } from "react";
import Modal from "../common/modal/Modal";
import "./ProductRegistrationModal.css";

/**
 * 상품 등록 전용 모달 컴포넌트
 * Props:
 *  - isOpen: boolean
 *  - onClose: function
 *  - onSubmit: function
 */
export default function ProductRegistrationModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) {
  const fixedFields = ["boutique", "brand", "sku", "name", "link", "imageSrc"];
  // 상품 사이즈 관련만 동적 상태로 관리
  const [productSizes, setProductSizes] = useState(
    initialData?.productSizes?.map(({ name, autoBuy }) => ({
      name,
      autoBuy,
    })) || []
  );

  const [loading, setLoading] = useState(false);

  const handleSizeChange = (index, value) => {
    setProductSizes((prev) => {
      const sizes = [...prev];
      sizes[index] = { ...sizes[index], name: value };
      return sizes;
    });
  };

  // 취소 시 사이즈 초기화 및 모달 닫기
  const handleCancel = () => {
    setProductSizes([]);
    onClose();
  };

  const addSize = () => {
    setProductSizes((prev) => [...prev, { name: "", autoBuy: true }]);
  };

  const removeSize = (index) => {
    setProductSizes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData(e.target);
    // static 필드는 FormData로, 사이즈는 상태로 합침
    const payload = {
      boutique: data.get("boutique"),
      brand: data.get("brand"),
      sku: data.get("sku"),
      name: data.get("name"),
      link: data.get("link"),
      imageSrc: data.get("imageSrc"),
      productSizes,
    };
    const res = await onSubmit(payload);
    setLoading(false);
    if (res) {
      setProductSizes([]);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCancel}>
      {loading ? (
        <div className="prm-loading-full">
          <div className="spinner">로딩 중…</div>
        </div>
      ) : (
        <>
          <h2 className="prm-title">
            {initialData ? "상품 수정" : "새 상품 등록"}
          </h2>
          <form onSubmit={handleSubmit} className="prm-form">
            {fixedFields.map((field, idx) => (
              <div className="prm-form-group" key={field}>
                <label htmlFor={field} className="prm-label">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  id={field}
                  name={field}
                  required={idx < 3}
                  className="prm-input"
                  defaultValue={initialData?.[field] || null}
                />
              </div>
            ))}

            <div className="prm-sizes">
              <button
                type="button"
                className="prm-button-add-small"
                onClick={addSize}
              >
                + Size
              </button>
              <div className="prm-size-list">
                {productSizes.map((size, idx) => (
                  <div className="prm-size-group" key={idx}>
                    <input
                      placeholder="Size"
                      value={size.name}
                      onChange={(e) => handleSizeChange(idx, e.target.value)}
                      className="prm-size-input"
                    />
                    <button
                      type="button"
                      className="prm-button-remove"
                      onClick={() => removeSize(idx)}
                      aria-label="Remove size"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="prm-actions">
              <button
                type="button"
                onClick={handleCancel}
                className="prm-button prm-button-cancel"
              >
                취소
              </button>
              <button type="submit" className="prm-button prm-button-submit">
                {initialData ? "수정" : "등록"}
              </button>
            </div>
          </form>
        </>
      )}
    </Modal>
  );
}
