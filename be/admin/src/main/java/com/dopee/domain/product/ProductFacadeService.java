package com.dopee.domain.product;

import com.dopee.common.util.FileUtil;
import com.dopee.domain.product.dto.ProductDto;
import com.dopee.domain.product.excel.ProductExcelParser;
import com.dopee.domain.product.excel.ProductExcelWriter;
import jakarta.servlet.ServletOutputStream;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.rmi.RemoteException;
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
                .filter(dto ->
                        StringUtils.hasText(dto.getBoutique()) &&
                                StringUtils.hasText(dto.getBrand()) &&
                                StringUtils.hasText(dto.getSku())
                )
                .collect(Collectors.toList());

        productService.saveProducts(filteredProductDto);

    }

    public void downloadProductExcel(OutputStream out) throws IOException {
        List<ProductDto> allProducts = productService.getAllProducts();
        log.info("총 size 개수 : {}", allProducts.size());
        try (Workbook wb = productExcelWriter.createWorkbook(allProducts)) {
            wb.write(out);
        }
    }
}
