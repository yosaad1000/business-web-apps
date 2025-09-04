package com.unifiederp.shared.util;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class ValidationUtilsTest {

    @Test
    void testEmailValidation() {
        assertTrue(ValidationUtils.isValidEmail("test@example.com"));
        assertTrue(ValidationUtils.isValidEmail("user.name@domain.co.uk"));
        assertFalse(ValidationUtils.isValidEmail("invalid-email"));
        assertFalse(ValidationUtils.isValidEmail("@domain.com"));
        assertFalse(ValidationUtils.isValidEmail("user@"));
        assertFalse(ValidationUtils.isValidEmail(null));
    }

    @Test
    void testPhoneNumberValidation() {
        assertTrue(ValidationUtils.isValidPhoneNumber("1234567890"));
        assertTrue(ValidationUtils.isValidPhoneNumber("+1234567890"));
        assertTrue(ValidationUtils.isValidPhoneNumber("123-456-7890"));
        assertTrue(ValidationUtils.isValidPhoneNumber("(123) 456-7890"));
        assertFalse(ValidationUtils.isValidPhoneNumber("123"));
        assertFalse(ValidationUtils.isValidPhoneNumber("abc1234567"));
        assertFalse(ValidationUtils.isValidPhoneNumber(null));
    }

    @Test
    void testEmployeeIdValidation() {
        assertTrue(ValidationUtils.isValidEmployeeId("EMP123"));
        assertTrue(ValidationUtils.isValidEmployeeId("ABC123DEF"));
        assertFalse(ValidationUtils.isValidEmployeeId("AB")); // too short
        assertFalse(ValidationUtils.isValidEmployeeId("EMP-123")); // contains hyphen
        assertFalse(ValidationUtils.isValidEmployeeId(null));
    }

    @Test
    void testStringEmptyChecks() {
        assertTrue(ValidationUtils.isEmpty(null));
        assertTrue(ValidationUtils.isEmpty(""));
        assertTrue(ValidationUtils.isEmpty("   "));
        assertFalse(ValidationUtils.isEmpty("test"));
        
        assertFalse(ValidationUtils.isNotEmpty(null));
        assertFalse(ValidationUtils.isNotEmpty(""));
        assertFalse(ValidationUtils.isNotEmpty("   "));
        assertTrue(ValidationUtils.isNotEmpty("test"));
    }

    @Test
    void testLengthValidation() {
        assertTrue(ValidationUtils.isValidLength("test", 1, 10));
        assertTrue(ValidationUtils.isValidLength("test", 4, 4));
        assertFalse(ValidationUtils.isValidLength("test", 5, 10));
        assertFalse(ValidationUtils.isValidLength("test", 1, 3));
        assertFalse(ValidationUtils.isValidLength(null, 1, 10));
    }

    @Test
    void testNumberValidation() {
        assertTrue(ValidationUtils.isPositive(5));
        assertTrue(ValidationUtils.isPositive(0.1));
        assertFalse(ValidationUtils.isPositive(0));
        assertFalse(ValidationUtils.isPositive(-1));
        assertFalse(ValidationUtils.isPositive(null));

        assertTrue(ValidationUtils.isNonNegative(0));
        assertTrue(ValidationUtils.isNonNegative(5));
        assertFalse(ValidationUtils.isNonNegative(-1));
        assertFalse(ValidationUtils.isNonNegative(null));

        assertTrue(ValidationUtils.isInRange(5, 1, 10));
        assertTrue(ValidationUtils.isInRange(1, 1, 10));
        assertTrue(ValidationUtils.isInRange(10, 1, 10));
        assertFalse(ValidationUtils.isInRange(0, 1, 10));
        assertFalse(ValidationUtils.isInRange(11, 1, 10));
        assertFalse(ValidationUtils.isInRange(null, 1, 10));
    }

    @Test
    void testCharacterTypeValidation() {
        assertTrue(ValidationUtils.isAlphanumeric("ABC123"));
        assertFalse(ValidationUtils.isAlphanumeric("ABC-123"));
        assertFalse(ValidationUtils.isAlphanumeric(null));

        assertTrue(ValidationUtils.isAlphabetic("ABC"));
        assertFalse(ValidationUtils.isAlphabetic("ABC123"));
        assertFalse(ValidationUtils.isAlphabetic(null));

        assertTrue(ValidationUtils.isNumeric("123"));
        assertFalse(ValidationUtils.isNumeric("ABC123"));
        assertFalse(ValidationUtils.isNumeric(null));
    }

    @Test
    void testPasswordStrength() {
        assertTrue(ValidationUtils.isStrongPassword("Password123!"));
        assertFalse(ValidationUtils.isStrongPassword("password")); // no uppercase, digit, special
        assertFalse(ValidationUtils.isStrongPassword("PASSWORD")); // no lowercase, digit, special
        assertFalse(ValidationUtils.isStrongPassword("Password")); // no digit, special
        assertFalse(ValidationUtils.isStrongPassword("Pass1!")); // too short
        assertFalse(ValidationUtils.isStrongPassword(null));
    }

    @Test
    void testSanitizeInput() {
        assertEquals("Hello World", ValidationUtils.sanitizeInput("Hello World"));
        assertEquals("Hello World", ValidationUtils.sanitizeInput("Hello <b>World</b>"));
        assertEquals("Hello World", ValidationUtils.sanitizeInput("<script>alert('xss')</script>Hello World"));
        assertEquals("  Hello World  ", ValidationUtils.sanitizeInput("  Hello World  "));
        assertNull(ValidationUtils.sanitizeInput(null));
    }
}