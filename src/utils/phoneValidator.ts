// Phone Number Validation Utility
// Add this to your utilities or include in your user management service

export class PhoneNumberValidator {
  /**
   * Validates and formats phone numbers for Malaysian context
   * @param phoneNumber - Raw phone number input
   * @returns Formatted phone number or null if invalid
   */
  static validateAndFormat(phoneNumber: string): string | null {
    if (!phoneNumber) return null;

    // Remove all non-digit characters except +
    let cleaned = phoneNumber.replace(/[^\d+]/g, "");

    // Handle different Malaysian phone number formats
    if (cleaned.startsWith("+60")) {
      // International format: +60xxxxxxxxx
      if (cleaned.length >= 12 && cleaned.length <= 14) {
        return cleaned;
      }
    } else if (cleaned.startsWith("60")) {
      // Without plus: 60xxxxxxxxx
      if (cleaned.length >= 11 && cleaned.length <= 13) {
        return "+" + cleaned;
      }
    } else if (cleaned.startsWith("0")) {
      // Local format: 0xxxxxxxxx
      if (cleaned.length >= 10 && cleaned.length <= 12) {
        return "+6" + cleaned.substring(1);
      }
    } else if (cleaned.length >= 9 && cleaned.length <= 11) {
      // Assume Malaysian mobile without prefix
      return "+60" + cleaned;
    }

    return null;
  }

  /**
   * Validates phone number length for database storage
   * @param phoneNumber - Phone number to validate
   * @returns boolean indicating if length is acceptable
   */
  static isValidLength(phoneNumber: string): boolean {
    return phoneNumber && phoneNumber.length <= 20;
  }

  /**
   * Get example valid formats
   * @returns Array of example phone number formats
   */
  static getExampleFormats(): string[] {
    return [
      "+60123456789",
      "+601234567890",
      "0123456789",
      "01234567890",
      "123456789",
      "1234567890",
    ];
  }

  /**
   * Validate Malaysian phone number patterns
   * @param phoneNumber - Phone number to validate
   * @returns boolean indicating if pattern is valid
   */
  static isValidMalaysianPattern(phoneNumber: string): boolean {
    const cleaned = phoneNumber.replace(/[^\d]/g, "");

    // Malaysian mobile patterns (after removing country code)
    const mobilePatterns = [
      /^1[0-9]{8,9}$/, // Mobile: 10-11 digits starting with 1
      /^[3-9][0-9]{7,8}$/, // Landline: 8-9 digits starting with 3-9
    ];

    // Remove +60 or 60 prefix
    let localNumber = cleaned;
    if (localNumber.startsWith("60")) {
      localNumber = localNumber.substring(2);
    }

    return mobilePatterns.some((pattern) => pattern.test(localNumber));
  }
}

// Usage examples:
// const formatted = PhoneNumberValidator.validateAndFormat('+60132050123');
// const isValid = PhoneNumberValidator.isValidLength('+60132050123');
// const isPattern = PhoneNumberValidator.isValidMalaysianPattern('+60132050123');
