// CrawlingTable.jsx
import React from 'react';
import './CrawlingTable.css';

// 모니터 테이블 컴포넌트 (interval만 인라인 에디팅)
const CrawlingTable = ({ data, onFieldChange, onSave }) => (
  <div className="monitor-container">
    <table className="monitor-table">
      <thead>
        <tr className="monitor-header-row">
          <th className="monitor-header-cell">모니터 이름</th>
          <th className="monitor-header-cell">상태</th>
          <th className="monitor-header-cell">주기 (분)</th>
          <th className="monitor-header-cell">저장</th>
          <th className="monitor-header-cell">History</th>
        </tr>
      </thead>
      <tbody>
        {data.map(monitor => (
          <tr key={monitor.id} className="monitor-row-hover">
            {/* 이름은 읽기 전용 */}
            <td className="monitor-cell">{monitor.name}</td>
            {/* 상태는 읽기 전용 */}
            <td className="monitor-cell">{monitor.status}</td>
            {/* interval만 편집 가능 */}
            <td className="monitor-cell">
              <input
                type="number"
                min={1}
                max={180}
                className="monitor-input"
                value={monitor.interval}
                onFocus={() => monitor.interval === 1 && onFieldChange(monitor.id, 'interval', '')}
                onChange={e => {
                  const v = e.target.value;
                  const num = v === '' ? '' : Number(v);
                  if (num === '' || (num >= 1 && num <= 180)) {
                    onFieldChange(monitor.id, 'interval', num);
                  }
                }}
              />
            </td>
            {/* 저장 버튼 */}
            <td className="monitor-cell">
              <button className="monitor-btn" onClick={() => onSave(monitor.id)}>
                저장
              </button>
            </td>
            {/* 히스토리 링크 */}
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