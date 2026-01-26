// Client-side session management utilities

export function isSessionExpired(): boolean {
  if (typeof window === 'undefined') return false;
  
  const tokenExpiry = localStorage.getItem('tokenExpiry');
  if (!tokenExpiry) return true;
  
  return Date.now() > parseInt(tokenExpiry);
}

export function clearSession(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('user');
  localStorage.removeItem('tokenExpiry');
}

export function getUser() {
  if (typeof window === 'undefined') return null;
  
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

export async function logout() {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
    });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    clearSession();
    window.location.href = '/signin';
  }
}
