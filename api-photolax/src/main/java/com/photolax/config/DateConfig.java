package com.photolax.config;

import java.time.format.DateTimeFormatter;

public class DateConfig {
    public static final String DATE_FORMAT = "dd/MM/yyyy";
    public static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern(DATE_FORMAT);
} 