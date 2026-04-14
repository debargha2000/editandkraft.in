# Production Deployment Checklist

## Pre-Deployment Phase

### Security Configuration
- [ ] Firebase Security Rules deployed and tested
  ```bash
  firebase deploy --only firestore:rules,storage
  ```
- [ ] Environment variables configured in Vercel
- [ ] All Firebase API keys are production keys
- [ ] CORS configuration set up correctly
- [ ] Firebase API restrictions enabled (Console → Settings → Restrictions)
- [ ] Authentication methods configured (Email/Password, Google)
- [ ] Email verification enabled
- [ ] Password reset configured

### Code Quality & Security
- [ ] All security utilities imported and used
  - [ ] `firebaseError.js` for error handling
  - [ ] `validation.js` for data validation
  - [ ] `security.js` for rate limiting
- [ ] HTTPS enforced everywhere
- [ ] Input sanitization implemented
- [ ] CSRF protection enabled
- [ ] Rate limiting configured
- [ ] No debug logs in production code
- [ ] No sensitive data in logs
- [ ] Error messages sanitized (no internal details exposed)

### Firebase Configuration
- [ ] Firestore collection structure verified
- [ ] Storage folders created (projects/, temp/)
- [ ] File size limits enforced (5MB for images)
- [ ] File type restrictions set (JPEG, PNG, WebP)
- [ ] Index optimization completed
- [ ] Composite indexes created if needed
- [ ] TTL policies configured for temporary files
- [ ] Backup schedule set (daily)
- [ ] Audit logging enabled
- [ ] Monitoring alerts configured

### Dependencies & Vulnerabilities
- [ ] `npm audit` run with no high severity issues
  ```bash
  npm run security:check
  ```
- [ ] All dependencies updated to latest secure versions
- [ ] Package-lock.json committed
- [ ] Dependabot configuration enabled
- [ ] No development dependencies in production build

### Testing
- [ ] Unit tests pass
  ```bash
  npm run test
  ```
- [ ] Security rules tested
  ```bash
  firebase rules:test firebase.rules
  ```
- [ ] Authentication flow tested end-to-end
- [ ] Admin operations verified with test accounts
- [ ] File upload tested with size and type limits
- [ ] Error handling tested for all error scenarios
- [ ] Rate limiting tested
- [ ] CORS tested for cross-origin requests

### Performance
- [ ] Bundle size optimized
  ```bash
  npm run build
  ```
- [ ] Images optimized (WebP format preferred)
- [ ] Code splitting verified
- [ ] Lazy loading implemented
- [ ] Database queries optimized (no N+1 queries)
- [ ] Firestore indexes created for common queries
- [ ] Cache headers configured
- [ ] CDN enabled for static assets

### Monitoring & Analytics
- [ ] Google Analytics configured
  ```
  Property ID: G-NTH0BH0SXR
  ```
- [ ] Error tracking enabled (e.g., Sentry)
- [ ] Performance monitoring set up
- [ ] Uptime monitoring configured
- [ ] Alert notifications set up
- [ ] Dashboard created for key metrics

## Deployment Phase

### Before Pushing to Production
- [ ] Vercel environment variables set
  - [ ] VITE_FIREBASE_API_KEY
  - [ ] VITE_FIREBASE_AUTH_DOMAIN
  - [ ] VITE_FIREBASE_PROJECT_ID
  - [ ] VITE_FIREBASE_STORAGE_BUCKET
  - [ ] VITE_FIREBASE_MESSAGING_SENDER_ID
  - [ ] VITE_FIREBASE_APP_ID
  - [ ] VITE_FIREBASE_MEASUREMENT_ID
- [ ] Vercel build settings verified
  - [ ] Build command: `npm run build`
  - [ ] Output directory: `dist`
  - [ ] Node version: 18.x or higher
- [ ] Git repository clean
  - [ ] No uncommitted changes
  - [ ] Main branch is up to date
  - [ ] All tests passing on CI/CD
- [ ] Backup of current production created

### Deployment Steps
1. **Deploy Firebase Rules**
   ```bash
   firebase deploy --only firestore:rules,storage --project=[project-id]
   ```

