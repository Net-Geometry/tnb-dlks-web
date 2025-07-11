// Security utility functions for the application

export class SecurityUtils {
  /**
   * Sanitize user input to prevent XSS attacks
   */
  static sanitizeInput(input: string): string {
    if (!input || typeof input !== 'string') return '';
    
    return input
      .replace(/[<>]/g, '') // Remove < and > characters
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .trim();
  }

  /**
   * Validate and sanitize email addresses
   */
  static sanitizeEmail(email: string): string {
    if (!email || typeof email !== 'string') return '';
    
    return email.toLowerCase().trim();
  }

  /**
   * Check if a string contains potentially malicious content
   */
  static isSuspiciousContent(input: string): boolean {
    if (!input || typeof input !== 'string') return false;
    
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /vbscript:/i,
      /onclick/i,
      /onerror/i,
      /onload/i,
      /eval\(/i,
      /expression\(/i,
    ];
    
    return suspiciousPatterns.some(pattern => pattern.test(input));
  }

  /**
   * Generate a secure random string for CSRF tokens
   */
  static generateSecureToken(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const crypto = window.crypto || (window as any).msCrypto;
    
    if (crypto && crypto.getRandomValues) {
      const array = new Uint8Array(length);
      crypto.getRandomValues(array);
      for (let i = 0; i < length; i++) {
        result += chars[array[i] % chars.length];
      }
    } else {
      // Fallback for older browsers (less secure)
      for (let i = 0; i < length; i++) {
        result += chars[Math.floor(Math.random() * chars.length)];
      }
    }
    
    return result;
  }

  /**
   * Check password strength
   */
  static checkPasswordStrength(password: string): {
    isStrong: boolean;
    score: number;
    feedback: string[];
  } {
    const feedback: string[] = [];
    let score = 0;

    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('Password should be at least 8 characters long');
    }

    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Include lowercase letters');
    }

    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Include uppercase letters');
    }

    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push('Include numbers');
    }

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Include special characters');
    }

    // Check for common patterns
    if (/(.)\1{2,}/.test(password)) {
      score -= 1;
      feedback.push('Avoid repeating characters');
    }

    if (/123|abc|qwe/i.test(password)) {
      score -= 1;
      feedback.push('Avoid common sequences');
    }

    return {
      isStrong: score >= 4,
      score: Math.max(0, score),
      feedback
    };
  }

  /**
   * Rate limiting helper
   */
  static createRateLimiter(maxAttempts: number, windowMs: number) {
    const attempts = new Map<string, { count: number; resetTime: number }>();

    return {
      isAllowed: (key: string): boolean => {
        const now = Date.now();
        const userAttempts = attempts.get(key);

        if (!userAttempts || now > userAttempts.resetTime) {
          attempts.set(key, { count: 1, resetTime: now + windowMs });
          return true;
        }

        if (userAttempts.count >= maxAttempts) {
          return false;
        }

        userAttempts.count++;
        return true;
      },
      reset: (key: string): void => {
        attempts.delete(key);
      }
    };
  }

  /**
   * Secure storage wrapper for sensitive data
   */
  static secureStorage = {
    set: (key: string, value: string): void => {
      try {
        // Only store in sessionStorage for sensitive data
        sessionStorage.setItem(key, btoa(value));
      } catch (error) {
        console.error('Failed to store data securely:', error);
      }
    },
    
    get: (key: string): string | null => {
      try {
        const value = sessionStorage.getItem(key);
        return value ? atob(value) : null;
      } catch (error) {
        console.error('Failed to retrieve data securely:', error);
        return null;
      }
    },
    
    remove: (key: string): void => {
      try {
        sessionStorage.removeItem(key);
      } catch (error) {
        console.error('Failed to remove data securely:', error);
      }
    },
    
    clear: (): void => {
      try {
        sessionStorage.clear();
      } catch (error) {
        console.error('Failed to clear secure storage:', error);
      }
    }
  };
}
