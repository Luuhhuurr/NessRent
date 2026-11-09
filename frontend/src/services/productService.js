import api from '../lib/api';

// The product endpoints accept multipart so the image can be sent with the
// form fields in a single request.
const multipart = { headers: { 'Content-Type': 'multipart/form-data' } };
const asMultipart = (payload) => (payload instanceof FormData ? multipart : undefined);

export const productService = {
  getProducts: async (params = {}) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  getProduct: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  createProduct: async (productData) => {
    const response = await api.post('/products', productData, asMultipart(productData));
    return response.data;
  },

  updateProduct: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData, asMultipart(productData));
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/products/categories');
    return response.data;
  },
};

export default productService;
