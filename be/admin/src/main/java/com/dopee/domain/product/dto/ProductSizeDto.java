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


    public static ProductSizeDto fromEntity(ProductSize size) {
        return ProductSizeDto.builder()
                .id(size.getId())
                .name(size.getName())
                .autoBuy(size.isAutoBuy())
                .build();
    }

    public ProductSize toEntity(){
        return ProductSize.builder()
                .autoBuy(autoBuy)
                .name(name)
                .build();
    }
}