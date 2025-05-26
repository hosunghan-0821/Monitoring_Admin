package com.dopee.domain.product.excel;

import com.dopee.common.excel.AbstractExcelParser;
import com.dopee.domain.product.dto.ProductDto;
import com.dopee.domain.product.dto.ProductSizeDto;
import com.dopee.domain.product.dto.ProductSkuTokenDto;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class ProductExcelParser extends AbstractExcelParser<ProductDto> {

    @Override
    protected ProductDto mapRow(Row row) {

        // 1) 안전하게 원값 추출
        String raw = getStringCell(row, 5);
        String tokenRaw = getStringCell(row, 6);

        List<ProductSizeDto> sizes = Arrays.stream(raw.split(","))
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

        return ProductDto.builder()
                .boutique(row.getCell(0).getStringCellValue())
                .brand(row.getCell(1).getStringCellValue())
                .sku(row.getCell(2).getStringCellValue())
                .price(row.getCell(3).getNumericCellValue())
                .count((long) row.getCell(4).getNumericCellValue())
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
        if (cell == null || cell.getCellType() != CellType.STRING) {
            return "";
        }
        return cell.getStringCellValue();
    }
}
