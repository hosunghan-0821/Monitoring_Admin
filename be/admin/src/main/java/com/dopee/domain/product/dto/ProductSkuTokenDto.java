package com.dopee.domain.product.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import module.database.entity.ProductSkuToken;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductSkuTokenDto {

    private Long id;
    private String token;

    /**
     * Entity → DTO
     */
    public static ProductSkuTokenDto fromEntity(ProductSkuToken entity) {
        return ProductSkuTokenDto.builder()
                .id(entity.getId())
                .token(entity.getToken())
                .build();
    }

    /**
     * DTO → Entity
     * (연관된 Product 설정은 서비스 레이어 등에서 별도 처리해주세요)
     */
    public ProductSkuToken toEntity() {
        return ProductSkuToken.builder()
                .token(this.token)
                .build();
    }
}