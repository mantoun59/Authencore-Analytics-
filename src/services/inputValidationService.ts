/**
 * Input Validation and Sanitization Service
 * Provides comprehensive input validation, sanitization, and security checks
 */

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  customValidator?: (value: any) => boolean | string;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedValue?: any;
}

export class InputValidationService {
  private static instance: InputValidationService;

  // Common patterns
  private static readonly PATTERNS = {
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    phone: /^\+?[\d\s\-\(\)\.]{10,}$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    alphanumeric: /^[a-zA-Z0-9]+$/,
    safeString: /^[a-zA-Z0-9\s\-\_\.]+$/,
    uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/
  };

  // XSS prevention patterns
  private static readonly XSS_PATTERNS = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /vbscript:/gi,
    /onload\s*=/gi,
    /onclick\s*=/gi,
    /onerror\s*=/gi,
    /onmouseover\s*=/gi,
    /<iframe\b[^>]*>/gi,
    /<object\b[^>]*>/gi,
    /<embed\b[^>]*>/gi
  ];

  static getInstance(): InputValidationService {
    if (!InputValidationService.instance) {
      InputValidationService.instance = new InputValidationService();
    }
    return InputValidationService.instance;
  }

  /**
   * Validate email address
   */
  validateEmail(email: string): ValidationResult {
    const errors: string[] = [];
    let sanitizedValue = this.sanitizeString(email);

    if (!email || email.trim().length === 0) {
      errors.push('Email is required');
    } else if (!InputValidationService.PATTERNS.email.test(sanitizedValue)) {
      errors.push('Invalid email format');
    } else if (sanitizedValue.length > 254) {
      errors.push('Email address too long');
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue: sanitizedValue.toLowerCase().trim()
    };
  }

  /**
   * Validate password
   */
  validatePassword(password: string): ValidationResult {
    const errors: string[] = [];

    if (!password) {
      errors.push('Password is required');
    } else {
      if (password.length < 8) {
        errors.push('Password must be at least 8 characters long');
      }
      if (password.length > 128) {
        errors.push('Password must be less than 128 characters');
      }
      if (!/(?=.*[a-z])/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
      }
      if (!/(?=.*[A-Z])/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
      }
      if (!/(?=.*\d)/.test(password)) {
        errors.push('Password must contain at least one number');
      }
      if (!/(?=.*[@$!%*?&])/.test(password)) {
        errors.push('Password must contain at least one special character (@$!%*?&)');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue: password // Don't sanitize passwords
    };
  }

  /**
   * Validate assessment response
   */
  validateAssessmentResponse(response: any): ValidationResult {
    const errors: string[] = [];
    let sanitizedValue = response;

    if (typeof response === 'string') {
      sanitizedValue = this.sanitizeString(response);
      if (sanitizedValue.length > 1000) {
        errors.push('Response too long (max 1000 characters)');
      }
    } else if (typeof response === 'number') {
      if (response < 1 || response > 10) {
        errors.push('Response must be between 1 and 10');
      }
    } else if (Array.isArray(response)) {
      if (response.length > 50) {
        errors.push('Too many response items (max 50)');
      }
      sanitizedValue = response.map(item => 
        typeof item === 'string' ? this.sanitizeString(item) : item
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue
    };
  }

  /**
   * Validate file upload
   */
  validateFileUpload(file: File, allowedTypes: string[] = [], maxSize: number = 5 * 1024 * 1024): ValidationResult {
    const errors: string[] = [];

    if (!file) {
      errors.push('File is required');
      return { isValid: false, errors };
    }

    // Check file size
    if (file.size > maxSize) {
      errors.push(`File size exceeds limit of ${maxSize / (1024 * 1024)}MB`);
    }

    // Check file type
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      errors.push(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`);
    }

    // Check for potentially dangerous file extensions
    const dangerousExtensions = ['.exe', '.bat', '.cmd', '.com', '.pif', '.scr', '.vbs', '.js'];
    const fileName = file.name.toLowerCase();
    for (const ext of dangerousExtensions) {
      if (fileName.endsWith(ext)) {
        errors.push('File type not allowed for security reasons');
        break;
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue: file
    };
  }

  /**
   * Validate user input with custom rules
   */
  validateInput(value: any, rules: ValidationRule): ValidationResult {
    const errors: string[] = [];
    let sanitizedValue = value;

    // Required check
    if (rules.required && (!value || (typeof value === 'string' && value.trim().length === 0))) {
      errors.push('This field is required');
      return { isValid: false, errors };
    }

    // Skip further validation if not required and empty
    if (!rules.required && (!value || (typeof value === 'string' && value.trim().length === 0))) {
      return { isValid: true, errors: [], sanitizedValue: value };
    }

    // Sanitize string inputs
    if (typeof value === 'string') {
      sanitizedValue = this.sanitizeString(value);
    }

    // Length checks
    if (rules.minLength && sanitizedValue.length < rules.minLength) {
      errors.push(`Minimum length is ${rules.minLength} characters`);
    }
    if (rules.maxLength && sanitizedValue.length > rules.maxLength) {
      errors.push(`Maximum length is ${rules.maxLength} characters`);
    }

    // Pattern check
    if (rules.pattern && !rules.pattern.test(sanitizedValue)) {
      errors.push('Invalid format');
    }

    // Custom validator
    if (rules.customValidator) {
      const result = rules.customValidator(sanitizedValue);
      if (typeof result === 'string') {
        errors.push(result);
      } else if (!result) {
        errors.push('Invalid value');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue
    };
  }

  /**
   * Sanitize string input
   */
  sanitizeString(input: string): string {
    if (!input || typeof input !== 'string') {
      return '';
    }

    let sanitized = input.trim();

    // Remove null bytes
    sanitized = sanitized.replace(/\0/g, '');

    // HTML encode dangerous characters
    sanitized = sanitized
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');

    // Remove XSS patterns
    for (const pattern of InputValidationService.XSS_PATTERNS) {
      sanitized = sanitized.replace(pattern, '');
    }

    return sanitized;
  }

  /**
   * Validate and sanitize object with multiple fields
   */
  validateObject(obj: Record<string, any>, rules: Record<string, ValidationRule>): {
    isValid: boolean;
    errors: Record<string, string[]>;
    sanitizedData: Record<string, any>;
  } {
    const errors: Record<string, string[]> = {};
    const sanitizedData: Record<string, any> = {};
    let isValid = true;

    for (const [field, rule] of Object.entries(rules)) {
      const result = this.validateInput(obj[field], rule);
      if (!result.isValid) {
        errors[field] = result.errors;
        isValid = false;
      }
      sanitizedData[field] = result.sanitizedValue;
    }

    return { isValid, errors, sanitizedData };
  }

  /**
   * Validate JSON input
   */
  validateJSON(jsonString: string, maxSize: number = 1024 * 1024): ValidationResult {
    const errors: string[] = [];

    if (!jsonString) {
      errors.push('JSON data is required');
      return { isValid: false, errors };
    }

    if (jsonString.length > maxSize) {
      errors.push(`JSON data exceeds maximum size of ${maxSize / 1024}KB`);
    }

    try {
      const parsed = JSON.parse(jsonString);
      
      // Check for potentially dangerous content
      if (this.containsDangerousContent(parsed)) {
        errors.push('JSON contains potentially dangerous content');
      }

      return {
        isValid: errors.length === 0,
        errors,
        sanitizedValue: parsed
      };
    } catch (error) {
      errors.push('Invalid JSON format');
      return { isValid: false, errors };
    }
  }

  /**
   * Check for dangerous content in objects
   */
  private containsDangerousContent(obj: any): boolean {
    if (typeof obj === 'string') {
      for (const pattern of InputValidationService.XSS_PATTERNS) {
        if (pattern.test(obj)) {
          return true;
        }
      }
    } else if (Array.isArray(obj)) {
      return obj.some(item => this.containsDangerousContent(item));
    } else if (obj && typeof obj === 'object') {
      return Object.values(obj).some(value => this.containsDangerousContent(value));
    }

    return false;
  }

  /**
   * Rate limiting check
   */
  checkRateLimit(identifier: string, maxRequests: number = 100, windowMs: number = 60000): boolean {
    const key = `rate_limit_${identifier}`;
    const now = Date.now();
    const window = Math.floor(now / windowMs);
    const storageKey = `${key}_${window}`;

    try {
      const current = parseInt(localStorage.getItem(storageKey) || '0');
      if (current >= maxRequests) {
        return false;
      }

      localStorage.setItem(storageKey, (current + 1).toString());
      
      // Clean up old windows
      for (let i = 1; i <= 5; i++) {
        const oldKey = `${key}_${window - i}`;
        localStorage.removeItem(oldKey);
      }

      return true;
    } catch (error) {
      // If localStorage fails, allow the request
      console.warn('Rate limiting failed:', error);
      return true;
    }
  }
}

export const inputValidationService = InputValidationService.getInstance();