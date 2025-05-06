import React from "react";
import "./ProductRow.css";

export default function ProductRow({
  product,
  isSelected,
  onRowSelect,
  onRowClick,
}) {
  const { id, boutique, brand, sku, name, link, imageSrc, productSizes } =
    product;
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
      <td>{name}</td>
      <td>
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={name}
            className="product-image"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="text-muted">No Image</span>
        )}
      </td>
      <td>
        {link ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-link"
            onClick={(e) => e.stopPropagation()}
          >
            View
          </a>
        ) : (
          <span className="text-muted">No Link</span>
        )}
      </td>
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
    </tr>
  );
}
