import { describe, it, expect } from 'vitest';
import {
  ValidationRules,
  validateProject,
  validateProjectCreation,
  validateProjectUpdate,
  validateFile,
  sanitizeInput,
  formatBytes,
  validateEmail,
  validatePasswordStrength,
  processProjectData
} from './validation.js';

describe('Validation Utilities', () => {
  describe('validateProject', () => {
    it('should validate a valid project', () => {
      const validProject = {
        title: 'Test Project',
        category: 'Social Media',
        description: 'A test project description',
        imageUrl: 'https://example.com/image.jpg',
        link: 'https://example.com'
      };

      const result = validateProject(validProject);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it('should reject project with missing title', () => {
      const invalidProject = {
        category: 'Social Media',
        description: 'A test project description'
      };

      const result = validateProject(invalidProject);
      expect(result.isValid).toBe(false);
      expect(result.errors.title).toBe('Title is required');
    });

    it('should reject project with title too short', () => {
      const invalidProject = {
        title: '',
        category: 'Social Media'
      };

      const result = validateProject(invalidProject);
      expect(result.isValid).toBe(false);
      expect(result.errors.title).toBe('Title is required');
    });

    it('should reject project with invalid title characters', () => {
      const invalidProject = {
        title: 'Test<>Project',
        category: 'Social Media'
      };

      const result = validateProject(invalidProject);
      expect(result.isValid).toBe(false);
      expect(result.errors.title).toBe('Title contains invalid characters');
    });

    it('should reject project with invalid category', () => {
      const invalidProject = {
        title: 'Test Project',
        category: 'Invalid Category'
      };

      const result = validateProject(invalidProject);
      expect(result.isValid).toBe(false);
      expect(result.errors.category).toBe('Invalid category selected');
    });

    it('should reject project with missing category', () => {
      const invalidProject = {
        title: 'Test Project',
        description: 'A test project description'
      };

      const result = validateProject(invalidProject);
      expect(result.isValid).toBe(false);
      expect(result.errors.category).toBe('Category is required');
    });

    it('should reject project with invalid description', () => {
      const invalidProject = {
        title: 'Test Project',
        category: 'Social Media',
        description: 'Invalid <> description'
      };

      const result = validateProject(invalidProject);
      expect(result.isValid).toBe(false);
      expect(result.errors.description).toBe('Description contains invalid characters');
    });

    it('should reject project with invalid link format', () => {
      const invalidProject = {
        title: 'Test Project',
        category: 'Social Media',
        link: 'ftp://example.com'
      };

      const result = validateProject(invalidProject);
      expect(result.isValid).toBe(false);
      expect(result.errors.link).toBe('Link must be a valid HTTPS URL');
    });

    it('should reject project with invalid image URL', () => {
      const invalidProject = {
        title: 'Test Project',
        category: 'Social Media',
        imageUrl: 'http://example.com/image.gif'
      };

      const result = validateProject(invalidProject);
      expect(result.isValid).toBe(false);
      expect(result.errors.imageUrl).toBe('Image URL must be HTTPS and end with a valid image extension');
    });

    it('should reject project with too long title', () => {
      const longTitle = 'a'.repeat(201);
      const invalidProject = {
        title: longTitle,
        category: 'Social Media'
      };

      const result = validateProject(invalidProject);
      expect(result.isValid).toBe(false);
      expect(result.errors.title).toBe('Title is too long');
    });
  });

  describe('validateProjectCreation', () => {
    it('should require imageUrl for creation', () => {
      const project = {
        title: 'Test Project',
        category: 'Social Media',
        description: 'A test project description'
      };

      const result = validateProjectCreation(project);
      expect(result.isValid).toBe(false);
      expect(result.errors.imageUrl).toBe('Image URL is required for new projects');
    });

    it('should validate project creation with valid image', () => {
      const project = {
        title: 'Test Project',
        category: 'Social Media',
        imageUrl: 'https://example.com/image.jpg'
      };

      const result = validateProjectCreation(project);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });
  });

  describe('validateProjectUpdate', () => {
    it('should allow empty imageUrl for updates', () => {
      const project = {
        title: 'Test Project',
        category: 'Social Media',
        imageUrl: ''
      };

      const result = validateProjectUpdate(project);
      expect(result.isValid).toBe(true);
    });

    it('should reject invalid imageUrl on update when provided', () => {
      const project = {
        title: 'Test Project',
        category: 'Social Media',
        imageUrl: 'http://example.com/image.gif'
      };

      const result = validateProjectUpdate(project);
      expect(result.isValid).toBe(false);
      expect(result.errors.imageUrl).toBe('Image URL must be HTTPS and end with a valid image extension');
    });
  });

  describe('validateFile', () => {
    it('should validate a valid image file', () => {
      const validFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      Object.defineProperty(validFile, 'size', { value: 1024 * 1024 }); // 1MB

      const result = validateFile(validFile);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should reject file that is too large', () => {
      const largeFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      Object.defineProperty(largeFile, 'size', { value: 10 * 1024 * 1024 }); // 10MB

      const result = validateFile(largeFile);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('File size (10 MB) exceeds limit of 5 MB');
    });

    it('should reject invalid file type', () => {
      const invalidFile = new File(['test'], 'test.gif', { type: 'image/gif' });

      const result = validateFile(invalidFile);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('File type image/gif is not allowed. Use JPEG, PNG, or WebP');
    });

    it('should reject missing file input', () => {
      const result = validateFile(null);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('File is required');
    });

    it('should reject invalid file name characters', () => {
      const invalidFile = new File(['test'], 'bad file?.jpg', { type: 'image/jpeg' });
      Object.defineProperty(invalidFile, 'size', { value: 1024 * 1024 });

      const result = validateFile(invalidFile);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Filename contains invalid characters');
    });
  });

  describe('sanitizeInput', () => {
    it('should sanitize HTML characters', () => {
      const input = '<script>alert("xss")</script>';
      const result = sanitizeInput(input);
      expect(result).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;');
    });

    it('should trim whitespace', () => {
      const input = '  test  ';
      const result = sanitizeInput(input);
      expect(result).toBe('test');
    });

    it('should return non-string input unchanged', () => {
      const input = 123;
      const result = sanitizeInput(input);
      expect(result).toBe(123);
    });

    it('should escape forward slashes', () => {
      const input = '/path/to/resource';
      const result = sanitizeInput(input);
      expect(result).toBe('&#x2F;path&#x2F;to&#x2F;resource');
    });
  });

  describe('formatBytes', () => {
    it('should format bytes correctly', () => {
      expect(formatBytes(0)).toBe('0 Bytes');
      expect(formatBytes(1024)).toBe('1 KB');
      expect(formatBytes(1024 * 1024)).toBe('1 MB');
      expect(formatBytes(1024 * 1024 * 1024)).toBe('1 GB');
    });
  });

  describe('validateEmail', () => {
    it('should validate correct email formats', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name+tag@example.co.uk')).toBe(true);
    });

    it('should reject invalid email formats', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
    });
  });

  describe('validatePasswordStrength', () => {
    it('should validate strong password', () => {
      const result = validatePasswordStrength('StrongP@ssw0rd123!');
      expect(result.isValid).toBe(true);
      expect(result.strength).toBe('Very Strong');
    });

    it('should reject weak password', () => {
      const result = validatePasswordStrength('weak');
      expect(result.isValid).toBe(false);
      expect(result.strength).toBe('Weak');
    });

    it('should score passwords by criteria', () => {
      const result = validatePasswordStrength('GoodPass123!');
      expect(result.rules.minLength).toBe(true);
      expect(result.rules.hasUpperCase).toBe(true);
      expect(result.rules.hasLowerCase).toBe(true);
      expect(result.rules.hasNumbers).toBe(true);
      expect(result.rules.hasSpecialChar).toBe(true);
      expect(result.strength).toBe('Very Strong');
    });
  });

  describe('processProjectData', () => {
    it('should sanitize and process project data', () => {
      const rawData = {
        title: '  Test Project<script>  ',
        category: 'Social Media',
        description: 'Description with <tags>',
        imageUrl: 'https://example.com/image.jpg',
        link: 'https://example.com'
      };

      const result = processProjectData(rawData);
      expect(result.title).toBe('Test Project&lt;script&gt;');
      expect(result.description).toBe('Description with &lt;tags&gt;');
      expect(result.category).toBe('Social Media');
    });
  });
});