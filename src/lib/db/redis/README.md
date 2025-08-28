# Redis Client Configuration

This directory contains the Redis client configuration using the official `node-redis` client for high-performance Redis operations.

## Features

- **Official Node.js Client**: Uses `@redis/client` for best performance and reliability
- **Connection Management**: Automatic connection pooling and reconnection
- **Type Safety**: Full TypeScript support with proper type definitions
- **Environment-Based Configuration**: Flexible configuration through environment variables

## Configuration

### Environment Variables

```bash
# Required (Production)
REDIS_URL=redis://username:password@host:port/database

# Optional (Development fallback)
# If REDIS_URL is not set, falls back to localhost:6379 in development
```

### Connection String Format

```bash
# Basic format
redis://host:port

# With authentication
redis://username:password@host:port

# With database selection
redis://username:password@host:port/database

# With SSL
rediss://username:password@host:port/database

# Examples
redis://localhost:6379
redis://user:pass@redis.example.com:6379/0
rediss://user:pass@redis.example.com:6380/1
```

## Initialization

### Basic Client Creation

```typescript
import { createClient } from 'redis';

const client = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

await client.connect();
```

### With Connection Options

```typescript
import { createClient } from 'redis';

const client = createClient({
  url: process.env.REDIS_URL,
  socket: {
    reconnectStrategy: (retries) => {
      const delay = Math.min(Math.pow(2, retries) * 50, 2000);
      return delay + Math.floor(Math.random() * 200);
    }
  }
});

await client.connect();
```

## Usage Examples

### Basic Operations

```typescript
import redis from '@/lib/db/redis';

// String operations
await redis.set('key', 'value');
const value = await redis.get('key');

// Hash operations
await redis.hSet('user:1', { name: 'John', email: 'john@example.com' });
const user = await redis.hGetAll('user:1');

// List operations
await redis.lPush('queue', 'item1');
await redis.lPush('queue', 'item2');
const items = await redis.lRange('queue', 0, -1);

// Set operations
await redis.sAdd('tags', 'javascript', 'redis', 'nodejs');
const tags = await redis.sMembers('tags');
```

### Transactions

```typescript
import redis from '@/lib/db/redis';

// Use transactions for atomic operations
const multi = redis.multi();

multi.set('user:1:balance', 100);
multi.decr('user:1:balance', 50);
multi.incr('user:2:balance', 50);

const results = await multi.exec();
console.log('Transaction results:', results);
```

### Pipeline Operations

```typescript
import redis from '@/lib/db/redis';

// Use pipeline for multiple operations
const pipeline = redis.pipeline();

pipeline.set('key1', 'value1');
pipeline.set('key2', 'value2');
pipeline.set('key3', 'value3');

const results = await pipeline.exec();
console.log('Pipeline results:', results);
```

## Connection Management

### Connection Events

```typescript
import redis from '@/lib/db/redis';

redis.on('connect', () => {
  console.log('Successfully connected to Redis!');
});

redis.on('ready', () => {
  console.log('Redis is ready to accept commands');
});

redis.on('error', (err) => {
  console.error('Could not connect to Redis:', err);
});

redis.on('close', () => {
  console.log('Redis connection closed');
});

redis.on('reconnecting', () => {
  console.log('Reconnecting to Redis...');
});
```

### Connection Status

```typescript
import redis from '@/lib/db/redis';

// Check connection status
if (redis.status === 'ready') {
  console.log('Redis is connected');
} else {
  console.log('Redis status:', redis.status);
}
```

## Error Handling

### Connection Errors

```typescript
import redis from '@/lib/db/redis';

redis.on('error', (err) => {
  if (err.code === 'ECONNREFUSED') {
    console.error('Redis connection refused. Is Redis running?');
  } else if (err.code === 'ENOTFOUND') {
    console.error('Redis host not found. Check your REDIS_URL.');
  } else {
    console.error('Redis error:', err);
  }
});
```

### Operation Errors

```typescript
try {
  const value = await redis.get('key');
  console.log('Value:', value);
} catch (error) {
  if (error.message.includes('WRONGTYPE')) {
    console.error('Key exists but has wrong type');
  } else if (error.message.includes('NOAUTH')) {
    console.error('Authentication failed');
  } else {
    console.error('Redis operation failed:', error);
  }
}
```

## Best Practices

### Connection Management

1. **Use connection pooling** for high-traffic applications
2. **Handle connection errors** gracefully
3. **Monitor connection health** in production
4. **Use appropriate timeouts** for operations

### Performance

1. **Use pipelines** for multiple operations
2. **Implement proper key expiration** (TTL)
3. **Use appropriate data structures** for your use case
4. **Monitor memory usage** and implement eviction policies

### Security

1. **Use authentication** in production
2. **Implement proper access control**
3. **Use SSL/TLS** for sensitive data
4. **Regular security updates**

## Troubleshooting

### Common Issues

1. **Connection Refused**: Redis service not running
2. **Authentication Failed**: Wrong credentials in REDIS_URL
3. **Host Not Found**: Invalid hostname in REDIS_URL
4. **Memory Issues**: Redis running out of memory

### Connection Testing

```typescript
import redis from '@/lib/db/redis';

async function testRedis() {
  try {
    await redis.ping();
    console.log('✅ Redis connection successful');
    
    // Test basic operations
    await redis.set('test', 'value');
    const value = await redis.get('test');
    console.log('✅ Redis operations successful:', value);
    
    // Cleanup
    await redis.del('test');
  } catch (error) {
    console.error('❌ Redis test failed:', error);
  }
}

testRedis();
```

## Related Documentation

- [Node-Redis Documentation](https://github.com/redis/node-redis)
- [Redis Commands](https://redis.io/commands)
- [Redis Data Types](https://redis.io/topics/data-types)
- [Redis Transactions](https://redis.io/topics/transactions)
