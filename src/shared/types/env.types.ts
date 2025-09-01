/**
 * @fileoverview Environment Variables Type Definitions
 * @description Type definitions for all environment variables used in the application
 */

export interface EnvironmentVariables {
  // Firebase
  FIREBASE_PROJECT_ID: string;
  FIREBASE_STORAGE_BUCKET: string;
  NEXT_PUBLIC_FIREBASE_API_KEY: string;
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: string;
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: string;
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: string;
  NEXT_PUBLIC_FIREBASE_APP_ID: string;
  NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: string;
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: string;
  
  // reCAPTCHA
  NEXT_PUBLIC_RECAPTCHA_SITE_KEY: string;
  
  // MongoDB
  MONGODB_URI: string;
  
  // Redis
  REDIS_URL: string;
  
  // Gemini AI
  GEMINI_API_KEY: string;
  
  // Supabase - Public (Client-side)
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  
  // Supabase - Private (Server-side)
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  SUPABASE_JWT_SECRET: string;
  
  // Supabase Database
  POSTGRES_URL: string;
  POSTGRES_URL_NON_POOLING: string;
  POSTGRES_PRISMA_URL: string;
  POSTGRES_USER: string;
  POSTGRES_PASSWORD: string;
  POSTGRES_HOST: string;
  POSTGRES_DATABASE: string;
}

// 使用模組擴展而不是命名空間 - 這是 TypeScript 推薦的方式
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface ProcessEnv extends EnvironmentVariables {}
  }
}
