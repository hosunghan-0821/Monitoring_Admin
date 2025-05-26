import React from "react";
import "./ProductRow.css";

export default function ProductRow({
  product,
  isSelected,
  onRowSelect,
  onRowClick,
}) {
  const {
    id,
    boutique,
    brand,
    sku,
    productSizes,
    productSkuTokens,
    price,
    count,
  } = product;
  return (
    <tr
      className="product-row"
      style={{ cursor: "pointer" }}
      onClick={() => onRowClick(product)} // 빈 영역 클릭 시 호출
    >
      <td>
        <input
          type="checkbox"
          checked={isSelected}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => {
            onRowSelect(product.id, e.target.checked);
          }}
        />
      </td>
      <td>{id}</td>
      <td>{boutique}</td>
      <td>{brand}</td>
      <td>{sku}</td>
      <td>{price}</td>
      <td>{count}</td>
      <td>
        {productSizes.map((size) => (
          <span
            key={size.id}
            className={`size-tag ${size.autoBuy ? "auto-buy" : ""}`}
          >
            {size.name}
          </span>
        ))}
      </td>
      <td>
        {productSkuTokens.map((token) => (
          <span key={token.id} className={`size-tag`}>
            {token.token}
          </span>
        ))}
      </td>
    </tr>
  );
}
