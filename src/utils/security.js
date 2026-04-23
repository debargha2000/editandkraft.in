/**
 * Rate Limiting Utilities
 * Prevents abuse and ensures fair usage
 */
export class RateLimiter {
  constructor(maxRequests = 10, windowMS = 60000) {
    this.maxRequests = maxRequests;
    this.windowMS = windowMS;
    this.requests = [];
  }
  /**
   * Check if request is allowed
   */
  isAllowed() {
    const now = Date.now();
    
    // Remove old requests outside the window
    this.requests = this.requests.filter(time => now - time < this.windowMS);
    
    // Check if we're under the limit
    if (this.requests.length < this.maxRequests) {
      this.requests.push(now);
      return true;
    }
    
    return false;
  }
  /**
   * Get remaining requests
   */
  getRemaining() {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.windowMS);
    return Math.max(0, this.maxRequests - this.requests.length);
  }
  /**
   * Get reset time in seconds
   */
  getResetTime() {
    if (this.requests.length === 0) return 0;
    const oldestRequest = Math.min(...this.requests);
    const resetTime = oldestRequest + this.windowMS;
    const timeUntilReset = Math.max(0, resetTime - Date.now());
    return Math.ceil(timeUntilReset / 1000);
  }
  /**
   * Reset the limiter
   */
  reset() {
    this.requests = [];
  }
}
/**
 * Create rate limiters for different operations
 */
export const rateLimiters = {
  // 5 login attempts per minute
  login: new RateLimiter(5, 60000),
  
  // 20 project reads per minute
  projectRead: new RateLimiter(20, 60000),
  
  // 10 project writes per minute
  projectWrite: new RateLimiter(10, 60000),
  
  // 5 file uploads per minute
  fileUpload: new RateLimiter(5, 60000),
  
  // 100 API calls per minute
  api: new RateLimiter(100, 60000)
};
/**
 * Check if operation is rate limited
 */
export function checkRateLimit(operationType) {
  const limiter = rateLimiters[operationType];
  
  if (!limiter) {
    console.warn(`Unknown rate limit type: ${operationType}`);
    return { allowed: true };
  }
  if (!limiter.isAllowed()) {
    return {
      allowed: false,
      resetIn: limiter.getResetTime(),
      message: `Too many ${operationType} attempts. Please wait ${limiter.getResetTime()} seconds.`
    };
  }
  return {
    allowed: true,
    remaining: limiter.getRemaining()
  };
}
/**
 * Debounce function for UI operations
 */
export function debounce(fn, delay = 300) {
  let timeoutId;
  
  return function debounced(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}
/**
 * Throttle function for repeated operations
 */
export function throttle(fn, limit = 1000) {
  let inThrottle;
  
  return function throttled(...args) {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
/**
 * Security context for sensitive operations
 */
export class SecurityContext {
  constructor(userId, email, role = 'viewer') {
    this.userId = userId;
    this.email = email;
    this.role = role;
    this.sessionToken = this.generateSessionToken();
    this.sessionStarted = Date.now();
    this.lastActivity = Date.now();
  }
  /**
   * Generate session token
   */
  generateSessionToken() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  /**
   * Check if session is valid
   */
  isSessionValid(maxInactivityMS = 30 * 60 * 1000) {
    const inactivity = Date.now() - this.lastActivity;
    return inactivity < maxInactivityMS;
  }
  /**
   * Update last activity
   */
  updateActivity() {
    this.lastActivity = Date.now();
  }
  /**
   * Check permission
   */
  hasPermission(permission) {
    const permissions = {
      viewer: ['read:projects'],
      editor: ['read:projects', 'create:projects', 'update:projects'],
      admin: ['read:projects', 'create:projects', 'update:projects', 'delete:projects', 'manage:users']
    };
    return permissions[this.role]?.includes(permission) || false;
  }
  /**
   * Check if user is admin
   */
  isAdmin() {
    return this.role === 'admin';
  }
}
/**
 * CSRF Token management
 */
export class CSRFTokenManager {
  static generateToken() {
    const token = crypto.getRandomValues(new Uint8Array(32));
    return Array.from(token, byte => byte.toString(16).padStart(2, '0')).join('');
  }
  static storeToken(token) {
    sessionStorage.setItem('csrf_token', token);
  }
  static getToken() {
    return sessionStorage.getItem('csrf_token');
  }
  static validateToken(token) {
    const stored = this.getToken();
    return stored && stored === token;
  }
  static clearToken() {
    sessionStorage.removeItem('csrf_token');
  }
}
/**
 * Security headers for API requests
 */
export function getSecurityHeaders(userId) {
  return {
    'X-Requested-With': 'XMLHttpRequest',
    'X-User-ID': userId,
    'X-CSRF-Token': CSRFTokenManager.getToken(),
    'Content-Type': 'application/json'
  };
}
/**
 * Validate request origin
 */
export function isValidOrigin(origin) {
  const allowedOrigins = [
    'https://editandkraft.in',
    'https://www.editandkraft.in',
    'http://localhost:5173', // Vite dev server
    'http://localhost:3000'  // Alternative port
  ];
  if (import.meta.env.DEV) {
    // Allow localhost in development
    return origin?.includes('localhost');
  }
  return allowedOrigins.includes(origin);
}
