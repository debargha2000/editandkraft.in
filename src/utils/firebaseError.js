/**
 * Firebase Error Handler
 * Provides consistent error handling and logging across the application
 */
export class FirebaseErrorHandler {
  static getErrorMessage(error) {
    if (!error) return 'An unexpected error occurred';
    // Firebase Auth Errors
    if (error.code) {
      switch (error.code) {
        case 'auth/user-not-found':
          return 'User account not found. Please check your email.';
        case 'auth/wrong-password':
          return 'Incorrect password. Please try again.';
        case 'auth/email-already-in-use':
          return 'This email is already registered.';
        case 'auth/weak-password':
          return 'Password must be at least 12 characters long.';
        case 'auth/invalid-email':
          return 'Invalid email address.';
        case 'auth/user-disabled':
          return 'This account has been disabled.';
        case 'auth/too-many-requests':
          return 'Too many login attempts. Please try again later.';
        case 'auth/popup-closed-by-user':
          return 'Login popup was closed. Please try again.';
        case 'auth/network-request-failed':
          return 'Network error. Please check your connection.';
        // Firestore Errors
        case 'permission-denied':
          return 'You do not have permission to perform this action.';
        case 'not-found':
          return 'The requested resource was not found.';
        case 'already-exists':
          return 'This resource already exists.';
        case 'unauthenticated':
          return 'You must be logged in to perform this action.';
        case 'resource-exhausted':
          return 'Service limit exceeded. Please try again later.';
        case 'failed-precondition':
          return 'The operation conditions are not met. Please try again.';
        case 'aborted':
          return 'The operation was aborted. Please try again.';
        case 'deadline-exceeded':
          return 'The operation took too long. Please try again.';
        // Storage Errors
        case 'storage/object-not-found':
          return 'The file was not found.';
        case 'storage/bucket-not-found':
          return 'Storage service is unavailable.';
        case 'storage/project-not-found':
          return 'Storage project is not configured correctly.';
        case 'storage/quota-exceeded':
          return 'Storage quota exceeded.';
        case 'storage/unauthenticated':
          return 'You must be authenticated to upload files.';
        case 'storage/unauthorized':
          return 'You do not have permission to upload files.';
        case 'storage/retry-limit-exceeded':
          return 'Upload failed after multiple retries.';
        case 'storage/invalid-argument':
          return 'Invalid file or operation.';
        case 'storage/server-file-wrong-size':
          return 'File size mismatch. Please try uploading again.';
        // Generic error
        default:
          return error.message || 'An unexpected error occurred';
      }
    }
    // Standard JavaScript errors
    if (error instanceof TypeError) return 'Invalid operation or data type.';
    if (error instanceof RangeError) return 'Value is out of valid range.';
    if (error instanceof SyntaxError) return 'Invalid data format.';
    return error.message || 'An unexpected error occurred';
  }
  static logError(error, context = '') {
    console.error(`[Firebase Error ${context}]:`, {
      code: error.code,
      message: error.message,
      details: error.details,
      timestamp: new Date().toISOString(),
    });
    // In production, you could send this to error tracking service
    // Example: Sentry, LogRocket, etc.
    if (import.meta.env.PROD) {
      this.reportToAnalytics(error, context);
    }
  }
  // eslint-disable-next-line no-unused-vars
  static reportToAnalytics(error, context) {
    // Placeholder for analytics reporting
    // Add your error tracking service here
  }
  static isRetryable(error) {
    const retryableCodes = [
      'network-request-failed',
      'deadline-exceeded',
      'unavailable',
      'internal',
      'resource-exhausted',
    ];
    return retryableCodes.includes(error.code);
  }
  static getHTTPStatusCode(error) {
    const codeMap = {
      'permission-denied': 403,
      'unauthenticated': 401,
      'not-found': 404,
      'invalid-argument': 400,
      'already-exists': 409,
      'internal': 500,
      'unavailable': 503,
    };
    return codeMap[error.code] || 500;
  }
}
/**
 * Retry utility with exponential backoff
 */
export async function retryWithExponentialBackoff(fn, maxRetries = 3) {
  let lastError;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (!FirebaseErrorHandler.isRetryable(error)) {
        throw error;
      }
      if (attempt < maxRetries - 1) {
        // Exponential backoff: 1s, 2s, 4s
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  throw lastError;
}
