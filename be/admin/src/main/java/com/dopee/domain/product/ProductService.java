package com.dopee.domain.product;

import com.dopee.domain.product.dto.ProductDto;
import com.dopee.domain.product.dto.ProductSizeDto;
import lombok.RequiredArgsConstructor;
import module.database.entity.Product;
import module.database.entity.ProductSize;
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
    public Page<ProductDto> getProducts(Pageable pageable) {
        Page<Product> products = productRepository.getProducts(pageable);
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
            productRepository.saveAllProductSize(product.getProductSize());
        }

    }
}
