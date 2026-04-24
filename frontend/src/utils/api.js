import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

API.interceptors.request.use(config => {
  const token = localStorage.getItem('rainbow_admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Public products
export const getProducts       = (params) => API.get('/products', { params });
export const getFeaturedProducts = ()      => API.get('/products/featured');
export const getLatestProducts   = ()      => API.get('/products/latest');
export const getProduct          = (id)    => API.get(`/products/${id}`);
export const getRecommended      = (id)    => API.get(`/products/${id}/recommended`);
export const getBrowseOthers     = (id)    => API.get(`/products/${id}/browse-others`);
export const getProductsByCategory = (cat) => API.get(`/products/category/${cat}`);

// Categories
export const getCategories = () => API.get('/categories');

// Admin auth
export const adminLogin    = (data) => API.post('/admin/login', data);
export const adminRegister = (data) => API.post('/admin/register', data);
export const verifyAdmin   = ()     => API.get('/admin/verify');

// Admin products
export const getAdminProducts = ()          => API.get('/admin/products');
export const getAdminStats    = ()          => API.get('/admin/stats');
export const createProduct    = (data)      => API.post('/admin/products', data);
export const updateProduct    = (id, data)  => API.put(`/admin/products/${id}`, data);
export const deleteProduct    = (id)        => API.delete(`/admin/products/${id}`);
export const deleteProductImage = (productId, publicId) =>
  API.delete(`/admin/products/${productId}/images/${encodeURIComponent(publicId)}`);

export default API;