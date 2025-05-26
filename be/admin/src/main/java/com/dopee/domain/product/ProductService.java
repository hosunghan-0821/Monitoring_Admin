package com.dopee.domain.product;

import com.dopee.domain.product.dto.ProductDto;
import com.dopee.domain.product.dto.ProductSearchDto;
import com.dopee.domain.product.dto.ProductSizeDto;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import module.database.entity.Product;
import module.database.entity.ProductSize;
import module.database.entity.ProductSkuToken;
import module.database.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public Page<ProductDto> getProducts(Pageable pageable, ProductSearchDto productSearchDto) {

        Page<Product> products = productRepository.getProducts(pageable, productSearchDto.getKeyword());
        List<ProductDto> productDtos = products.getContent().stream().map(ProductDto::fromEntity).collect(Collectors.toList());
        return new PageImpl<>(productDtos, pageable, products.getTotalElements());
    }


    @Transactional
    public void saveProductSize(Long productId, List<ProductSizeDto> productSizeDtos) {

        //Global Exception Handler로 처리 필요
        Product product = productRepository.findById(productId).orElseThrow(() -> new RuntimeException("유효하지 않은 ID 입니다."));

        List<ProductSize> productSizes = productSizeDtos.stream().map(productSizeDto -> {
            return ProductSize.builder()
                    .product(product)
                    .autoBuy(productSizeDto.isAutoBuy())
                    .name(productSizeDto.getName())
                    .build();
        }).toList();

        productRepository.saveAllProductSize(productSizes);
    }

    @Transactional
    public void updateProduct(ProductDto productDto) {
        //Global Exception Handler로 처리 필요
        Product product = productRepository.findById(productDto.getId()).orElseThrow(() -> new RuntimeException("유효하지 않은 ID 입니다."));

        product.update(productDto.getBoutique(), productDto.getBrand(), productDto.getSku(), productDto.getName(), productDto.getLink(), productDto.getImageSrc(),productDto.getPrice(),productDto.getCount());

        //전체 프러덕트 사이즈 전체 삭제 후 재 등록
        productRepository.deleteProductSize(productDto.getId());
        List<ProductSize> productSizes = productDto.getProductSizes().stream()
                .map(v -> {
                    ProductSize productSize = v.toEntity();
                    productSize.setProduct(product);
                    return productSize;
                }).toList();
        productRepository.saveAllProductSize(productSizes);

        //전체 프러덕트 토큰 삭제 후 재 등록
        productRepository.deleteProductSkuToken(product.getId());

        List<ProductSkuToken> productSkuTokens = productDto.getProductSkuTokens().stream()
                .map(v -> {
                    ProductSkuToken productSkuToken = v.toEntity();
                    productSkuToken.setProduct(product);
                    return productSkuToken;
                }).toList();
        productRepository.saveAllProductSkuToken(productSkuTokens);
    }

    @Transactional
    public void deleteProductSize(Long productId, List<ProductSizeDto> productSizeDtos) {

        //Global Exception Handler로 처리 필요
        Product product = productRepository.findById(productId).orElseThrow(() -> new RuntimeException("유효하지 않은 ID 입니다."));
        ArrayList<Long> deleteIds = productSizeDtos.stream()
                .map(ProductSizeDto::getId)
                .collect(Collectors.toCollection(ArrayList::new));

        //validate product해당하는 size 정보인지.
        HashSet<Long> containProductIds = product.getProductSize().stream()
                .map(ProductSize::getId)
                .collect(Collectors.toCollection(HashSet::new));

        if (!containProductIds.containsAll(deleteIds)) {
            throw new RuntimeException("삭제 요청한 사이즈 ID 중 유효하지 않은 값이 있습니다.");
        }

        productRepository.deleteAllProductSize(deleteIds);
    }

    @Transactional
    public void saveProducts(List<ProductDto> productDtos) {

        List<Product> products = productDtos.stream().map(ProductDto::toEntity).toList();

        for (Product product : products) {
            productRepository.saveProduct(product);

            //product 세팅 및 size 저장
            product.getProductSize().forEach(productSize -> productSize.setProduct(product));
            product.getProductToken().forEach(productSkuToken -> productSkuToken.setProduct(product));
            productRepository.saveAllProductSize(product.getProductSize());
            productRepository.saveAllProductSkuToken(product.getProductToken());
        }

    }

    @Transactional
    public void deleteProducts(List<Long> productIds) {
        List<Product> products = productRepository.findAllByIds(productIds);

        // 2) 조회된 ID 집합 생성
        Set<Long> foundIds = products.stream()
                .map(Product::getId)
                .collect(Collectors.toSet());

        // 3) 누락된 ID 확인
        List<Long> missingIds = productIds.stream()
                .filter(id -> !foundIds.contains(id))
                .toList();

        // 4) 누락된 ID가 있으면 예외
        if (!missingIds.isEmpty()) {
            throw new EntityNotFoundException("존재하지 않는 상품 ID: " + missingIds);
            // 또는 IllegalArgumentException, CustomException 등 원하는 예외로 바꿔도 됩니다.
        }

        productRepository.deleteAllProduct(productIds);
    }


}
