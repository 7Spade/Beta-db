# Mongoose MongoDB Configuration

This directory contains the Mongoose configuration for MongoDB database connections. Mongoose provides a robust object modeling tool for MongoDB with schema validation, query building, and business logic hooks.

## Features

- **Object Modeling**: Schema-based data modeling with validation
- **Connection Management**: Automatic connection caching and reuse
- **Type Safety**: Full TypeScript support with proper type definitions
- **Environment-Based Configuration**: Flexible configuration through environment variables

## Configuration

### Environment Variables

```bash
# Required
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority

# Optional (for advanced configuration)
MONGODB_MAX_POOL_SIZE=10
MONGODB_MIN_POOL_SIZE=1
MONGODB_MAX_IDLE_TIME_MS=30000
```

### Connection String Format

The connection string must include the database name:

```
mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority
```

**Important**: The database name must be specified in the connection string after the host and before the query parameters.

## Initialization

### Basic Connection

```typescript
import mongoose from 'mongoose';

// Connect to MongoDB
try {
  await mongoose.connect(process.env.MONGODB_URI!);
  console.log('MongoDB connected successfully');
} catch (error) {
  console.error('MongoDB connection failed:', error);
}
```

### Connection with Options

```typescript
import mongoose from 'mongoose';

try {
  await mongoose.connect(process.env.MONGODB_URI!, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });
  console.log('MongoDB connected successfully');
} catch (error) {
  console.error('MongoDB connection failed:', error);
}
```

## Connection Management

### Connection Caching

The connection is automatically cached to prevent multiple connections during hot reloads:

```typescript
// Global connection cache
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}
```

### Connection States

- **`cached.conn`**: Active connection instance
- **`cached.promise`**: Connection promise for concurrent requests
- **Connection Reuse**: Prevents multiple connections in development

## Usage Examples

### Basic Model Definition

```typescript
// models/User.ts
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);
```

### API Route with Connection

```typescript
// pages/api/users.ts
import mongoose from 'mongoose';
import { User } from '@/models/User';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Ensure connection is established
      if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(process.env.MONGODB_URI!);
      }
      
      // Query users
      const users = await User.find({}).sort({ createdAt: -1 });
      
      res.status(200).json(users);
    } catch (error) {
      console.error('API error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
```

### Server Action with Connection

```typescript
// app/actions/user-actions.ts
'use server';

import mongoose from 'mongoose';
import { User } from '@/models/User';

export async function createUser(userData: { name: string; email: string }) {
  try {
    // Ensure connection is established
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }
    
    // Create new user
    const user = new User(userData);
    await user.save();
    
    return { success: true, user };
  } catch (error) {
    console.error('Create user error:', error);
    throw new Error('Failed to create user');
  }
}

export async function getUsers() {
  try {
    // Ensure connection is established
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }
    
    // Get all users
    const users = await User.find({}).sort({ createdAt: -1 });
    
    return users;
  } catch (error) {
    console.error('Get users error:', error);
    throw new Error('Failed to get users');
  }
}
```

## Error Handling

### Connection Errors

The connection function provides detailed error messages:

```typescript
try {
  await mongoose.connect(process.env.MONGODB_URI!);
} catch (error) {
  if (error.message.includes('MONGODB_URI')) {
    console.error('Missing MongoDB connection string');
  } else if (error.message.includes('database name')) {
    console.error('Invalid connection string format');
  } else {
    console.error('Connection failed:', error.message);
  }
}
```

### Common Error Scenarios

1. **Missing Environment Variable**: `MONGODB_URI` not set
2. **Invalid Connection String**: Missing database name or malformed URI
3. **Network Issues**: Connection timeout or network errors
4. **Authentication Failed**: Invalid credentials

## Best Practices

### Connection Management

1. **Always check connection state** before database operations
2. **Handle connection errors** gracefully with user feedback
3. **Use connection caching** to prevent multiple connections
4. **Validate connection strings** in development

### Model Design

1. **Define schemas** with proper validation
2. **Use indexes** for frequently queried fields
3. **Implement middleware** for common operations
4. **Handle model compilation** properly

### Performance

1. **Use connection pooling** for production environments
2. **Implement query optimization** with proper indexes
3. **Monitor connection metrics** in production
4. **Handle connection timeouts** appropriately

## Troubleshooting

### Common Issues

1. **Connection String Format**: Ensure database name is included
2. **Environment Variables**: Check `.env.local` file
3. **Network Access**: Verify MongoDB Atlas network access
4. **Authentication**: Check username/password in connection string

### Connection Testing

Test your connection string:

```typescript
import mongoose from 'mongoose';

// Test connection
async function testConnection() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('✅ Connection successful');
    
    // Test basic operation
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('✅ Database access successful:', collections.length, 'collections');
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
}

testConnection();
```

## Related Documentation

- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [MongoDB Connection String Format](https://docs.mongodb.com/manual/reference/connection-string/)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
