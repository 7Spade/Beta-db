'use client';

import { firestore } from '@root/src/features/integrations/database/firebase-client/firebase-client';
import { collection, onSnapshot, orderBy, query, Timestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import type { Post } from '../types/blog.types';

/**
 * Custom hook to fetch and listen to real-time updates for the blog post list.
 * @returns An object containing the list of posts and a loading state.
 */
export function useBlogList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    const postsCollection = collection(firestore, 'posts');
    const q = query(postsCollection, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const postsData = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            // Ensure Timestamps are converted to Dates
            publishedAt: (data.publishedAt as Timestamp)?.toDate(),
            createdAt: (data.createdAt as Timestamp)?.toDate(),
            updatedAt: (data.updatedAt as Timestamp)?.toDate(),
          } as Post;
        });
        setPosts(postsData);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching posts:", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { posts, loading, error };
}
