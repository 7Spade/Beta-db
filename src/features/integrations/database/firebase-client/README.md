# Firebase Client SDK Configuration

This directory contains the Firebase Client SDK configuration for client-side (browser) operations. The Client SDK provides secure access to Firebase services from React components and client-side scripts.

## Features

- **Firebase Client SDK**: Official Firebase JavaScript SDK for web applications
- **Multi-Service Support**: Firestore, Storage, Auth, Functions, and Analytics
- **Type Safety**: Full TypeScript support with proper type definitions
- **Environment-Based Configuration**: Flexible configuration through environment variables

## Configuration

### Environment Variables

```bash
# Required
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.firebasestorage.app
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
```

### Firebase Config Object

```typescript
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};
```

## Initialization

### Basic App Initialization

```typescript
import { initializeApp } from 'firebase/app';

const app = initializeApp(firebaseConfig);
```

### Service Initialization

```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';
import { getAnalytics } from 'firebase/analytics';

const app = initializeApp(firebaseConfig);

// Initialize services
export const firestore = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);
export const analytics = getAnalytics(app);
```

## Usage Examples

### Basic Component Usage

```typescript
// components/MyComponent.tsx
'use client';

import { firestore, auth } from '@/lib/db/firebase-client';
import { collection, getDocs } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function MyComponent() {
  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth, 
        'user@example.com', 
        'password'
      );
      console.log('Signed in:', userCredential.user);
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'users'));
      querySnapshot.forEach((doc) => {
        console.log(doc.id, ' => ', doc.data());
      });
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  return (
    <div>
      <button onClick={handleSignIn}>Sign In</button>
      <button onClick={fetchData}>Fetch Data</button>
    </div>
  );
}
```

### Firestore Operations

```typescript
import { firestore } from '@/lib/db/firebase-client';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  limit
} from 'firebase/firestore';

// Add document
const addUser = async (userData) => {
  try {
    const docRef = await addDoc(collection(firestore, 'users'), userData);
    console.log('Document written with ID: ', docRef.id);
    return docRef;
  } catch (error) {
    console.error('Error adding document: ', error);
    throw error;
  }
};

// Get documents
const getUsers = async () => {
  try {
    const q = query(
      collection(firestore, 'users'),
      where('active', '==', true),
      orderBy('createdAt', 'desc'),
      limit(10)
    );
    
    const querySnapshot = await getDocs(q);
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    
    return users;
  } catch (error) {
    console.error('Error getting documents: ', error);
    throw error;
  }
};

// Update document
const updateUser = async (userId, updates) => {
  try {
    const userRef = doc(firestore, 'users', userId);
    await updateDoc(userRef, updates);
    console.log('Document updated successfully');
  } catch (error) {
    console.error('Error updating document: ', error);
    throw error;
  }
};

// Delete document
const deleteUser = async (userId) => {
  try {
    await deleteDoc(doc(firestore, 'users', userId));
    console.log('Document deleted successfully');
  } catch (error) {
    console.error('Error removing document: ', error);
    throw error;
  }
};
```

### Authentication

```typescript
import { auth } from '@/lib/db/firebase-client';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

// Sign up
const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
};

// Sign in
const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
};

// Sign out
const signOutUser = async () => {
  try {
    await signOut(auth);
    console.log('User signed out');
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};

// Auth state listener
const listenToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
};
```

### Storage Operations

```typescript
import { storage } from '@/lib/db/firebase-client';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';

// Upload file
const uploadFile = async (file, path) => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

// Get download URL
const getFileURL = async (path) => {
  try {
    const storageRef = ref(storage, path);
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.error('Get URL error:', error);
    throw error;
  }
};

// Delete file
const deleteFile = async (path) => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
    console.log('File deleted successfully');
  } catch (error) {
    console.error('Delete error:', error);
    throw error;
  }
};
```

## Error Handling

### Firebase Error Types

```typescript
import { FirebaseError } from 'firebase/app';

const handleFirebaseError = (error) => {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case 'auth/user-not-found':
        return 'User not found';
      case 'auth/wrong-password':
        return 'Incorrect password';
      case 'auth/email-already-in-use':
        return 'Email already in use';
      case 'permission-denied':
        return 'Permission denied';
      default:
        return `Firebase error: ${error.message}`;
    }
  }
  return 'An unexpected error occurred';
};
```

### Try-Catch Pattern

```typescript
const safeFirebaseOperation = async (operation) => {
  try {
    const result = await operation();
    return { success: true, data: result };
  } catch (error) {
    const errorMessage = handleFirebaseError(error);
    return { success: false, error: errorMessage };
  }
};

// Usage
const result = await safeFirebaseOperation(() => 
  getDocs(collection(firestore, 'users'))
);

if (result.success) {
  console.log('Users:', result.data);
} else {
  console.error('Error:', result.error);
}
```

## Best Practices

### Security

1. **Use Security Rules**: Configure Firestore and Storage security rules
2. **Validate Input**: Always validate data before sending to Firebase
3. **Handle Errors**: Implement proper error handling for all operations
4. **User Authentication**: Ensure users are authenticated before sensitive operations

### Performance

1. **Batch Operations**: Use batch writes for multiple operations
2. **Query Optimization**: Use indexes and limit query results
3. **Caching**: Implement client-side caching for frequently accessed data
4. **Lazy Loading**: Load data only when needed

### Development

1. **Environment Variables**: Use different configs for development/production
2. **Error Logging**: Log errors appropriately for debugging
3. **Type Safety**: Use TypeScript interfaces for your data models
4. **Testing**: Test Firebase operations with proper mocking

## Troubleshooting

### Common Issues

1. **Missing Environment Variables**: Ensure all required Firebase config variables are set
2. **CORS Errors**: Check Firebase project settings and security rules
3. **Authentication Issues**: Verify Firebase Auth is enabled and configured
4. **Permission Denied**: Check Firestore and Storage security rules

### Debug Mode

Enable debug logging:

```typescript
// In your Firebase config
if (process.env.NODE_ENV === 'development') {
  console.log('Firebase config:', firebaseConfig);
}
```

## Related Documentation

- [Firebase Client SDK Documentation](https://firebase.google.com/docs/web/setup)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [Firebase Storage Documentation](https://firebase.google.com/docs/storage)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
