import axios from 'axios';

const api = axios.create({ baseURL: process.env.REACT_APP_API_URL || '/api' });

// Party APIs
export const partyAPI = {
  getAll: (params) => api.get('/parties', { params }),
  getById: (id) => api.get(`/parties/${id}`),
  compare: (ids) => api.get('/parties/compare', { params: { ids: ids.join(',') } }),
  create: (data) => api.post('/parties', data),
  update: (id, data) => api.put(`/parties/${id}`, data),
  delete: (id) => api.delete(`/parties/${id}`),
};

// Promise APIs
export const promiseAPI = {
  getAll: (params) => api.get('/promises', { params }),
  getById: (id) => api.get(`/promises/${id}`),
  getStats: () => api.get('/promises/stats/overview'),
  create: (data) => api.post('/promises', data),
  update: (id, data) => api.put(`/promises/${id}`, data),
  delete: (id) => api.delete(`/promises/${id}`),
  vote: (id, type) => api.post(`/promises/${id}/vote`, { type }),
};

// Manifesto APIs
export const manifestoAPI = {
  getAll: (params) => api.get('/manifestos', { params }),
  getById: (id) => api.get(`/manifestos/${id}`),
  uploadPDF: (formData) => api.post('/manifestos/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  addText: (data) => api.post('/manifestos/text', data),
};

// AI APIs
export const aiAPI = {
  chat: (messages) => api.post('/ai/chat', { messages }),
  askManifesto: (manifestoId, query) => api.post('/ai/ask-manifesto', { manifestoId, query }),
  extractPromises: (manifestoId, category) => api.post('/ai/extract-promises', { manifestoId, category }),
  analyzePromise: (promiseId) => api.post('/ai/analyze-promise', { promiseId }),
  compareManifestos: (manifestoId1, manifestoId2, topic) => api.post('/ai/compare-manifestos', { manifestoId1, manifestoId2, topic }),
};

export default api;
