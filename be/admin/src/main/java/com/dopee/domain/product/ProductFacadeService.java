package com.dopee.domain.product;

import com.dopee.domain.product.dto.ProductDto;
import com.dopee.domain.product.excel.ProductExcelParser;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.rmi.RemoteException;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ProductFacadeService {
    private final ProductService productService;
    private final ProductExcelParser excelParser;

    public void bulkRegisterByFile(MultipartFile file) throws IOException {

        if (!excelParser.validateExcelSignature(file)) {
            throw new RemoteException("Not Excel File");
        }
        List<ProductDto> parseProductDto = excelParser.parse(file);
        List<ProductDto> filteredProductDto = parseProductDto.stream()
                .filter(dto ->
                        StringUtils.hasText(dto.getBoutique()) &&
                                StringUtils.hasText(dto.getBrand()) &&
                                StringUtils.hasText(dto.getSku())
                )
                .collect(Collectors.toList());

        productService.saveProducts(filteredProductDto);

    }
}
