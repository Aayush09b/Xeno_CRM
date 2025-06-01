import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
});

export const getCustomers = () => api.get('/customers');
export const addCustomer = (data) => api.post('/customers', data);
export const addCustomers = (data) => api.post('/customers/batch', data);

export const deleteSegment = (id) => api.delete(`/segments/${id}`);

export const getSegments = () => api.get('/segments');
export const createSegment = (data) => api.post('/segments', data);
export const previewSegment = (data) => api.post('/segments/preview', data);
export const getSegmentCustomers = (id) => api.get(`/segments/${id}/customers`);

export const getCampaigns = () => api.get('/campaigns');
export const getCampaign = (id) => api.get(`/campaigns/${id}`);
export const createCampaign = (data) => api.post('/campaigns', data);
export const sendCampaign = (id) => api.post(`/vendor/${id}/send`);
export const retryFailed = (id) => api.post(`/vendor/${id}/retry`);




export default api;