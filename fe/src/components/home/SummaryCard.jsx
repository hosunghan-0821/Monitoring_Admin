// SummaryCard.jsx
import React from "react";
import "./SummaryCard.css";

export default function SummaryCard({
  brandName,
  totalCount,
  successCount,
  failureCount,
  avgDuration,
}) {
  return (
    <tr className="summary-row">
      <td className="summary-cell summary-brand">{brandName}</td>
      <td className="summary-cell summary-total">{totalCount}</td>
      <td className="summary-cell summary-success">{successCount}</td>
      <td className="summary-cell summary-failure">{failureCount}</td>
      <td className="summary-cell summary-duration">{avgDuration}ms</td>
    </tr>
  );
}
