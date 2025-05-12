import React from "react";
import "./Pagination.css";

export default function Pagination({ current, total, onPageChange }) {
  const visiblePages = 5;
  let start = current - Math.floor(visiblePages / 2);
  let end = current + Math.floor(visiblePages / 2);

  // Adjust bounds
  if (start < 0) {
    start = 0;
    end = Math.min(visiblePages - 1, total - 1);
  }
  if (end > total - 1) {
    end = total - 1;
    start = Math.max(0, total - visiblePages);
  }

  const pages = [];

  // First page + leading ellipsis
  if (start > 0) {
    pages.push(0);
    if (start > 1) pages.push("left-ellipsis");
  }

  // Main window
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  // Trailing ellipsis + last page
  if (end < total - 1) {
    if (end < total - 2) pages.push("right-ellipsis");
    pages.push(total - 1);
  }

  const handleClick = (value) => {
    if (value === "left-ellipsis")
      onPageChange(start - visiblePages >= 0 ? start - visiblePages : 0);
    else if (value === "right-ellipsis")
      onPageChange(end + visiblePages < total ? end + visiblePages : total - 1);
    else onPageChange(value);
  };

  return (
    <div className="pagination">
      <button
        className="page-btn"
        disabled={current === 0}
        onClick={() => onPageChange(current - 1)}
      >
        &lt;
      </button>
      {pages.map((p, idx) =>
        p === "left-ellipsis" || p === "right-ellipsis" ? (
          <button
            key={idx}
            className="page-btn ellipsis"
            onClick={() => handleClick(p)}
          >
            ...
          </button>
        ) : (
          <button
            key={p}
            className={`page-btn ${p === current ? "active" : ""}`}
            onClick={() => handleClick(p)}
          >
            {p + 1}
          </button>
        )
      )}
      <button
        className="page-btn"
        disabled={current === total - 1}
        onClick={() => onPageChange(current + 1)}
      >
        &gt;
      </button>
    </div>
  );
}
