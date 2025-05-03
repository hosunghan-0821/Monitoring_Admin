import "./NewProduct.css";

function NewProduct({ data }) {
  if (!data.length) return <p>신규 상품이 없습니다.</p>;

  return (
    <div className="brand-grid">
      {data.map(({ brandName, products }) => (
        <div key={brandName} className="brand-card">
          <h3>{brandName}</h3>
          <ul>
            {products.map((p) => (
              <li key={p.id}>{p.name}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default NewProduct;
