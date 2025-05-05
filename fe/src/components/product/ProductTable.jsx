// ProductTable.js
import React from "react";
import ProductRow from "./ProductRow";
import "./ProductTable.css";

export default function ProductTable({ products }) {
  return (
    <div className="product-table-container">
      <table className="product-table">
        <thead>
          <tr>
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
            <ProductRow key={prod.id} product={prod} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
