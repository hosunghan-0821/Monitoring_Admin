package com.dopee.common.excel;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface ExcelParser<T> {

    List<T> parse(MultipartFile multipartFile) throws IOException;
}
