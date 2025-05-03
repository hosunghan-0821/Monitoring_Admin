import React, { useState, useEffect } from "react";
import SummaryCard from "./SummaryCard";
import NewProduct from "./NewProduct";
import "./AdminDashBoard.css";

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [newByBrand, setNewByBrand] = useState([]);

  useEffect(() => {
    // 1) 오늘 크롤링 KPI
    fetch("/api/crawling/metrics/today", { credentials: "include" })
      .then((r) => r.json())
      .then(setMetrics)
      .catch(console.error);

    // 2) 브랜드별 신규 상품
    fetch("/api/brands/new-products", { credentials: "include" })
      .then((r) => r.json())
      .then(setNewByBrand)
      .catch(console.error);
  }, []);

  return (
    <div className="dashboard">
      {/* 1. 요약 KPI 카드 */}
      <h2>크롤링 정보</h2>
      <section className="card-grid">
        {metrics &&
          [
            { label: "총 건수", value: metrics.totalCount },
            { label: "성공 건수", value: metrics.successCount },
            { label: "실패 건수", value: metrics.failureCount },
            { label: "평균 Duration", value: `${metrics.avgDuration}ms` },
          ].map((item) => (
            <SummaryCard
              key={item.label}
              title={item.label}
              value={item.value}
            />
          ))}
      </section>

      {/* 2. 브랜드별 신규 상품 */}
      <section className="new-products">
        <h2>브랜드별 신규 상품</h2>
        <NewProduct data={newByBrand} />
      </section>
    </div>
  );
}
