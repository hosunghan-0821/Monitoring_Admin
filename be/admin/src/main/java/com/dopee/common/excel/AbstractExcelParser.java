package com.dopee.common.excel;

import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Slf4j
public abstract class AbstractExcelParser<T> implements ExcelParser<T> {

    private static final byte[] XLS_SIGNATURE = new byte[]{
            (byte) 0xD0, (byte) 0xCF, 0x11, (byte) 0xE0,
            (byte) 0xA1, (byte) 0xB1, 0x1A, (byte) 0xE1
    };


    @Override
    public List<T> parse(MultipartFile file) throws IOException {
        try (Workbook wb = WorkbookFactory.create(file.getInputStream())) {
            Sheet sheet = wb.getSheetAt(0);
            List<T> result = new ArrayList<>();
            for (Row row : sheet) {
                if (row.getRowNum() == 0) {
                    continue;
                }       // 헤더 스킵
                result.add(mapRow(row));
            }
            return result;
        }
    }

    public boolean validateExcelSignature(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            return false;
        }

        try (InputStream raw = file.getInputStream();
             BufferedInputStream in = new BufferedInputStream(raw)) {

            in.mark(8);
            byte[] header = new byte[8];
            int read = in.read(header, 0, header.length);
            in.reset();

            if (read < 4) {
                return false;
            }

            // Check .xls (OLE2 BIFF)
            if (Arrays.equals(header, XLS_SIGNATURE)) {
                return true;
            }

            // Check .xlsx (ZIP)
            // ZIP files start with: 50 4B 03 04 ("PK\u0003\u0004")
            if (header[0] == 0x50 && header[1] == 0x4B && header[2] == 0x03 && header[3] == 0x04) {
                return true;
            }

        } catch (IOException e) {
            log.error("File is not Excel Format");
            // I/O error or not an Excel file
        }
        return false;
    }

    /**
     * 도메인별로 Row → DTO 변환 로직만 구현하게 한다
     */
    protected abstract T mapRow(Row row);
}
