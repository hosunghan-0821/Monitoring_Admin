// Crawl.jsx
import React from 'react';
import CrawlingTable from '../components/CrawlingTable';

function Crawl() {
  // 예시 데이터
  const monitorData = [
    { name: 'CPU Usage', status: 'Running', interval: '5분', historyLink: '/history/cpu' },
    { name: 'Memory', status: 'Stopped', interval: '10분' },
    { name: 'Disk I/O', status: 'Running', interval: '1시간', historyLink: '/history/disk' }
  ];

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