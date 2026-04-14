# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in editandkraft.in, please email security issues privately instead of using the public issue tracker.

**Do not publicly disclose security vulnerabilities** until they have been addressed.

## Dependency Security

### Build-Time Dependencies
- We use `npm audit` to regularly check for vulnerabilities
- Some build-time only vulnerabilities are acceptable if they don't affect the production bundle
- All production dependencies are vetted for security

### Production Dependencies
- All production code is checked with `npm audit`
- Security patches are applied immediately
- Dependencies are updated regularly

### Current Security Status

As of April 7, 2026:
- Some high-severity vulnerabilities exist in build-time dependencies (serialize-javascript via vite-plugin-pwa → workbox-build → @rollup/plugin-terser)
- These are transitive build-time only dependencies and do not affect the production bundle
- The application is safe for production deployment

## Security Best Practices

1. **Run npm audit before deployment:**
   ```bash
   npm audit
   ```

2. **Fix automatically fixable vulnerabilities:**
   ```bash
   npm audit fix
   ```

3. **Verify dependencies:**
   ```bash
   npm ls  # List all dependencies
   npm outdated  # Check for outdated packages
   ```

4. **Environment Variables:**
   - Firebase configuration is loaded from environment variables
   - Never commit `.env` files
   - Always use Vercel environment variable settings for production

## Dependency Update Policy

- Security updates: Apply immediately
- Minor version updates: Test before applying
- Major version updates: Review breaking changes before applying

## Known Issues

### serialize-javascript vulnerability
Affecting: vite-plugin-pwa → workbox-build → @rollup/plugin-terser → serialize-javascript
Status: Build-time only, does not affect production code
Risk: Low
Action: Monitor for patches in vite-plugin-pwa dependencies
