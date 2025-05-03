package com.dopee.domain.product;

import com.dopee.domain.product.dto.ProductDto;
import lombok.RequiredArgsConstructor;
import module.database.entity.Product;
import module.database.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public Page<ProductDto> getProducts(Pageable pageable) {
        Page<Product> products = productRepository.getProducts(pageable);
        List<ProductDto> productDtos = products.getContent().stream().map(ProductDto::fromEntity).collect(Collectors.toList());
        return new PageImpl<>(productDtos, pageable, products.getTotalElements());
    }
}
