package com.unifiederp.shared.util;

import java.util.regex.Pattern;

public class ValidationUtils {

    private ValidationUtils() {
        // Utility class
    }

    // Email validation pattern
    private static final Pattern EMAIL_PATTERN = Pattern.compile(
            "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$"
    );

    // Phone number validation pattern (supports various formats)
    private static final Pattern PHONE_PATTERN = Pattern.compile(
            "^[+]?[1-9]?[0-9]{7,15}$"
    );

    // Employee ID pattern (alphanumeric, 3-20 characters)
    private static final Pattern EMPLOYEE_ID_PATTERN = Pattern.compile(
            "^[A-Za-z0-9]{3,20}$"
    );

    /**
     * Validate email address
     */
    public static boolean isValidEmail(String email) {
        return email != null && EMAIL_PATTERN.matcher(email).matches();
    }

    /**
     * Validate phone number
     */
    public static boolean isValidPhoneNumber(String phone) {
        return phone != null && PHONE_PATTERN.matcher(phone.replaceAll("[\\s()-]", "")).matches();
    }

    /**
     * Validate employee ID
     */
    public static boolean isValidEmployeeId(String employeeId) {
        return employeeId != null && EMPLOYEE_ID_PATTERN.matcher(employeeId).matches();
    }

    /**
     * Check if string is not null and not empty
     */
    public static boolean isNotEmpty(String str) {
        return str != null && !str.trim().isEmpty();
    }

    /**
     * Check if string is null or empty
     */
    public static boolean isEmpty(String str) {
        return str == null || str.trim().isEmpty();
    }

    /**
     * Validate string length
     */
    public static boolean isValidLength(String str, int minLength, int maxLength) {
        if (str == null) {
            return false;
        }
        int length = str.length();
        return length >= minLength && length <= maxLength;
    }

    /**
     * Sanitize string input (remove potentially harmful characters)
     */
    public static String sanitizeInput(String input) {
        if (input == null) {
            return null;
        }
        
        // Remove HTML tags and script content
        return input.replaceAll("<[^>]*>", "")
                   .replaceAll("(?i)<script[^>]*>.*?</script>", "")
                   .trim();
    }

    /**
     * Validate that a number is within a specific range
     */
    public static boolean isInRange(Number value, Number min, Number max) {
        if (value == null || min == null || max == null) {
            return false;
        }
        
        double val = value.doubleValue();
        double minVal = min.doubleValue();
        double maxVal = max.doubleValue();
        
        return val >= minVal && val <= maxVal;
    }

    /**
     * Validate that a number is positive
     */
    public static boolean isPositive(Number value) {
        return value != null && value.doubleValue() > 0;
    }

    /**
     * Validate that a number is non-negative
     */
    public static boolean isNonNegative(Number value) {
        return value != null && value.doubleValue() >= 0;
    }

    /**
     * Check if a string contains only alphanumeric characters
     */
    public static boolean isAlphanumeric(String str) {
        return str != null && str.matches("^[a-zA-Z0-9]+$");
    }

    /**
     * Check if a string contains only alphabetic characters
     */
    public static boolean isAlphabetic(String str) {
        return str != null && str.matches("^[a-zA-Z]+$");
    }

    /**
     * Check if a string contains only numeric characters
     */
    public static boolean isNumeric(String str) {
        return str != null && str.matches("^[0-9]+$");
    }

    /**
     * Validate password strength
     * Requirements: At least 8 characters, contains uppercase, lowercase, digit, and special character
     */
    public static boolean isStrongPassword(String password) {
        if (password == null || password.length() < 8) {
            return false;
        }
        
        boolean hasUpper = password.chars().anyMatch(Character::isUpperCase);
        boolean hasLower = password.chars().anyMatch(Character::isLowerCase);
        boolean hasDigit = password.chars().anyMatch(Character::isDigit);
        boolean hasSpecial = password.chars().anyMatch(ch -> "!@#$%^&*()_+-=[]{}|;:,.<>?".indexOf(ch) >= 0);
        
        return hasUpper && hasLower && hasDigit && hasSpecial;
    }
}