2. **Verify Rules Are Live**
   - Check Firebase Console for deployment status
   - Test write/read permissions immediately

3. **Review Changes**
   - Ensure all changes are intentional
   - Check git diff before final deployment

4. **Deploy to Vercel**
   - Push to main branch (if using automatic deploys)
   - Or manually deploy: `vercel --prod`

5. **Verify Deployment**
   - Homepage loads ✅
   - Projects display ✅
   - Admin login works ✅
   - Create/update/delete projects works ✅
   - File uploads work ✅

## Post-Deployment Phase

### Immediate Verification (First 1 Hour)
- [ ] Website loads without errors
- [ ] No console errors in browser DevTools
- [ ] Authentication flow works
- [ ] Admin operations functional
- [ ] Images load correctly
- [ ] No 5xx errors in browser
- [ ] Performance metrics acceptable

### Functional Testing (First 24 Hours)
- [ ] User registration/login works
- [ ] Project creation works
- [ ] Project update works
- [ ] Project deletion works
- [ ] Image uploads work
- [ ] Image display works
- [ ] Email verification works (if enabled)
- [ ] Password reset works

### Security Verification (First 24 Hours)
- [ ] Security headers present
  - [ ] X-Content-Type-Options: nosniff
  - [ ] X-Frame-Options: SAMEORIGIN
  - [ ] Content-Security-Policy set
- [ ] HTTPS enforced
- [ ] Sensitive data not in URLs
- [ ] API keys not exposed
- [ ] Rate limiting working
- [ ] CORS properly configured
- [ ] SQL injection not possible (N/A for Firebase)
- [ ] XSS protection enabled

### Performance Monitoring (First Week)
- [ ] Page load time < 3 seconds
- [ ] Core Web Vitals acceptable
  - [ ] LCP < 2.5s
  - [ ] FID < 100ms
  - [ ] CLS < 0.1
- [ ] Firebase read/write performance optimal
- [ ] Storage retrieval performance acceptable
- [ ] Error rate < 0.1%

### Monitoring Setup (Ongoing)
- [ ] Firebase metrics dashboard monitored
  - [ ] Database operations trending correctly
  - [ ] Storage usage within expectations
  - [ ] Authentication success rates > 95%
- [ ] Error tracking reviewed daily
- [ ] Performance metrics reviewed daily
- [ ] User feedback monitored

## Rollback Plan

### If Issues Detected
1. **Immediate Actions**
   - Stop traffic (if needed)
   - Notify team
   - Begin troubleshooting

2. **Firestore Rules Rollback**
   ```bash
   firebase deploy --only firestore:rules,storage --project=[project-id]
   # Revert to previous version from git
   git revert [commit-hash]
   ```

3. **Application Rollback**
   ```bash
   vercel rollback
   ```

4. **Data Integrity Check**
   - Verify no data corruption
   - Check audit logs
   - Compare with backup

5. **Communication**
   - Notify users of any issues
   - Provide status updates
   - Document incident

## Post-Deployment Maintenance

### Daily (First Week)
- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Review user feedback
- [ ] Verify backups completed

### Weekly
- [ ] Review security audit logs
- [ ] Check for any security vulnerabilities
- [ ] Analyze user behavior metrics
- [ ] Update documentation based on learnings

### Monthly
- [ ] Review database performance
- [ ] Optimize slow queries
- [ ] Update security policies
- [ ] Review access logs
- [ ] Check storage usage trends
- [ ] Verify backup integrity

### Quarterly
- [ ] Conduct security audit
- [ ] Review and update Firebase rules
- [ ] Evaluate new Firebase features
- [ ] Update dependencies
- [ ] Review disaster recovery plan
- [ ] Train team on updates

## Emergency Contacts

- **Firebase Support**: https://firebase.google.com/support
- **Vercel Support**: https://vercel.com/support
- **Security Issues**: [Add contact info]
- **Team Communication**: [Add channel/email]

## Documentation Links

- [Firebase Production Setup](./FIREBASE_PRODUCTION.md)
- [Security Policy](./SECURITY.md)
- [Error Handling](./src/utils/firebaseError.js)
- [Validation Rules](./src/utils/validation.js)
- [Security Best Practices](./src/utils/security.js)
