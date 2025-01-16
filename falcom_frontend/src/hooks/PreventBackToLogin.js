// src/hooks/usePreventBackToLogin.js

import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const usePreventBackToLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handlePopState = (event) => {
      if (location.pathname === '/login' && localStorage.getItem('token')) {
        navigate('/profile', { replace: true });
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [location, navigate]);
};

export default usePreventBackToLogin;
