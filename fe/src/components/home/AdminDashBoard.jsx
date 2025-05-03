import React, { useState, useEffect } from "react";
import SummaryCard from "./SummaryCard";
import NewProduct from "./NewProduct";
import "./AdminDashBoard.css";

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState([]);
  const [newByBrand, setNewByBrand] = useState([]);

  const mockMetrics = [
    {
      brandName: "Brand A",
      totalCount: 1280,
      successCount: 1150,
      failureCount: 130,
      avgDuration: 340, // ms
    },
    {
      brandName: "Brand B",
      totalCount: 950,
      successCount: 900,
      failureCount: 50,
      avgDuration: 290,
    },
    {
      brandName: "Brand C",
      totalCount: 1120,
      successCount: 1080,
      failureCount: 40,
      avgDuration: 320,
    },
    {
      brandName: "Brand D",
      totalCount: 780,
      successCount: 750,
      failureCount: 30,
      avgDuration: 360,
    },
    {
      brandName: "Brand E",
      totalCount: 1340,
      successCount: 1300,
      failureCount: 40,
      avgDuration: 310,
    },
    {
      brandName: "Brand F",
      totalCount: 670,
      successCount: 640,
      failureCount: 30,
      avgDuration: 380,
    },
  ];

  const mockNewByBrand = [
    {
      brandName: "Brand A",
      products: [
        { id: 101, name: "A-상품 1" },
        { id: 102, name: "A-상품 2" },
        { id: 103, name: "A-상품 3" },
      ],
    },
    {
      brandName: "Brand B",
      products: [
        { id: 201, name: "B-상품 1" },
        { id: 202, name: "B-상품 2" },
      ],
    },
    {
      brandName: "Brand C",
      products: [
        { id: 301, name: "C-상품 1" },
        { id: 302, name: "C-상품 2" },
        { id: 303, name: "C-상품 3" },
        { id: 304, name: "C-상품 4" },
      ],
    },
    {
      brandName: "Brand D",
      products: [
        { id: 401, name: "D-상품 1" },
        { id: 402, name: "D-상품 2" },
        { id: 403, name: "D-상품 3" },
      ],
    },
    {
      brandName: "Brand E",
      products: [
        { id: 501, name: "E-상품 1" },
        { id: 502, name: "E-상품 2" },
        { id: 503, name: "E-상품 3" },
        { id: 504, name: "E-상품 4" },
      ],
    },
    {
      brandName: "Brand F",
      products: [
        { id: 601, name: "F-상품 1" },
        { id: 602, name: "F-상품 2" },
      ],
    },
  ];

  useEffect(() => {
    // 1) 오늘 크롤링 KPI
    fetch("/api/crawling/metrics/today", { credentials: "include" })
      .then((r) => r.json())
      .then(setMetrics)
      .catch(() => {
        console.error("KPI fetch failed, using mock:", mockMetrics);
        setMetrics(mockMetrics);
      });
    // 2) 브랜드별 신규 상품
    fetch("/api/brands/new-products", { credentials: "include" })
      .then((r) => r.json())
      .then(setNewByBrand)
      .catch(() => {
        console.error("New-products fetch failed, using mock:", mockNewByBrand);
        setNewByBrand(mockNewByBrand);
      });
  }, []);

  return (
    <div className="dashboard">
      {/* 1. 요약 KPI 카드 */}
      <section className="metrics-table-section">
        <h2>모니터별 크롤링 KPI</h2>
        <table className="metrics-table">
          <thead>
            <tr>
              <th>모니터명</th>
              <th>총 건수</th>
              <th>성공 건수</th>
              <th>실패 건수</th>
              <th>평균 Duration (ms)</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((m) => (
              <SummaryCard key={m.brandName} {...m} />
            ))}
          </tbody>
        </table>
      </section>

      {/* 2. 브랜드별 신규 상품 */}
      <section className="new-products">
        <h2>최근 모니터별 신규 상품</h2>
        <NewProduct data={newByBrand} />
      </section>
    </div>
  );
}
