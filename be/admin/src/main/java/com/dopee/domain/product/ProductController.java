package com.dopee.domain.product;

import com.dopee.common.util.FileUtil;
import com.dopee.domain.product.dto.ProductDto;
import com.dopee.domain.product.dto.ProductSearchDto;
import com.dopee.domain.product.dto.ProductSizeDto;
import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;
    private final ProductFacadeService productFacadeService;

    /**
     * 전체 상품을 페이징 조회합니다.
     *
     * @param pageable 요청 쿼리 파라미터 ?page=0&size=20&sort=id,desc 등을 자동 처리
     */
    @GetMapping
    public ResponseEntity<Page<ProductDto>> getProducts(@PageableDefault(size = 20) Pageable pageable, @ModelAttribute ProductSearchDto searchDto) {
        Page<ProductDto> page = productService.getProducts(pageable, searchDto);
        return ResponseEntity.ok(page);
    }

    @PostMapping
    public ResponseEntity<Boolean> addProduct(@RequestBody List<ProductDto> productDtos) {

        productService.saveProducts(productDtos);
        return ResponseEntity.ok(true);
    }

    @PutMapping
    public ResponseEntity<Boolean> updateProduct(@RequestBody ProductDto productDto) {

        productService.updateProduct(productDto);
        return ResponseEntity.ok(true);
    }

    @PostMapping("/{id}")
    public ResponseEntity<Boolean> addProductSize(@PathVariable(value = "id") Long productId, @RequestBody List<ProductSizeDto> productSizeDtos) {

        productService.saveProductSize(productId, productSizeDtos);
        return ResponseEntity.ok(true);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> deleteProductSize(@PathVariable(value = "id") Long productId, @RequestBody List<ProductSizeDto> productSizeDtos) {

        productService.deleteProductSize(productId, productSizeDtos);
        return ResponseEntity.ok(true);
    }

    @DeleteMapping
    public ResponseEntity<Boolean> deleteProduct(@RequestBody List<Long> productIds) {

        productService.deleteProducts(productIds);
        return ResponseEntity.ok(true);
    }

    @PostMapping("upload")
    public ResponseEntity<Void> registerProductsByExcel(@RequestParam("file") MultipartFile file) throws IOException {

        //액셀 용량이 크면 파싱하가 DB에 저장하는데 시간이 걸리기 때문에 Async or Event 발생해서 처리하는걸로 진행하자.
        productFacadeService.bulkRegisterByFile(file);
        return ResponseEntity.ok().build();
    }

    /*
     * 현재 등록된 상품 정보 다운로드
     */
    @GetMapping("/download")
    public ResponseEntity<StreamingResponseBody> downloadProductsToExcel() throws IOException {

        String encodedFilename = FileUtil.encodedTimestampedFilename("products", "xlsx");

        // 1) HttpHeaders 준비
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
        headers.setContentDisposition(ContentDisposition.attachment().filename(encodedFilename).build());

        // 2) StreamingResponseBody 정의
        StreamingResponseBody body = productFacadeService::downloadProductExcel;

        // 3) ResponseEntity로 묶어서 반환
        return new ResponseEntity<>(body, headers, HttpStatus.OK);
    }
}