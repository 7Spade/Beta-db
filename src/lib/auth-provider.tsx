
'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { auth, firestore } from './firebase-client';
import { usePathname, useRouter } from 'next/navigation';

interface UserProfile {
  role: 'Admin' | 'Member';
  status: 'pending' | 'approved' | 'rejected';
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const publicRoutes = ['/login', '/register', '/pending-approval'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (!user) {
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    let unsubscribeProfile: (() => void) | undefined;

    if (user) {
      const userDocRef = doc(firestore, 'users', user.uid);
      unsubscribeProfile = onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
          setUserProfile(docSnap.data() as UserProfile);
        } else {
          // This case might happen if profile creation fails after sign-up
          setUserProfile(null);
        }
        setLoading(false);
      }, (error) => {
        console.error("Error fetching user profile:", error);
        setUserProfile(null);
        setLoading(false);
      });
    }

    return () => {
      if (unsubscribeProfile) {
        unsubscribeProfile();
      }
    };
  }, [user]);

  useEffect(() => {
    if (loading) {
      return; // Wait until loading is complete
    }

    const isPublicRoute = publicRoutes.includes(pathname);

    if (!user && !isPublicRoute) {
      // Not logged in and not on a public page, redirect to login
      router.push('/login');
      return;
    }

    if (user && userProfile) {
      if (userProfile.status === 'pending') {
        if (pathname !== '/pending-approval') {
          router.push('/pending-approval');
        }
      } else if (userProfile.status === 'approved') {
        if (isPublicRoute) {
          router.push('/dashboard');
        }
      } else if (userProfile.status === 'rejected') {
        // Log out rejected user and redirect to login with a message
        auth.signOut();
        router.push('/login?error=rejected');
      }
    } else if (user && !userProfile) {
        // User is authenticated but has no profile, might be a fresh registration
        // Wait for profile to be created or redirect to a safe page.
        // For now, if they are not on a public page, redirect to login
        if(!isPublicRoute) {
            auth.signOut();
            router.push('/login?error=noprofile');
        }
    }
  }, [user, userProfile, loading, pathname, router]);

  return (
    <AuthContext.Provider value={{ user, userProfile, loading }}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
