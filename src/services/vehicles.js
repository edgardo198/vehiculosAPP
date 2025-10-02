import api from '../api/client';

export const listVehicles = async () => {
  const r = await api.get('/vehicles');
  // Garantiza arreglo aunque algo falle río arriba
  return Array.isArray(r.data) ? r.data : [];
};

export const getVehicle = (id) => api.get(`/vehicles/${id}`).then(r => r.data);
export const createVehicle = (data) => api.post('/vehicles', data).then(r => r.data);
export const updateVehicle = (id, data) => api.put(`/vehicles/${id}`, data).then(r => r.data);
export const deleteVehicle = (id) => api.delete(`/vehicles/${id}`);

