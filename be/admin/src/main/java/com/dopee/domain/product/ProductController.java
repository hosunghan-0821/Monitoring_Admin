package com.dopee.domain.product;

import com.dopee.domain.product.dto.ProductDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    /**
     * 전체 상품을 페이징 조회합니다.
     *
     * @param pageable 요청 쿼리 파라미터 ?page=0&size=20&sort=id,desc 등을 자동 처리
     */
    @GetMapping
    public ResponseEntity<Page<ProductDto>> getProducts(@PageableDefault(size = 20)  Pageable pageable) {
        Page<ProductDto> page = productService.getProducts(pageable);
        return ResponseEntity.ok(page);
    }
}