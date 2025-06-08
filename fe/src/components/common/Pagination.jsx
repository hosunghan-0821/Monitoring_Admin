import React from "react";
import { usePagination, DOTS } from "./usePagination";
import "./Pagination.css";

export default function Pagination({
  currentPage, // 0-based 인덱스
  totalCount, // 전체 아이템 개수
  pageSize, // 한 페이지에 보여줄 아이템 개수
  onPageChange, // (newPageIndex: number) => void
  siblingCount = 1,
}) {
  const paginationRange = usePagination({
    currentPage,
    totalCount,
    pageSize,
    siblingCount,
  });

  // 전체 페이지 수
  const totalPageCount = Math.ceil(totalCount / pageSize);

  // 이전 페이지로 이동
  const onNext = () => {
    if (currentPage < totalPageCount - 1) {
      onPageChange(currentPage + 1);
    }
  };

  // 다음 페이지로 이동
  const onPrevious = () => {
    if (currentPage > 0) {
      onPageChange(currentPage - 1);
    }
  };

  // 페이지나 DOTS가 하나도 없다면 렌더링할 필요 없음
  if (currentPage === 0 && paginationRange.length < 2) {
    return null;
  }

  return (
    <div className="pagination">
      {/* 이전 버튼 */}
      <button
        className="page-btn"
        onClick={onPrevious}
        disabled={currentPage === 0}
      >
        &lt;
      </button>

      {/* 페이지 번호들 */}
      {paginationRange.map((pageIdx, idx) => {
        if (pageIdx === DOTS) {
          return (
            <button
              key={`dots-${idx}`}
              className="page-btn ellipsis"
              onClick={() => {
                // 생략부(…)를 클릭했을 때, “걸린 구간” 만큼 이동하는 예시
                // 여기서는 그냥 DOTS 클릭 시 아무 동작 안 하도록 두거나,
                // 현재 페이지 기준으로 한 윈도우만큼 이동해도 됩니다.
              }}
              disabled
            >
              &#8230;
            </button>
          );
        }

        // 실제 페이지 번호
        return (
          <button
            key={`page-${pageIdx}`}
            className={`page-btn ${pageIdx === currentPage ? "active" : ""}`}
            onClick={() => onPageChange(pageIdx)}
          >
            {pageIdx + 1}
          </button>
        );
      })}

      {/* 다음 버튼 */}
      <button
        className="page-btn"
        onClick={onNext}
        disabled={currentPage === totalPageCount - 1}
      >
        &gt;
      </button>
    </div>
  );
}
