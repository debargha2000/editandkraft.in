# Firebase Production Setup Guide

## Overview
This guide covers the production-ready Firebase configuration for editandkraft.in with comprehensive security settings.

## Prerequisites
- Firebase project created on Google Cloud Console
- Firebase CLI installed: `npm install -g firebase-tools`
- Authenticated with `firebase login`

## 1. Firestore Configuration

### Enable Firestore
1. Go to Firebase Console > Firestore Database
2. Create database in production mode
3. Start with the security rules in `firebase.rules`

### Collections Structure
```
/projects
  ├── [projectId] (auto-generated ID)
  │   ├── title (string)
  │   ├── category (string)
  │   ├── description (string)
  │   ├── imageUrl (string)
  │   ├── link (string)
  │   ├── timestamp (timestamp)
  │   └── /history (subcollection)
  │       └── [historyId]
  │           ├── action (create/update/delete)
  │           ├── changedBy (string - email)
  │           ├── timestamp (timestamp)
  │           └── changes (map)

/admins
  ├── [userId]
  │   ├── email (string)
  │   ├── role (string - "admin")
  │   ├── createdAt (timestamp)
  │   └── permissions (array)

/auditLogs
  ├── [logId]
  │   ├── action (string)
  │   ├── userId (string)
  │   ├── email (string)
  │   ├── resource (string)
  │   ├── timestamp (timestamp)
  │   └── details (map)
```

## 2. Storage Configuration

### Enable Cloud Storage
1. Go to Firebase Console > Storage
2. Create a default bucket
3. Apply the security rules from `firebase.rules`

### Storage Structure
```
/projects       → Portfolio images (public read)
/temp           → Temporary uploads (admin only)
```

### File Limits
- Images: 5MB max
- Allowed types: JPEG, PNG, WebP
- Naming: Must be alphanumeric with underscores/hyphens

## 3. Authentication Setup

### Enable Authentication Methods
1. Firebase Console > Authentication > Sign-in methods
2. Enable:
   - **Email/Password** (default)
   - **Google** (recommended for convenience)

### Configure User Security
1. Set password requirements (minimum 12 characters recommended)
2. Enable email verification
3. Configure password reset flow

### Admin User Management
```javascript
// Admin emails (hardcoded in security rules)
- debarghapakhira@gmail.com
- deys87714@gmail.com
```

To add new admins:
1. Add email to `firebase.rules` isAdmin() function
2. Create Firestore document in `/admins/{uid}`
3. Redeploy security rules

## 4. Deploy Security Rules

```bash
# Validate rules
firebase rules:test rules.firestore

# Deploy rules to production
firebase deploy --only firestore:rules,storage

# Deploy with confirmation
firebase deploy --only firestore:rules,storage --force
```

## 5. Environment Variables Setup

### Local Development
Create `.env` file in project root:
```
VITE_FIREBASE_API_KEY=[your-api-key]
VITE_FIREBASE_AUTH_DOMAIN=[your-auth-domain]
VITE_FIREBASE_PROJECT_ID=[your-project-id]
VITE_FIREBASE_STORAGE_BUCKET=[your-bucket]
VITE_FIREBASE_MESSAGING_SENDER_ID=[your-sender-id]
VITE_FIREBASE_APP_ID=[your-app-id]
VITE_FIREBASE_MEASUREMENT_ID=[your-measurement-id]
```

### Production (Vercel)
Set environment variables in Vercel dashboard:
1. Project Settings → Environment Variables
2. Add all VITE_FIREBASE_* variables
3. Apply to Production environment

## 6. Security Best Practices

### Data Validation
✅ All project data is validated before creation/update
✅ File size limits enforced (5MB for images)
✅ File type restrictions (JPEG, PNG, WebP only)
✅ Field length restrictions enforced

### Access Control
✅ Public read access for portfolio (for SEO)
✅ Admin-only write access
✅ Email-based admin authentication
✅ Timestamp validation on updates

### Audit Trail
✅ Project history tracked in subcollections
✅ All admin actions logged in auditLogs
✅ Timestamps immutable after creation

## 7. Monitoring & Analytics

### Enable Monitoring
1. Firebase Console > Analytics
2. Set up Google Analytics
3. Monitor:
   - Database reads/writes
   - Storage operations
   - Authentication events

### Set up Alerts
1. Google Cloud Console > Monitoring
2. Create alerts for:
   - High database costs
   - Authentication errors
   - Storage usage spikes

## 8. Backup Strategy

### Automatic Backups
1. Google Cloud Console > Backups
2. Schedule daily backups
3. Retention: 30 days

### Manual Exports
```bash
# Export Firestore data
gcloud firestore export gs://[bucket-name]/backups/firestore-export

# Export Storage
gsutil -m cp -r gs://[storage-bucket] gs://[backup-bucket]
```

## 9. Database Optimization

### Indexes
Firestore automatically creates indexes for:
- Collection queries
- Basic filters
- Ordering queries

Create custom indexes for complex queries in Firebase Console

### Query Optimization
```javascript
// ✅ Good - Single field query
const projects = await getDocs(query(collection(db, 'projects'), 
  where('category', '==', 'Motion Graphics')));

// ⚠️ Avoid - N+1 queries
projects.forEach(async (project) => {
  const history = await getDocs(...); // Don't do this in a loop!
});

// ✅ Better - Batch operations
const batch = writeBatch(db);
projects.forEach(project => {
  batch.update(doc(db, 'projects', project.id), { /* updates */ });
});
await batch.commit();
```

## 10. Testing Security Rules

### Local Testing
```bash
# Run Firestore rules simulator
firebase emulators:start

# Test in development
npm run dev  # Uses emulated Firebase locally
```

### Test Rules
```javascript
// Example test
const firebase = require("@firebase/testing");

describe("Security Rules", () => {
  it("should allow public read of projects", async () => {
    const db = firebase.initializeTestApp({ projectId: "test" }).firestore();
    const projects = await db.collection('projects').get();
    // Should succeed
  });

  it("should deny write without admin credentials", async () => {
    const db = firebase.initializeTestApp({ 
      projectId: "test",
      auth: { uid: "user123" }
    }).firestore();
    expect(() => {
      db.collection('projects').add({ /* data */ });
    }).rejects.toThrow();
  });
});
```

## 11. Cost Optimization

### Firestore Pricing
- Read: $0.06 / 100k reads
- Write: $0.18 / 100k writes
- Delete: $0.02 / 100k deletes

### Reduce Costs
1. Index only necessary fields
2. Batch operations together
3. Avoid unnecessary reads
4. Archive old data

### Monitor Usage
```bash
firebase billing --project=[project-id]
```

## 12. Disaster Recovery

### Restore from Backup
1. Google Cloud Console > Backups
2. Select backup to restore
3. Click "Restore"
4. Verify data integrity

### Rollback Strategy
1. Keep Git history of rules changes
2. Test rules in development first
3. Use Firebase Console version history
4. Maintain backups of security rules

## 13. Deployment Checklist

- [ ] Firestore rules deployed and tested
- [ ] Storage rules deployed and tested
- [ ] Environment variables set in production
- [ ] Admins configured in security rules
- [ ] Backups scheduled and tested
- [ ] Monitoring alerts configured
- [ ] SSL/TLS enabled for all connections
- [ ] Rate limiting considered
- [ ] CORS configured for storage
- [ ] Deletion policies defined
- [ ] Retention policies set
- [ ] Audit logs enabled

## 14. Support & Documentation

For more information:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules Guide](https://firebase.google.com/docs/firestore/security/start)
- [Storage Security Guide](https://firebase.google.com/docs/storage/security/start)
