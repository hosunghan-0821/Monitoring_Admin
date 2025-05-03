package com.dopee.domain.product.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import module.database.entity.Product;
import module.database.entity.ProductSize;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductSizeDto {

    private Long id;
    private String name;
    private boolean autoBuy;

    /* ---------- 변환 헬퍼 ---------- */

    public static ProductSizeDto fromEntity(ProductSize size) {
        return ProductSizeDto.builder()
                .id(size.getId())
                .name(size.getName())
                .autoBuy(size.isAutoBuy())
                .build();
    }

    public ProductSize toEntity(Product product) {
        return ProductSize.builder()
                .id(id)
                .product(product)   // 부모 엔티티 주입
                .name(name)
                .autoBuy(autoBuy)
                .build();
    }
}