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
 * Throttle function for repeated operations
 */
/**
 * Security context for sensitive operations
 */
/**
 * CSRF Token management
 */

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
