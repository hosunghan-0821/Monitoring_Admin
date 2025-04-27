// Crawl.jsx

import React, { useState, useEffect } from 'react';
import CrawlingTable from '../components/CrawlingTable';

function Crawl() {

    // 1) 데이터를 담을 state
    const [monitorData, setMonitorData] = useState([]);
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState(null);

    // 2) 컴포넌트 마운트 시 API 호출
    useEffect(() => {
      const fetchMonitor = async () => {
        try {
          const res = await fetch(`${process.env.REACT_APP_API_BASE}/api/monitors`); 
          console.log(res);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();
          console.log(data);
          setMonitorData(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchMonitor();
    }, monitorData);

    // 3) 로딩·에러 상태 처리
    if (loading) return <p>Loading…</p>;
    if (error)   return <p style={{ color: 'red' }}>Error: {error}</p>;


  return (
    <div className="home-page">
    
      {/* 모니터 테이블 렌더링 */}
      <div className="monitor-section">
        <CrawlingTable data={monitorData} />
      </div>
    </div>
  );
}

export default Crawl;