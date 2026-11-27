import { useEffect } from 'react';

export default function Logout() {
  useEffect(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('employee');
    window.location.href = '/login';
  }, []);

  return null;
}