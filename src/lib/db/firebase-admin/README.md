# Firebase Admin SDK Configuration

This directory contains the Firebase Admin SDK configuration for server-side operations. The Admin SDK provides full access to Firebase services with elevated privileges and should only be used in server-side code.

## Features

- **Firebase Admin SDK**: Official Firebase Admin SDK for server-side operations
- **Service Account Management**: Automatic credential detection and fallback
- **Multi-Environment Support**: Development and production environment handling
- **Type Safety**: Full TypeScript support with proper type definitions

## Configuration

### Environment Variables

```bash
# Required
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project-id.firebasestorage.app

# Optional (fallback to public variables)
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.firebasestorage.app
```

### Service Account

The Admin SDK automatically detects credentials in the following order:

1. **Local Development**: `serviceAccountKey.json` file in project root
2. **Production**: Google Cloud default application credentials

## Initialization

### Basic Admin SDK Setup

```typescript
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

// Initialize app if not already initialized
if (getApps().length === 0) {
  initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

// Initialize services
export const adminAuth = getAuth();
export const adminDb = getFirestore();
export const adminStorage = getStorage();
```

### With Service Account Key

```typescript
import { initializeApp, cert } from 'firebase-admin/app';
import serviceAccount from '@root/serviceAccountKey.json';

const app = initializeApp({
  credential: cert(serviceAccount),
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

export const adminAuth = getAuth(app);
export const adminDb = getFirestore(app);
export const adminStorage = getStorage(app);
```

## Usage Examples

### Authentication Operations

```typescript
import { adminAuth } from '@/lib/db/firebase-admin';

// Create custom token
const createCustomToken = async (uid, additionalClaims = {}) => {
  try {
    const customToken = await adminAuth.createCustomToken(uid, additionalClaims);
    return customToken;
  } catch (error) {
    console.error('Error creating custom token:', error);
    throw error;
  }
};

// Verify ID token
const verifyIdToken = async (idToken) => {
  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error('Error verifying ID token:', error);
    throw error;
  }
};

// Get user by UID
const getUserByUid = async (uid) => {
  try {
    const userRecord = await adminAuth.getUser(uid);
    return userRecord;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

// Create user
const createUser = async (userData) => {
  try {
    const userRecord = await adminAuth.createUser({
      email: userData.email,
      password: userData.password,
      displayName: userData.displayName,
    });
    return userRecord;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Update user
const updateUser = async (uid, updates) => {
  try {
    const userRecord = await adminAuth.updateUser(uid, updates);
    return userRecord;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// Delete user
const deleteUser = async (uid) => {
  try {
    await adminAuth.deleteUser(uid);
    console.log('User deleted successfully');
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};
```

### Firestore Operations

```typescript
import { adminDb } from '@/lib/db/firebase-admin';

// Add document
const addDocument = async (collection, data) => {
  try {
    const docRef = await adminDb.collection(collection).add(data);
    console.log('Document written with ID: ', docRef.id);
    return docRef;
  } catch (error) {
    console.error('Error adding document: ', error);
    throw error;
  }
};

// Get document
const getDocument = async (collection, docId) => {
  try {
    const doc = await adminDb.collection(collection).doc(docId).get();
    if (doc.exists) {
      return { id: doc.id, ...doc.data() };
    } else {
      throw new Error('Document not found');
    }
  } catch (error) {
    console.error('Error getting document: ', error);
    throw error;
  }
};

// Update document
const updateDocument = async (collection, docId, updates) => {
  try {
    await adminDb.collection(collection).doc(docId).update(updates);
    console.log('Document updated successfully');
  } catch (error) {
    console.error('Error updating document: ', error);
    throw error;
  }
};

// Delete document
const deleteDocument = async (collection, docId) => {
  try {
    await adminDb.collection(collection).doc(docId).delete();
    console.log('Document deleted successfully');
  } catch (error) {
    console.error('Error deleting document: ', error);
    throw error;
  }
};

// Query documents
const queryDocuments = async (collection, conditions = []) => {
  try {
    let query = adminDb.collection(collection);
    
    // Apply conditions
    conditions.forEach(({ field, operator, value }) => {
      query = query.where(field, operator, value);
    });
    
    const snapshot = await query.get();
    const documents = [];
    snapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });
    
    return documents;
  } catch (error) {
    console.error('Error querying documents: ', error);
    throw error;
  }
};

// Batch operations
const batchWrite = async (operations) => {
  try {
    const batch = adminDb.batch();
    
    operations.forEach(({ type, collection, docId, data }) => {
      const docRef = adminDb.collection(collection).doc(docId);
      
      switch (type) {
        case 'set':
          batch.set(docRef, data);
          break;
        case 'update':
          batch.update(docRef, data);
          break;
        case 'delete':
          batch.delete(docRef);
          break;
      }
    });
    
    await batch.commit();
    console.log('Batch write completed successfully');
  } catch (error) {
    console.error('Error in batch write: ', error);
    throw error;
  }
};
```

