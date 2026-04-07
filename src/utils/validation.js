/**
 * Data Validation Utilities
 * Provides comprehensive validation for projects and other data
 */

export const ValidationRules = {
  project: {
    title: {
      minLength: 1,
      maxLength: 200,
      pattern: /^[a-zA-Z0-9\s\-_().,'&:"/!?]+$/,
      message: 'Title must be 1-200 characters with valid characters'
    },
    category: {
      allowedValues: ['Social Media', 'Motion Graphics', 'YouTube', 'Short-Form', 'Other'],
      message: 'Invalid category selected'
    },
    description: {
      maxLength: 2000,
      pattern: /^[a-zA-Z0-9\s\-_().,'&:"\n/!?]*$/,
      message: 'Description must be under 2000 characters with valid characters'
    },
    imageUrl: {
      maxLength: 2000,
      pattern: /^https:\/\/.+\.(jpg|jpeg|png|webp)$/i,
      message: 'Image URL must be HTTPS and end with .jpg, .jpeg, .png, or .webp'
    },
    link: {
      maxLength: 2000,
      pattern: /^(https?:\/\/.+)?$/,
      message: 'Link must be a valid HTTP(S) URL'
    }
  },
  file: {
    image: {
      maxSize: 5 * 1024 * 1024, // 5MB
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
      message: 'Image must be JPEG, PNG, or WebP format and under 5MB'
    }
  }
};

/**
 * Validate project data
 */
export function validateProject(data) {
  const errors = {};

  // Title validation
  if (!data.title) {
    errors.title = 'Title is required';
  } else if (data.title.length < ValidationRules.project.title.minLength) {
    errors.title = 'Title is too short';
  } else if (data.title.length > ValidationRules.project.title.maxLength) {
    errors.title = 'Title is too long';
  } else if (!ValidationRules.project.title.pattern.test(data.title)) {
    errors.title = 'Title contains invalid characters';
  }

  // Category validation
  if (!data.category) {
    errors.category = 'Category is required';
  } else if (!ValidationRules.project.category.allowedValues.includes(data.category)) {
    errors.category = ValidationRules.project.category.message;
  }

  // Description validation (optional but has limits)
  if (data.description) {
    if (data.description.length > ValidationRules.project.description.maxLength) {
      errors.description = 'Description is too long';
    } else if (!ValidationRules.project.description.pattern.test(data.description)) {
      errors.description = 'Description contains invalid characters';
    }
  }

  // Image URL validation (optional but has format)
  if (data.imageUrl) {
    if (!ValidationRules.project.imageUrl.pattern.test(data.imageUrl)) {
      errors.imageUrl = 'Image URL must be HTTPS and end with a valid image extension';
    }
  }

  // Link validation (optional but has format)
  if (data.link && data.link.trim()) {
    if (!ValidationRules.project.link.pattern.test(data.link)) {
      errors.link = 'Link must be a valid HTTPS URL';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Validate project for creation (strict)
 */
export function validateProjectCreation(data) {
  const validation = validateProject(data);
  
  // Additional checks for creation
  if (!data.imageUrl) {
    validation.errors.imageUrl = 'Image URL is required for new projects';
    validation.isValid = false;
  }

  return validation;
}

/**
 * Validate project for update (less strict)
 */
export function validateProjectUpdate(data) {
  const validation = validateProject(data);
  
  // Remove required checks for optional fields during update
  if (validation.errors.imageUrl && data.imageUrl === '') {
    delete validation.errors.imageUrl;
  }

  validation.isValid = Object.keys(validation.errors).length === 0;
  return validation;
}

/**
 * Validate file before upload
 */
export function validateFile(file) {
  const errors = [];
  const rules = ValidationRules.file.image;

  if (!file) {
    errors.push('File is required');
    return { isValid: false, errors };
  }

  // Check file size
  if (file.size > rules.maxSize) {
    errors.push(`File size (${formatBytes(file.size)}) exceeds limit of ${formatBytes(rules.maxSize)}`);
  }

  // Check file type
  if (!rules.allowedTypes.includes(file.type)) {
    errors.push(`File type ${file.type} is not allowed. Use JPEG, PNG, or WebP`);
  }

  // Check filename
  const validName = /^[a-zA-Z0-9_-]+\.(jpg|jpeg|png|webp)$/i.test(file.name);
  if (!validName) {
    errors.push('Filename contains invalid characters');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Sanitize user input
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Format bytes to human-readable size
 */
export function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Validate email
 */
export function validateEmail(email) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

/**
 * Validate password strength
 */
export function validatePasswordStrength(password) {
  const rules = {
    minLength: password.length >= 12,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumbers: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  const strength = Object.values(rules).filter(Boolean).length;
  const score = {
    0: 'Very Weak',
    1: 'Weak',
    2: 'Fair',
    3: 'Good',
    4: 'Strong',
    5: 'Very Strong'
  }[strength];

  return {
    isValid: strength >= 3,
    rules,
    strength: score
  };
}

/**
 * Sanitize and validate project data
 */
export function processProjectData(data) {
  return {
    title: sanitizeInput(data.title),
    category: sanitizeInput(data.category),
    description: sanitizeInput(data.description || ''),
    imageUrl: data.imageUrl || '',
    link: data.link || ''
  };
}
