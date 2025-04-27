// CrawlingTable.jsx
import React from 'react';
import PropTypes from 'prop-types';
import './CrawlingTable.css';

// 모니터 테이블 컴포넌트
// 모니터 테이블 컴포넌트 (순수 JS)
const CrawlingTable = ({ data }) => (
  <div className="monitor-container">
    <table className="monitor-table">
      <thead>
        <tr className="monitor-header-row">
          <th className="monitor-header-cell">모니터 이름</th>
          <th className="monitor-header-cell">상태</th>
          <th className="monitor-header-cell">모니터 주기(분)</th>
          <th className="monitor-header-cell">History</th>
        </tr>
      </thead>
      <tbody>
        {data.map((monitor, idx) => (
          <tr key={idx} className="monitor-row-hover">
            <td className="monitor-cell">{monitor.name}</td>
            <td className="monitor-cell">{monitor.status}</td>
            <td className="monitor-cell">{monitor.interval}</td>
            <td className="monitor-cell">
              {monitor.historyLink ? (
                <a href={monitor.historyLink} className="text-link">보기</a>
              ) : (
                <span className="text-muted">-</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default CrawlingTable;