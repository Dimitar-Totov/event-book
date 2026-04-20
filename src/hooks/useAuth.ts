import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Access the authentication context from any component inside <AuthProvider>.
 * Throws if called outside of <AuthProvider>.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside <AuthProvider>.');
  }
  return context;
}
