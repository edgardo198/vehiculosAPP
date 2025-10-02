import api from '../api/client';

export const listMovements = (params) => api.get('/movements', { params }).then(r => r.data);
export const createMovement = (data) => api.post('/movements', data).then(r => r.data);
