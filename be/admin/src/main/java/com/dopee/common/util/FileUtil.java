package com.dopee.common.util;

import lombok.experimental.UtilityClass;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@UtilityClass
public class FileUtil {
    private static final DateTimeFormatter FILE_TIMESTAMP_FORMATTER =
            DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss");

    public static String nowTimestamp() {
        return LocalDateTime.now().format(FILE_TIMESTAMP_FORMATTER);
    }

    public static String timestampedFilename(String baseName, String extension) {
        return String.format("%s_%s.%s", baseName, nowTimestamp(), extension);
    }

    public static String encodedTimestampedFilename(String baseName, String extension) {
        String filename = timestampedFilename(baseName, extension);
        return URLEncoder.encode(filename, StandardCharsets.UTF_8);
    }
}
