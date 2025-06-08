package com.dopee.domain.product.excel;

public enum ProductExcelColumn {
    NUM            (0, "NUM"),
    DB_ID          (1, "DB_ID"),
    BOUTIQUE       (2, "BOUTIQUE"),
    BRAND          (3, "BRAND"),
    SKU            (4, "SKU"),
    PRICE          (5, "PRICE"),
    COUNT          (6, "COUNT"),
    PRODUCT_SIZES  (7, "PRODUCT_SIZES"),
    PRODUCT_TOKENS (8, "PRODUCT_TOKENS");

    private final int index;
    private final String header;

    ProductExcelColumn(int index, String header) {
        this.index = index;
        this.header = header;
    }

    public int getIndex() {
        return index;
    }

    public String getHeader() {
        return header;
    }
}
