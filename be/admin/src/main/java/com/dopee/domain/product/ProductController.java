package com.dopee.domain.product;

import com.dopee.domain.product.dto.ProductDto;
import com.dopee.domain.product.dto.ProductSizeDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

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
    public ResponseEntity<Page<ProductDto>> getProducts(@PageableDefault(size = 20) Pageable pageable) {
        Page<ProductDto> page = productService.getProducts(pageable);
        return ResponseEntity.ok(page);
    }

    @PostMapping
    public ResponseEntity<Boolean> addProduct(@RequestBody List<ProductDto> productDtos) {

        productService.saveProducts(productDtos);
        return ResponseEntity.ok(true);
    }

    @PostMapping("/{id}")
    public ResponseEntity<Boolean> addProductSize(@PathVariable(value = "id") Long productId, @RequestBody List<ProductSizeDto> productSizeDtos) {

        productService.saveProductSize(productId,productSizeDtos);
        return ResponseEntity.ok(true);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> deleteProductSize(@PathVariable(value = "id") Long productId, @RequestBody List<ProductSizeDto> productSizeDtos) {

        productService.deleteProductSize(productId,productSizeDtos);
        return ResponseEntity.ok(true);
    }

    @DeleteMapping()
    public ResponseEntity<Boolean> deleteProduct(@RequestBody List<Long> productIds) {

        productService.deleteProducts(productIds);
        return ResponseEntity.ok(true);
    }
}