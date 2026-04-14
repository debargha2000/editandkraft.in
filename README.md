# editandkraft.in - Production Deployment Guide

A modern, SEO-optimized portfolio website for editandkraft.in built with React, Vite, Firebase, and deployed on Vercel.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Firebase project (Google Cloud Console)
- Vercel account

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📋 Production Deployment Checklist

### ✅ Automated Steps (Completed)
- [x] Project builds successfully (`npm run build`)
- [x] SEO optimization (robots.txt, sitemap.xml)
- [x] PWA setup (service worker, manifest)
- [x] Image optimization
- [x] Bundle analysis and optimization
- [x] Security overrides in package.json
- [x] Code linting passes
- [x] Development server runs
- [x] README documentation updated

### 🔧 Manual Steps Required

#### 1. Firebase Setup
**Create Firebase Project:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create new project: `editandkraft-production`
3. Enable services:
   - Firestore Database (production mode)
   - Cloud Storage
   - Authentication (Email/Password + Google)
   - Analytics

**Deploy Security Rules:**
```bash
# Install Firebase CLI (if not installed)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize project (select existing project)
firebase use --add
# Choose: analog-antler-413017 (or your production project)

# Deploy rules
firebase deploy --only firestore:rules,storage
```

**Verify Rules:**
```bash
firebase rules:test firebase.rules
```

#### 2. Environment Variables (Vercel)
Set these in Vercel Dashboard > Project Settings > Environment Variables:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

**Note:** Use production Firebase keys, not development ones.

#### 3. Admin User Setup
Add admin emails to `firebase.rules` isAdmin() function:
- debarghapakhira@gmail.com
- deys87714@gmail.com

Create admin documents in Firestore `/admins/{uid}`:
```json
{
  "email": "admin@example.com",
  "role": "admin",
  "createdAt": "2026-04-11T00:00:00Z",
  "permissions": ["read", "write", "delete"]
}
```

#### 4. Deploy to Vercel
1. Connect GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variables (see step 2)
5. Deploy

#### 5. Post-Deployment Verification
- [ ] Website loads without errors
- [ ] Firebase connection works
- [ ] Admin login functions
- [ ] Portfolio displays projects
- [ ] Contact form submits
- [ ] Analytics tracking active

## 🔒 Security Features

- Firebase security rules for data protection
- Environment-based configuration
- Input validation and sanitization
- Rate limiting on sensitive operations
- HTTPS enforcement
- CSRF protection

## 📊 Performance

- Code splitting and lazy loading
- Image optimization (WebP format)
- Bundle size: ~910KB gzipped
- PWA with offline support
- SEO optimized with structured data

## 🛠️ Development Scripts

```bash
# Development
npm run dev              # Start dev server
npm run preview          # Preview production build

# Quality Assurance
npm run lint             # ESLint check
npm run security:check   # Security audit
npm audit                # Dependency vulnerabilities
npm outdated             # Outdated packages

# Build
npm run build            # Production build
```

## 🧪 Testing

### Unit Tests
```bash
# Run all unit tests
npm test

# Run tests once (CI mode)
npm run test:run

# Run tests with coverage
npm run test:coverage

# Run tests in UI mode
npm run test:ui
```

### End-to-End Tests
```bash
# Install Playwright browsers (first time only)
npm run e2e:install

# Run E2E tests
npm run e2e

# Run E2E tests in headed mode (visible browser)
npm run e2e:headed
```

### Test Coverage
Current coverage: **71.64%** overall
- Components: 100%
- Utilities: 68.85%
- Validation: 86.15%
- Error Handling: 49.12%

### Test Structure
```
src/
├── utils/
│   ├── validation.test.js      # Input validation tests
│   └── firebaseError.test.js   # Error handling tests
├── components/ui/
│   └── MagneticButton.test.jsx # Component tests
└── test/
    └── setup.js                # Test configuration

e2e/
├── basic-navigation.spec.js    # Navigation tests
└── accessibility.spec.js       # A11y tests
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Route components
├── services/           # Firebase services
├── stores/             # State management
├── utils/              # Utilities (validation, security, etc.)
├── data/               # Static content
└── styles/             # Global styles
```

## 🔧 Configuration Files

- `firebase.rules` - Firestore/Storage security rules
- `vercel.json` - Vercel deployment config
- `vite.config.js` - Vite build configuration
- `.env` - Environment variables (gitignored)

## 📚 Documentation

See documentation files in root:
- `DEPLOYMENT_CHECKLIST.md` - Detailed deployment steps
- `FIREBASE_PRODUCTION.md` - Firebase setup guide
- `SECURITY.md` - Security policy
- `FIREBASE_BACKEND.md` - Backend architecture

## 🚨 Troubleshooting

**Build fails:**
- Ensure Node.js 18+
- Clear node_modules: `rm -rf node_modules && npm install`

**Firebase connection issues:**
- Check environment variables
- Verify Firebase project is active
- Check browser console for errors

**Deployment issues:**
- Verify Vercel environment variables
- Check build logs in Vercel dashboard
- Ensure Firebase rules are deployed

## 📞 Support

For issues:
1. Check documentation files
2. Review Firebase console logs
3. Check Vercel deployment logs
4. Verify environment configuration
