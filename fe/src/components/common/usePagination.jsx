import { useMemo } from "react";

export const DOTS = "DOTS"; // … 표시를 나타내는 상수

/**
 * currentPage: 현재 페이지 인덱스 (0-based)
 * totalCount: 전체 아이템 개수
 * pageSize: 한 페이지에 보여줄 아이템 개수
 * siblingCount: 현재 페이지 앞뒤로 보여줄 “형제 페이지(sibling)” 개수
 */
export function usePagination({
  currentPage,
  totalCount,
  pageSize,
  siblingCount = 1,
}) {
  const paginationRange = useMemo(() => {
    const totalPageCount = Math.ceil(totalCount / pageSize);

    // (1) 전체 페이지 수가 (siblingCount + 5)개 이하일 땐 그냥 1~N 그대로 리턴
    const totalPageNumbers = siblingCount + 5;
    if (totalPageNumbers >= totalPageCount) {
      return Array.from({ length: totalPageCount }, (_, idx) => idx);
    }

    // (2) 첫·마지막 페이지는 항상 보여주고, 가운데 구간만 계산해서 … 표시하기
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 0);
    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPageCount - 1
    );

    const shouldShowLeftDots = leftSiblingIndex > 1;
    const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

    const firstPageIndex = 0;
    const lastPageIndex = totalPageCount - 1;

    const pages = [];

    if (!shouldShowLeftDots && shouldShowRightDots) {
      // 왼쪽에 DOTS 불필요, 오른쪽에 DOTS 필요
      const leftItemCount = 1 + 2 * siblingCount + 1; // [0] + 앞뒤 sibling + 현재 + […]
      const leftRange = Array.from({ length: leftItemCount }, (_, idx) => idx);
      pages.push(...leftRange, DOTS, lastPageIndex);
      return pages;
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      // 왼쪽에 DOTS 필요, 오른쪽에 DOTS 불필요
      const rightItemCount = 1 + 2 * siblingCount + 1; // [마지막] 포함 안 된 개수
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, idx) => lastPageIndex - (rightItemCount - 1) + idx
      );
      pages.push(firstPageIndex, DOTS, ...rightRange);
      return pages;
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      // 양쪽에 모두 DOTS 필요
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, idx) => leftSiblingIndex + idx
      );
      pages.push(firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex);
      return pages;
    }
  }, [currentPage, totalCount, pageSize, siblingCount]);

  return paginationRange; // ex) [0, "DOTS", 4,5,6, "DOTS", 9]
}
