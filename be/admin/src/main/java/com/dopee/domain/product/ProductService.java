package com.dopee.domain.product;

import com.dopee.domain.product.dto.ProductDto;
import com.dopee.domain.product.dto.ProductSearchDto;
import com.dopee.domain.product.dto.ProductSizeDto;
import com.dopee.domain.product.dto.ProductSkuTokenDto;
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
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.function.Function;
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
        Product product = productRepository.findById(productDto.getId())
                .orElseThrow(() -> new RuntimeException("유효하지 않은 ID 입니다."));
        applyUpdate(product, productDto);
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
    public void upsertProducts(List<ProductDto> productDtos) {

        List<ProductDto> updateProductDtos = new ArrayList<>();
        for (ProductDto productDto : productDtos) {
            //Insert
            if (productDto.getId() == null) {
                Product product = productDto.toEntity();
                productRepository.saveProduct(product);
                //product 세팅 및 size 저장
                product.getProductSize().forEach(productSize -> {
                    productSize.setProduct(product);
                    productSize.setAutoBuy(true);
                });
                product.getProductToken().forEach(productSkuToken -> productSkuToken.setProduct(product));
                productRepository.saveAllProductSize(product.getProductSize());
                productRepository.saveAllProductSkuToken(product.getProductToken());
            } else {  //Update
                updateProductDtos.add(productDto);
            }
        }
        updateProductByBulk(updateProductDtos);
    }


    /**
     * 공통: 엔티티 필드 업데이트 + 사이즈/토큰 동기화
     */
    private void applyUpdate(Product product, ProductDto dto) {
        // 1) 기본 필드
        product.update(
                dto.getBoutique(),
                dto.getBrand(),
                dto.getSku(),
                dto.getName(),
                dto.getLink(),
                dto.getImageSrc(),
                dto.getPrice(),
                dto.getCount()
        );
        // 2) 사이즈 동기화
        syncSizes(product, dto.getProductSizes());
        // 3) 토큰 동기화
        syncTokens(product, dto.getProductSkuTokens());
    }

    /**
     * ProductSize: 내용이 완전히 같으면 스킵, 아니면 delete→insert
     */
    private void syncSizes(Product product, List<ProductSizeDto> sizeDtos) {
        List<String> newNames = sizeDtos.stream()
                .map(ProductSizeDto::getName)
                .sorted()
                .toList();

        List<String> existingNames = product.getProductSize().stream()
                .map(ProductSize::getName)
                .sorted()
                .toList();

        if (existingNames.equals(newNames)) {
            return;
        }

        productRepository.deleteProductSize(product.getId());
        List<ProductSize> toSave = sizeDtos.stream()
                .map(dto -> {
                    ProductSize e = dto.toEntity();
                    e.setProduct(product);
                    e.setAutoBuy(true);
                    return e;
                })
                .toList();
        productRepository.saveAllProductSize(toSave);
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

    @Transactional(readOnly = true)
    public List<ProductDto> getAllProducts() {
        List<Product> allProductsInBatch = productRepository.findAllProductsInBatch();
        return allProductsInBatch.stream().map(ProductDto::fromEntity).collect(Collectors.toList());
    }

    private void updateProductByBulk(List<ProductDto> updateProductDtos) {
        List<Long> updatedProductIds = updateProductDtos.stream().map(ProductDto::getId).toList();

        List<Product> products = productRepository.findAllByIds(updatedProductIds);

        Map<Long, Product> productById = products.stream()
                .collect(Collectors.toMap(Product::getId,       // key mapper: 제품 ID
                        Function.identity()   // value mapper: Product 객체 자체
                ));

        for (ProductDto dto : updateProductDtos) {
            Product product = productById.get(dto.getId());
            if (product != null) {
                applyUpdate(product, dto);
            }
        }
    }

    /**
     * ProductSkuToken: 내용이 완전히 같으면 스킵, 아니면 delete→insert
     */
    private void syncTokens(Product product, List<ProductSkuTokenDto> tokenDtos) {
        List<String> newTokens = tokenDtos.stream()
                .map(ProductSkuTokenDto::getToken)
                .sorted()
                .toList();

        List<String> existingTokens = product.getProductToken().stream()
                .map(ProductSkuToken::getToken)
                .sorted()
                .toList();

        if (existingTokens.equals(newTokens)) {
            return;
        }

        productRepository.deleteProductSkuToken(product.getId());
        List<ProductSkuToken> toSave = tokenDtos.stream()
                .map(dto -> {
                    ProductSkuToken e = dto.toEntity();
                    e.setProduct(product);
                    return e;
                })
                .toList();
        productRepository.saveAllProductSkuToken(toSave);
    }
}
