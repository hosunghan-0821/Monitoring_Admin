package com.dopee.domain.product.excel;

import com.dopee.common.excel.AbstractExcelParser;
import com.dopee.domain.product.dto.ProductDto;
import com.dopee.domain.product.dto.ProductSizeDto;
import com.dopee.domain.product.dto.ProductSkuTokenDto;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class ProductExcelParser extends AbstractExcelParser<ProductDto> {

    private final DataFormatter formatter = new DataFormatter();

    @Override
    protected ProductDto mapRow(Row row) {

        // 1) 안전하게 원값 추출
        String sizeRaw = getStringCell(row, ProductExcelColumn.PRODUCT_SIZES.getIndex());
        String tokenRaw = getStringCell(row, ProductExcelColumn.PRODUCT_TOKENS.getIndex());

        List<ProductSizeDto> sizes = Arrays.stream(sizeRaw.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .map(v -> ProductSizeDto.builder().name(v).build())
                .collect(Collectors.toList());

        List<ProductSkuTokenDto> tokens = Arrays.stream(tokenRaw.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .map(v -> ProductSkuTokenDto.builder()
                        .token(v)   // id는 기본 null
                        .build())
                .collect(Collectors.toList());

        Cell idCell = row.getCell(ProductExcelColumn.DB_ID.getIndex(), Row.MissingCellPolicy.RETURN_BLANK_AS_NULL);
        return ProductDto.builder()
                .id(idCell != null ? (long) idCell.getNumericCellValue() : null)
                .boutique(getStringCell(row, ProductExcelColumn.BOUTIQUE.getIndex()))
                .brand(getStringCell(row, ProductExcelColumn.BRAND.getIndex()))
                .sku(getStringCell(row, ProductExcelColumn.SKU.getIndex()))
                .price(row.getCell(ProductExcelColumn.PRICE.getIndex()).getNumericCellValue())
                .count((long) row.getCell(ProductExcelColumn.COUNT.getIndex()).getNumericCellValue())
                .productSizes(sizes)
                .productSkuTokens(tokens)
                .build();
    }

    /**
     * 주어진 인덱스의 셀에서 문자열을 안전하게 꺼내옵니다.
     * 셀이 없거나 문자열 타입이 아니면 빈 문자열을 반환.
     */
    private String getStringCell(Row row, int idx) {
        Cell cell = row.getCell(idx, Row.MissingCellPolicy.RETURN_BLANK_AS_NULL);
        if (cell == null ) {
            return "";
        }
        if( cell.getCellType() != CellType.STRING) {
            return formatter.formatCellValue(cell);
        }
        return cell.getStringCellValue();
    }
}
