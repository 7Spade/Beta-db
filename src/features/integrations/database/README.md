# Database Configuration

This directory contains database configurations for multiple database systems used in the project.

## Available Databases

### 1. **Firebase** 🔥
- **Client**: Browser-based operations with security rules
- **Admin**: Server-side operations with elevated privileges
- **Features**: Authentication, Firestore, Storage, App Check
- **Use Case**: User management, real-time data, file storage

### 2. **Supabase** 🟢
- **Type**: PostgreSQL-based open-source alternative
- **Features**: Real-time subscriptions, Row Level Security (RLS), Edge Functions
- **Use Case**: Main application database, complex queries, real-time features

### 3. **MongoDB (Mongoose)** 🍃
- **Type**: NoSQL document database
- **Features**: Schema validation, query building, business logic hooks
- **Use Case**: Flexible data structures, document-based data

### 4. **Redis** 🔴
- **Type**: In-memory key-value store
- **Features**: Caching, sessions, real-time data, pub/sub
- **Use Case**: Performance optimization, temporary data, real-time features

## Quick Start

### Environment Variables
```bash
# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project-id.firebasestorage.app

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name

# Redis
REDIS_URL=redis://username:password@host:port/database
```

### Basic Usage
```typescript
// Firebase
import { adminDb } from '@/lib/db/firebase-admin';
import { getSupabaseClient } from '@/lib/db/supabase';

// MongoDB
import { connectDB } from '@/lib/db/mongoose';

// Redis
import redis from '@/lib/db/redis';

// Connect and use
await connectDB(); // MongoDB
const supabase = await getSupabaseClient(); // Supabase
await redis.set('key', 'value'); // Redis
```

## When to Use Each Database

- **Firebase**: Authentication, real-time features, mobile apps
- **Supabase**: Main application data, complex relationships, real-time
- **MongoDB**: Flexible schemas, document-based data, rapid prototyping
- **Redis**: Caching, sessions, real-time data, performance optimization

## Documentation

For detailed configuration and usage examples, see the README files in each database directory:
- [`firebase-admin/`](./firebase-admin/README.md)
- [`firebase-client/`](./firebase-client/README.md)
- [`supabase/`](./supabase/README.md)
- [`mongoose/`](./mongoose/README.md)
- [`redis/`](./redis/README.md)
