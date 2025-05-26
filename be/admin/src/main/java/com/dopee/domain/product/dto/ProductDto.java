package com.dopee.domain.product.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import module.database.entity.Product;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Product 전송용 DTO
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDto {

    private Long id;
    private String boutique;
    private String brand;
    private String sku;
    private String name;
    private String link;
    private String imageSrc;
    private Long count;

    /**
     * 연관된 사이즈 정보
     */
    private List<ProductSizeDto> productSizes;

    /**
     * 연관된 SKU 토큰 정보
     */
    private List<ProductSkuTokenDto> productSkuTokens;

    /* ---------- 변환 헬퍼 ---------- */

    /**
     * Entity → DTO
     */
    public static ProductDto fromEntity(Product product) {
        return ProductDto.builder()
                .id(product.getId())
                .boutique(product.getBoutique())
                .brand(product.getBrand())
                .sku(product.getSku())
                .name(product.getName())
                .link(product.getLink())
                .imageSrc(product.getImageSrc())
                .count(product.getCount())
                .productSizes(
                        product.getProductSize().stream()
                                .map(ProductSizeDto::fromEntity)
                                .collect(Collectors.toList())
                )
                .productSkuTokens(
                        product.getProductToken().stream()
                                .map(ProductSkuTokenDto::fromEntity)
                                .collect(Collectors.toList())
                )
                .build();
    }

    /**
     * DTO → Entity (연관 사이즈 & 토큰은 별도 매핑)
     */
    public Product toEntity() {
        return Product.builder()
                .id(id)                       // null이면 새 엔티티, 아니면 merge 용도
                .boutique(boutique)
                .brand(brand)
                .sku(sku)
                .name(name)
                .link(link)
                .imageSrc(imageSrc)
                .count(count == null ? 0L : count)
                .productSize(
                        productSizes.stream()
                                .map(ProductSizeDto::toEntity)
                                .collect(Collectors.toList())
                )
                .productToken(productSkuTokens.stream()
                        .map(ProductSkuTokenDto::toEntity)
                        .collect(Collectors.toList()))
                .build();

    }
}