### Storage Operations

```typescript
import { adminStorage } from '@/lib/db/firebase-admin';

// Upload file
const uploadFile = async (bucketName, filePath, destination) => {
  try {
    const bucket = adminStorage.bucket(bucketName);
    const [file] = await bucket.upload(filePath, {
      destination,
      metadata: {
        cacheControl: 'public, max-age=31536000',
      },
    });
    
    console.log('File uploaded successfully');
    return file;
  } catch (error) {
    console.error('Error uploading file: ', error);
    throw error;
  }
};

// Get signed URL
const getSignedUrl = async (bucketName, filePath, action = 'read', expires = Date.now() + 15 * 60 * 1000) => {
  try {
    const bucket = adminStorage.bucket(bucketName);
    const [url] = await bucket.file(filePath).getSignedUrl({
      action,
      expires,
    });
    
    return url;
  } catch (error) {
    console.error('Error getting signed URL: ', error);
    throw error;
  }
};

// Delete file
const deleteFile = async (bucketName, filePath) => {
  try {
    const bucket = adminStorage.bucket(bucketName);
    await bucket.file(filePath).delete();
    console.log('File deleted successfully');
  } catch (error) {
    console.error('Error deleting file: ', error);
    throw error;
  }
};

// List files
const listFiles = async (bucketName, prefix = '') => {
  try {
    const bucket = adminStorage.bucket(bucketName);
    const [files] = await bucket.getFiles({ prefix });
    
    return files.map(file => ({
      name: file.name,
      size: file.metadata.size,
      contentType: file.metadata.contentType,
      updated: file.metadata.updated,
    }));
  } catch (error) {
    console.error('Error listing files: ', error);
    throw error;
  }
};
```

## Error Handling

### Firebase Admin Error Types

```typescript
import { FirebaseError } from 'firebase-admin';

const handleAdminError = (error) => {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case 'auth/user-not-found':
        return 'User not found';
      case 'auth/uid-already-exists':
        return 'User ID already exists';
      case 'auth/invalid-uid':
        return 'Invalid user ID';
      case 'auth/email-already-exists':
        return 'Email already exists';
      case 'permission-denied':
        return 'Permission denied';
      default:
        return `Firebase Admin error: ${error.message}`;
    }
  }
  return 'An unexpected error occurred';
};
```

### Try-Catch Pattern

```typescript
const safeAdminOperation = async (operation) => {
  try {
    const result = await operation();
    return { success: true, data: result };
  } catch (error) {
    const errorMessage = handleAdminError(error);
    return { success: false, error: errorMessage };
  }
};

// Usage
const result = await safeAdminOperation(() => 
  adminAuth.getUser('user-uid')
);

if (result.success) {
  console.log('User:', result.data);
} else {
  console.error('Error:', result.error);
}
```

## Best Practices

### Security

1. **Service Account Keys**: Keep service account keys secure and never commit them to version control
2. **Environment Variables**: Use environment variables for sensitive configuration
3. **Access Control**: Implement proper access control in your application logic
4. **Error Messages**: Don't expose sensitive information in error messages

### Performance

1. **Connection Reuse**: Reuse Admin SDK instances across requests
2. **Batch Operations**: Use batch operations for multiple database operations
3. **Query Optimization**: Use indexes and limit query results
4. **Caching**: Implement appropriate caching strategies

### Development

1. **Environment Separation**: Use different service accounts for development/production
2. **Error Logging**: Log errors appropriately for debugging
3. **Type Safety**: Use TypeScript interfaces for your data models
4. **Testing**: Test Admin SDK operations with proper mocking

## Troubleshooting

### Common Issues

1. **Missing Service Account**: Ensure `serviceAccountKey.json` exists or use production credentials
2. **Invalid Project ID**: Verify `FIREBASE_PROJECT_ID` environment variable
3. **Permission Denied**: Check service account permissions in Firebase Console
4. **Authentication Failed**: Verify service account key is valid

### Debug Mode

Enable debug logging by setting:

```bash
DEBUG=firebase-admin:*
```

### Connection Testing

Test your Admin SDK connection:

```typescript
import { adminAuth } from '@/lib/db/firebase-admin';

async function testConnection() {
  try {
    // Test basic operation
    const users = await adminAuth.listUsers(1);
    console.log('✅ Firebase Admin connection successful');
    console.log('✅ User count:', users.users.length);
    return true;
  } catch (error) {
    console.error('❌ Firebase Admin connection failed:', error);
    return false;
  }
}

testConnection();
```

## Related Documentation

- [Firebase Admin SDK Documentation](https://firebase.google.com/docs/admin)
- [Firebase Admin Auth](https://firebase.google.com/docs/admin/auth)
- [Firebase Admin Firestore](https://firebase.google.com/docs/admin/firestore)
- [Firebase Admin Storage](https://firebase.google.com/docs/admin/storage)
