import { Session } from 'next-auth';

export function isAdmin(session: Session | null): boolean {
  //log输出当前用户的信息
  console.log('当前用户的信息:', session?.user);
  return session?.user?.role === 'ADMIN';
}

export function requireAdmin(session: Session | null): void {
  if (!isAdmin(session)) {
    throw new Error('Unauthorized: Admin access required');
  }
}
