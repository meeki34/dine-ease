import axios from 'axios';

const API = axios.create({
  baseURL: "/api",
});

// Add token to every request automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      const path = window.location?.pathname || '';
      if (
        path !== '/login' &&
        path !== '/register' &&
        path !== '/staff-login' &&
        !path.startsWith('/staff-invite')
      ) {
        const target = path.startsWith('/kitchen') || path.startsWith('/waiter') ? '/staff-login' : '/login';
        window.location.href = target;
      }
    }
    return Promise.reject(error);
  }
);

export default API;
