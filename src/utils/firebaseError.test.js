import { describe, it, expect, vi } from 'vitest';
import { FirebaseErrorHandler, retryWithExponentialBackoff } from './firebaseError.js';

describe('FirebaseErrorHandler', () => {
  describe('getErrorMessage', () => {
    it('should return default message for null error', () => {
      const result = FirebaseErrorHandler.getErrorMessage(null);
      expect(result).toBe('An unexpected error occurred');
    });

    it('should handle auth errors', () => {
      const error = { code: 'auth/user-not-found' };
      const result = FirebaseErrorHandler.getErrorMessage(error);
      expect(result).toBe('User account not found. Please check your email.');
    });

    it('should handle multiple auth error cases', () => {
      expect(FirebaseErrorHandler.getErrorMessage({ code: 'auth/wrong-password' })).toBe('Incorrect password. Please try again.');
      expect(FirebaseErrorHandler.getErrorMessage({ code: 'auth/email-already-in-use' })).toBe('This email is already registered.');
      expect(FirebaseErrorHandler.getErrorMessage({ code: 'auth/weak-password' })).toBe('Password must be at least 12 characters long.');
      expect(FirebaseErrorHandler.getErrorMessage({ code: 'auth/invalid-email' })).toBe('Invalid email address.');
      expect(FirebaseErrorHandler.getErrorMessage({ code: 'auth/user-disabled' })).toBe('This account has been disabled.');
      expect(FirebaseErrorHandler.getErrorMessage({ code: 'auth/too-many-requests' })).toBe('Too many login attempts. Please try again later.');
      expect(FirebaseErrorHandler.getErrorMessage({ code: 'auth/popup-closed-by-user' })).toBe('Login popup was closed. Please try again.');
      expect(FirebaseErrorHandler.getErrorMessage({ code: 'auth/network-request-failed' })).toBe('Network error. Please check your connection.');
    });

    it('should handle firestore errors', () => {
      const error = { code: 'permission-denied' };
      const result = FirebaseErrorHandler.getErrorMessage(error);
      expect(result).toBe('You do not have permission to perform this action.');
    });

    it('should handle additional firestore errors', () => {
      expect(FirebaseErrorHandler.getErrorMessage({ code: 'already-exists' })).toBe('This resource already exists.');
      expect(FirebaseErrorHandler.getErrorMessage({ code: 'unauthenticated' })).toBe('You must be logged in to perform this action.');
      expect(FirebaseErrorHandler.getErrorMessage({ code: 'resource-exhausted' })).toBe('Service limit exceeded. Please try again later.');
      expect(FirebaseErrorHandler.getErrorMessage({ code: 'failed-precondition' })).toBe('The operation conditions are not met. Please try again.');
      expect(FirebaseErrorHandler.getErrorMessage({ code: 'aborted' })).toBe('The operation was aborted. Please try again.');
      expect(FirebaseErrorHandler.getErrorMessage({ code: 'deadline-exceeded' })).toBe('The operation took too long. Please try again.');
      expect(FirebaseErrorHandler.getErrorMessage({ code: 'not-found' })).toBe('The requested resource was not found.');
    });

    it('should handle storage errors', () => {
      const error = { code: 'storage/quota-exceeded' };
      const result = FirebaseErrorHandler.getErrorMessage(error);
      expect(result).toBe('Storage quota exceeded.');
    });

    it('should handle additional storage error cases', () => {
      expect(FirebaseErrorHandler.getErrorMessage({ code: 'storage/object-not-found' })).toBe('The file was not found.');
      expect(FirebaseErrorHandler.getErrorMessage({ code: 'storage/bucket-not-found' })).toBe('Storage service is unavailable.');
      expect(FirebaseErrorHandler.getErrorMessage({ code: 'storage/project-not-found' })).toBe('Storage project is not configured correctly.');
      expect(FirebaseErrorHandler.getErrorMessage({ code: 'storage/retry-limit-exceeded' })).toBe('Upload failed after multiple retries.');
      expect(FirebaseErrorHandler.getErrorMessage({ code: 'storage/server-file-wrong-size' })).toBe('File size mismatch. Please try uploading again.');
    });

    it('should return the error message for generic Error objects', () => {
      const error = new Error('Generic error');
      expect(FirebaseErrorHandler.getErrorMessage(error)).toBe('Generic error');
    });

    it('should return fallback message when error has no code or message', () => {
      expect(FirebaseErrorHandler.getErrorMessage({})).toBe('An unexpected error occurred');
    });

    it('should handle additional storage errors', () => {
      expect(FirebaseErrorHandler.getErrorMessage({ code: 'storage/object-not-found' })).toBe('The file was not found.');
      expect(FirebaseErrorHandler.getErrorMessage({ code: 'storage/unauthorized' })).toBe('You do not have permission to upload files.');
      expect(FirebaseErrorHandler.getErrorMessage({ code: 'storage/invalid-argument' })).toBe('Invalid file or operation.');
    });

    it('should handle JavaScript errors', () => {
      const typeError = new TypeError('test');
      const result = FirebaseErrorHandler.getErrorMessage(typeError);
      expect(result).toBe('Invalid operation or data type.');
    });

    it('should handle range and syntax errors', () => {
      expect(FirebaseErrorHandler.getErrorMessage(new RangeError('range'))).toBe('Value is out of valid range.');
      expect(FirebaseErrorHandler.getErrorMessage(new SyntaxError('syntax'))).toBe('Invalid data format.');
    });

    it('should return custom message for unknown errors', () => {
      const error = { code: 'unknown-error', message: 'Custom error message' };
      const result = FirebaseErrorHandler.getErrorMessage(error);
      expect(result).toBe('Custom error message');
    });
  });

  describe('logError', () => {
    it('should log error to console', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const error = { code: 'test-error', message: 'Test message' };

      FirebaseErrorHandler.logError(error, 'test context');

      expect(consoleSpy).toHaveBeenCalledWith('[Firebase Error test context]:', expect.objectContaining({
        code: 'test-error',
        message: 'Test message'
      }));

      consoleSpy.mockRestore();
    });
  });

  describe('isRetryable', () => {
    it('should identify retryable errors', () => {
      const retryableError = { code: 'network-request-failed' };
      const nonRetryableError = { code: 'permission-denied' };

      expect(FirebaseErrorHandler.isRetryable(retryableError)).toBe(true);
      expect(FirebaseErrorHandler.isRetryable(nonRetryableError)).toBe(false);
    });
  });

  describe('getHTTPStatusCode', () => {
    it('should return correct HTTP status codes', () => {
      expect(FirebaseErrorHandler.getHTTPStatusCode({ code: 'permission-denied' })).toBe(403);
      expect(FirebaseErrorHandler.getHTTPStatusCode({ code: 'not-found' })).toBe(404);
      expect(FirebaseErrorHandler.getHTTPStatusCode({ code: 'invalid-argument' })).toBe(400);
      expect(FirebaseErrorHandler.getHTTPStatusCode({ code: 'internal' })).toBe(500);
      expect(FirebaseErrorHandler.getHTTPStatusCode({ code: 'unavailable' })).toBe(503);
      expect(FirebaseErrorHandler.getHTTPStatusCode({ code: 'unknown' })).toBe(500);
    });
  });
});

describe('retryWithExponentialBackoff', () => {
  it('should succeed on first attempt', async () => {
    const mockFn = vi.fn().mockResolvedValue('success');
    const result = await retryWithExponentialBackoff(mockFn, 3);
    expect(result).toBe('success');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should retry on retryable errors', async () => {
    const mockFn = vi.fn()
      .mockRejectedValueOnce({ code: 'network-request-failed' })
      .mockResolvedValueOnce('success');

    const result = await retryWithExponentialBackoff(mockFn, 3);
    expect(result).toBe('success');
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it('should not retry on non-retryable errors', async () => {
    const mockFn = vi.fn().mockRejectedValue({ code: 'permission-denied' });

    await expect(retryWithExponentialBackoff(mockFn, 3)).rejects.toEqual({ code: 'permission-denied' });
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should exhaust retries and throw last error', async () => {
    const mockFn = vi.fn().mockRejectedValue({ code: 'network-request-failed' });

    await expect(retryWithExponentialBackoff(mockFn, 2)).rejects.toEqual({ code: 'network-request-failed' });
    expect(mockFn).toHaveBeenCalledTimes(2);
  });
});