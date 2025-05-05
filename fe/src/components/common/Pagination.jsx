import React from "react";
import "./Pagination.css";

export default function Pagination({ current, total, onPageChange }) {
  const visiblePages = 5;
  let start = Math.max(0, current - Math.floor(visiblePages / 2));
  let end = start + visiblePages - 1;
  if (end >= total) {
    end = total - 1;
    start = Math.max(0, end - visiblePages + 1);
  }

  const pages = [];
  if (start > 0) pages.push("first");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push("last");

  const handleClick = (value) => {
    if (value === "first") onPageChange(0);
    else if (value === "last") onPageChange(total - 1);
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
      {pages.map((p, idx) => {
        if (p === "first" || p === "last") {
          return (
            <span key={idx} className="ellipsis">
              ...
            </span>
          );
        }
        return (
          <button
            key={p}
            className={`page-btn ${p === current ? "active" : ""}`}
            onClick={() => handleClick(p)}
          >
            {p + 1}
          </button>
        );
      })}
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
