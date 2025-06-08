package com.dopee.domain.product;

import com.dopee.domain.product.dto.ProductDto;
import com.dopee.domain.product.excel.ProductExcelParser;
import com.dopee.domain.product.excel.ProductExcelWriter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.OutputStream;
import java.rmi.RemoteException;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor
public class ProductFacadeService {
    private final ProductService productService;
    private final ProductExcelWriter productExcelWriter;
    private final ProductExcelParser excelParser;

    public void bulkRegisterByFile(MultipartFile file) throws IOException {

        if (!excelParser.validateExcelSignature(file)) {
            throw new RemoteException("Not Excel File");
        }
        List<ProductDto> parseProductDto = excelParser.parse(file);
        List<ProductDto> filteredProductDto = parseProductDto.stream()
                .filter(dto -> StringUtils.hasText(dto.getBoutique()) && StringUtils.hasText(dto.getBrand()) && StringUtils.hasText(dto.getSku()))
                .collect(Collectors.toList());

        //사용자에게 보여지기 편하게 하기 위해서
        Collections.reverse(filteredProductDto);
        productService.upsertProducts(filteredProductDto);

    }

    public void downloadProductExcel(OutputStream out) throws IOException {
        List<ProductDto> allProducts = productService.getAllProducts();
        log.info("총 size 개수 : {}", allProducts.size());
        try (Workbook wb = productExcelWriter.createWorkbook(allProducts)) {
            wb.write(out);
        }
    }
}
