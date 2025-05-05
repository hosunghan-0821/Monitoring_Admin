import React from "react";
import "./Modal.css";

/**
 * 범용 Modal 컴포넌트
 * Props:
 *  - isOpen: boolean, 모달 열림 상태
 *  - onClose: function, 모달 닫기 핸들러
 *  - children: ReactNode, 모달 내부 컨텐츠
 */
export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="modal-close-button" onClick={onClose}>
          ×
        </button>
        {children}
      </div>
    </div>
  );
}
