import api from '../lib/api';

const UPLOAD_URL = '/upload';

const multipart = { headers: { 'Content-Type': 'multipart/form-data' } };

export const uploadService = {
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post(UPLOAD_URL, formData, multipart);
    return response.data;
  },

  uploadImages: async (files) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    const response = await api.post(`${UPLOAD_URL}/multiple`, formData, multipart);
    return response.data;
  },

  // The backend attaches the document to the authenticated user, so no user id
  // is sent from here.
  uploadIdentity: async (file) => {
    const formData = new FormData();
    formData.append('identity', file);

    const response = await api.post(`${UPLOAD_URL}/identity`, formData, multipart);
    return response.data;
  },
};

export default uploadService;
