import React, { useState, useEffect, useRef } from "react";
import CrawlingTable from "../components/CrawlingTable";
import { useAuth } from "../contexts/AuthContext";

function Crawl() {
  // 1) 데이터를 담을 state
  const [monitorData, setMonitorData] = useState([]);
  const { logout } = useAuth();
  const originalDataRef = useRef([]); // 초기값은 빈 배열

  // 2) 컴포넌트 마운트 시 API 호출
  useEffect(() => {
    const fetchMonitor = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_BASE}/api/monitors`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (res.status === 401) {
          logout();
          return;
        }
        const data = await res.json();
        setMonitorData(data);
        originalDataRef.current = data;
      } catch (err) {}
    };

    fetchMonitor();
  }, []);

  const handleFieldChange = (id, field, value) => {
    setMonitorData((prev) => {
      return prev.map((item) => {
        const isTarget = item.id === id;

        if (isTarget) {
          const updatedItem = { ...item };
          updatedItem[field] = value;
          return updatedItem;
        } else {
          return item;
        }
      });
    });
  };

  const handleSave = async (id) => {
    const item = monitorData.find((i) => i.id === id);
    const original = originalDataRef.current.find((i) => i.id === id);

    if (JSON.stringify(item) === JSON.stringify(original)) {
      alert("변경된 사항이 없습니다.");
      return;
    }

    if (item.interval <= 0) {
      alert("유효한 값을 입력하세요 1 ~ 180");
      return;
    }
    const res = await fetch(
      `${process.env.REACT_APP_API_BASE}/api/monitors/${id}`,
      {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      }
    );

    if (res.ok) {
      alert("다음 크롤링 회차 부터 변경된 주기가 반영됩니다.");
      originalDataRef.current = originalDataRef.current.map((i) =>
        i.id === id ? { ...item } : i
      );
    }
  };

  return (
    <div className="home-page">
      {/* 모니터 테이블 렌더링 */}
      <div className="monitor-section">
        <CrawlingTable
          data={monitorData}
          onFieldChange={handleFieldChange}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}

export default Crawl;
