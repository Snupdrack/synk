import { db } from '@/lib/db';
import { cookies } from 'next/headers';
import { randomUUID } from 'crypto';

// Hash password using Web Crypto API (SHA-256)
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'dax-salt-2024');
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const hash = await hashPassword(password);
  return hash === hashedPassword;
}

// Get current user from session cookie
export async function getCurrentUser(): Promise<any | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('dax-session')?.value;
  
  if (!token) return null;
  
  const user = await db.user.findFirst({
    where: { sessionToken: token }
  });
  
  if (!user || !user.active) return null;
  
  return user;
}

// Create session (login)
export async function createSession(userId: string): Promise<string> {
  const token = randomUUID();
  await db.user.update({
    where: { id: userId },
    data: { sessionToken: token }
  });
  return token;
}

// Destroy session (logout)
export async function destroySession(userId: string): Promise<void> {
  await db.user.update({
    where: { id: userId },
    data: { sessionToken: null }
  });
}
