package com.dopee.domain.product.excel;

import com.dopee.domain.product.dto.ProductDto;
import com.dopee.domain.product.dto.ProductSizeDto;
import com.dopee.domain.product.dto.ProductSkuTokenDto;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ProductExcelWriter {


    public Workbook createWorkbook(List<ProductDto> products) {
        Workbook wb = new XSSFWorkbook();
        Sheet sheet = wb.createSheet("Products");

        // 1) 헤더 스타일
        CellStyle headerStyle = wb.createCellStyle();
        Font font = wb.createFont();
        font.setBold(true);
        headerStyle.setFont(font);

        // 2) 헤더 행 생성 (요청하신 대문자 명칭)
        Row header = sheet.createRow(0);
        String[] columns = {
                ProductExcelColumn.NUM.getHeader(),
                ProductExcelColumn.DB_ID.getHeader(),
                ProductExcelColumn.BOUTIQUE.getHeader(),
                ProductExcelColumn.BRAND.getHeader(),
                ProductExcelColumn.SKU.getHeader(),
                ProductExcelColumn.PRICE.getHeader(),
                ProductExcelColumn.COUNT.getHeader(),
                ProductExcelColumn.PRODUCT_SIZES.getHeader(),
                ProductExcelColumn.PRODUCT_TOKENS.getHeader()
        };
        for (int i = 0; i < columns.length; i++) {
            Cell cell = header.createCell(i);
            cell.setCellValue(columns[i]);
            cell.setCellStyle(headerStyle);
        }

        // 3) 데이터 행
        int rowIdx = 1;

        for (ProductDto p : products) {
            int columnIdx = 0;
            Row row = sheet.createRow(rowIdx);
            row.createCell(columnIdx++).setCellValue(rowIdx);
            rowIdx++;
            row.createCell(columnIdx++).setCellValue(p.getId());
            row.createCell(columnIdx++).setCellValue(p.getBoutique());
            row.createCell(columnIdx++).setCellValue(p.getBrand());
            row.createCell(columnIdx++).setCellValue(p.getSku());
            row.createCell(columnIdx++).setCellValue(p.getPrice());
            row.createCell(columnIdx++).setCellValue(p.getCount());

            String sizes = p.getProductSizes().stream()
                    .map(ProductSizeDto::getName)
                    .collect(Collectors.joining(","));
            row.createCell(columnIdx++).setCellValue(sizes);

            String tokens = p.getProductSkuTokens().stream()
                    .map(ProductSkuTokenDto::getToken)
                    .collect(Collectors.joining(","));
            row.createCell(columnIdx++).setCellValue(tokens);
        }

        // 4) 컬럼 너비 자동 조정
        for (int i = 0; i < columns.length; i++) {
            sheet.autoSizeColumn(i);
        }

        return wb;
    }
}
