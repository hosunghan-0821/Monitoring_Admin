// ProductTable.js
import React from "react";
import ProductRow from "./ProductRow";
import "./ProductTable.css";

export default function ProductTable({ products, selectedIds, onRowSelect }) {
  return (
    <div className="product-table-container">
      <table className="product-table">
        <thead>
          <tr>
            <th>
              {/* 전체 선택 토글(옵션) */}
              <input
                type="checkbox"
                checked={
                  products.length > 0 &&
                  products.every((p) => selectedIds.has(p.id))
                }
                onChange={(e) =>
                  products.forEach((p) => onRowSelect(p.id, e.target.checked))
                }
              />
            </th>
            <th>ID</th>
            <th>Boutique</th>
            <th>Brand</th>
            <th>SKU</th>
            <th>Name</th>
            <th>Image</th>
            <th>Link</th>
            <th>Sizes</th>
          </tr>
        </thead>
        <tbody>
          {products.map((prod) => (
            <ProductRow
              key={prod.id}
              product={prod}
              isSelected={selectedIds.has(prod.id)}
              onRowSelect={onRowSelect}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
