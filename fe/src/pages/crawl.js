// Crawl.jsx

import React, { useState, useEffect } from 'react';
import CrawlingTable from '../components/CrawlingTable';
import {useAuth} from '../contexts/AuthContext'

function Crawl() {

    // 1) 데이터를 담을 state
    const [monitorData, setMonitorData] = useState([]);
    const { logout } = useAuth();

    // 2) 컴포넌트 마운트 시 API 호출
    useEffect(() => {
      const fetchMonitor = async () => {
        try {
          const res = await fetch(`${process.env.REACT_APP_API_BASE}/api/monitors`,
            {
              method: 'GET',
              credentials: 'include',         
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
          console.log(res);
          if (res.status === 401){
            logout();
            return;
          }
          const data = await res.json();
          setMonitorData(data);
        } catch (err) {
          console.log(err);
        } 
      };

      fetchMonitor();
    }, []);


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