/**
 * @fileoverview Blog Service Layer
 * @description Handles the core business logic for blog posts, interacting with the database.
 */
'use server';

import { adminDb } from '@/lib/db/firebase-admin/firebase-admin';
import type { Post } from '@/features/(system-admin)/website-cms/blog/types/blog.types';
import { Timestamp } from 'firebase-admin/firestore';

const postsCollection = adminDb.collection('posts');

/**
 * Fetches all published posts, ordered by publish date.
 * @returns {Promise<Post[]>} A promise that resolves to an array of posts.
 */
export async function getPublishedPosts(): Promise<Post[]> {
  try {
    const snapshot = await postsCollection
      .where('status', '==', '已發布')
      .orderBy('publishedAt', 'desc')
      .get();
      
    if (snapshot.empty) {
      return [];
    }
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        publishedAt: (data.publishedAt as Timestamp).toDate(),
        createdAt: (data.createdAt as Timestamp).toDate(),
        updatedAt: (data.updatedAt as Timestamp).toDate(),
      } as Post;
    });
  } catch (error) {
    console.error('Error fetching published posts:', error);
    return [];
  }
}

/**
 * Fetches a single published post by its slug.
 * @param {string} slug - The slug of the post to fetch.
 * @returns {Promise<Post | null>} A promise that resolves to the post or null if not found.
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const snapshot = await postsCollection
      .where('slug', '==', slug)
      .where('status', '==', '已發布')
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      publishedAt: (data.publishedAt as Timestamp).toDate(),
      createdAt: (data.createdAt as Timestamp).toDate(),
      updatedAt: (data.updatedAt as Timestamp).toDate(),
    } as Post;
  } catch (error) {
    console.error(`Error fetching post by slug (${slug}):`, error);
    return null;
  }
}

/**
 * Fetches a single post by its ID (for admin/editing purposes).
 * @param {string} id - The ID of the post to fetch.
 * @returns {Promise<Post | null>} A promise that resolves to the post or null if not found.
 */
export async function getPostById(id: string): Promise<Post | null> {
  try {
    const docRef = postsCollection.doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return null;
    }

    const data = docSnap.data()!;
    return {
      id: docSnap.id,
      ...data,
      publishedAt: (data.publishedAt as Timestamp)?.toDate(),
      createdAt: (data.createdAt as Timestamp).toDate(),
      updatedAt: (data.updatedAt as Timestamp).toDate(),
    } as Post;
  } catch (error) {
    console.error(`Error fetching post by ID (${id}):`, error);
    return null;
  }
}
