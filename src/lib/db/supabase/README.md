# Supabase Configuration

This directory contains the Supabase configuration for both client-side and server-side operations. Supabase provides a powerful open-source alternative to Firebase with PostgreSQL database, real-time subscriptions, and built-in authentication.

## Features

- **PostgreSQL Database**: Full PostgreSQL database with real-time capabilities
- **Built-in Authentication**: User management with multiple providers
- **Real-time Subscriptions**: Live data updates with WebSocket connections
- **Row Level Security**: Advanced security with RLS policies
- **Type Safety**: Full TypeScript support with generated types

## Configuration

### Environment Variables

```bash
# Required
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Server-side (for server actions and API routes)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Optional
SUPABASE_DB_PASSWORD=your-database-password
SUPABASE_JWT_SECRET=your-jwt-secret
```

### Project Setup

1. **Create Supabase Project**: [supabase.com](https://supabase.com)
2. **Get API Keys**: From Project Settings > API
3. **Configure Environment Variables**: Add to `.env.local`
4. **Enable Row Level Security**: In Authentication > Policies

## Initialization

### Client-Side Client

```typescript
// client.ts
import { createClient } from '@supabase/supabase-js';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  });
}
```

### Server-Side Client

```typescript
// server.ts
import { createClient } from '@supabase/supabase-js';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
```

## Usage Examples

### Basic Database Operations

```typescript
import { createClient } from '@/lib/db/supabase/client';

const supabase = createClient();

// Insert data
const { data, error } = await supabase
  .from('users')
  .insert([
    { name: 'John Doe', email: 'john@example.com' }
  ]);

if (error) {
  console.error('Insert error:', error);
} else {
  console.log('Inserted:', data);
}

// Query data
const { data: users, error: queryError } = await supabase
  .from('users')
  .select('*')
  .eq('active', true);

if (queryError) {
  console.error('Query error:', queryError);
} else {
  console.log('Users:', users);
}
```

### Authentication

```typescript
import { createClient } from '@/lib/db/supabase/client';

const supabase = createClient();

// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
});

// Sign in
const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123',
});

// Sign out
await supabase.auth.signOut();

// Get current user
const { data: { user } } = await supabase.auth.getUser();
```

### Real-time Subscriptions

```typescript
import { createClient } from '@/lib/db/supabase/client';

const supabase = createClient();

// Subscribe to real-time changes
const subscription = supabase
  .channel('public:users')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'users' },
    (payload) => {
      console.log('Change received!', payload);
    }
  )
  .subscribe();

// Unsubscribe when done
subscription.unsubscribe();
```

### API Route with Supabase

```typescript
// pages/api/users.ts
import { createClient } from '@/lib/db/supabase/server';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const supabase = createClient();
      
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
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

### Server Action with Supabase

```typescript
// app/actions/user-actions.ts
'use server';

import { createClient } from '@/lib/db/supabase/server';

export async function createUser(userData: { name: string; email: string }) {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return { success: true, user: data };
  } catch (error) {
    console.error('Create user error:', error);
    throw new Error('Failed to create user');
  }
}

export async function getUsers() {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Get users error:', error);
    throw new Error('Failed to get users');
  }
}
```

## Advanced Features

### Row Level Security (RLS)

```sql
-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Policy: Users can update their own data
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);
```

### Database Functions

```sql
-- Create a function to get user profile
CREATE OR REPLACE FUNCTION get_user_profile(user_id UUID)
RETURNS TABLE (
  id UUID,
  name TEXT,
  email TEXT,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT u.id, u.name, u.email, u.created_at
  FROM users u
  WHERE u.id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Error Handling

### Database Errors

```typescript
import { createClient } from '@/lib/db/supabase/client';

try {
  const { data, error } = await supabase
    .from('users')
    .insert([userData]);
  
  if (error) {
    if (error.code === '23505') {
      throw new Error('User already exists');
    } else if (error.code === '23503') {
      throw new Error('Referenced record not found');
    } else {
      throw new Error(`Database error: ${error.message}`);
    }
  }
  
  return data;
} catch (error) {
  console.error('Operation failed:', error);
  throw error;
}
```

### Authentication Errors

```typescript
try {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    if (error.message.includes('Invalid login credentials')) {
      throw new Error('Invalid email or password');
    } else if (error.message.includes('Email not confirmed')) {
      throw new Error('Please confirm your email address');
    } else {
      throw new Error(`Authentication error: ${error.message}`);
    }
  }
  
  return data;
} catch (error) {
  console.error('Auth failed:', error);
  throw error;
}
```

## Best Practices

### Security

1. **Use RLS Policies**: Implement row-level security for all tables
2. **Service Role Key**: Only use service role key on server-side
3. **Input Validation**: Validate all inputs before database operations
4. **Error Messages**: Don't expose sensitive information in error messages

### Performance

1. **Selective Queries**: Only select needed columns
2. **Indexes**: Create indexes for frequently queried columns
3. **Pagination**: Implement pagination for large datasets
4. **Real-time**: Use real-time subscriptions sparingly

### Development

1. **Type Safety**: Use generated types from Supabase CLI
2. **Environment Variables**: Use different keys for development/production
3. **Local Development**: Use Supabase CLI for local development
4. **Migrations**: Version control your database schema

## Troubleshooting

### Common Issues

1. **CORS Errors**: Check Supabase project settings
2. **RLS Blocking**: Verify RLS policies are correct
3. **Type Errors**: Regenerate types with Supabase CLI
4. **Connection Issues**: Verify environment variables

### Connection Testing

Test your Supabase connection:

```typescript
import { createClient } from '@/lib/db/supabase/client';

async function testConnection() {
  try {
    const supabase = createClient();
    
    // Test basic query
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      throw error;
    }
    
    console.log('✅ Supabase connection successful');
    return true;
  } catch (error) {
    console.error('❌ Supabase connection failed:', error);
    return false;
  }
}

testConnection();
```

## Related Documentation

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Database Functions](https://supabase.com/docs/guides/database/functions)
- [Edge Functions](https://supabase.com/docs/guides/functions)
- [Next.js Integration](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)
