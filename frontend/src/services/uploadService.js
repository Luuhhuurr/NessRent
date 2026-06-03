import api from './api';

const UPLOAD_URL = '/upload';

export const uploadService = {
  // Upload single image
  uploadImage: async (file, folder = 'products') => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', folder);

    const response = await api.post(UPLOAD_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Upload multiple images
  uploadImages: async (files, folder = 'products') => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });
    formData.append('folder', folder);

    const response = await api.post(`${UPLOAD_URL}/multiple`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Upload identity document
  uploadIdentity: async (file, userId) => {
    const formData = new FormData();
    formData.append('identity', file);
    formData.append('userId', userId);

    const response = await api.post(`${UPLOAD_URL}/identity`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default uploadService;