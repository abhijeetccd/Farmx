import api from "./api";

export const vendorService = {
  create: (data) => api.post("/vendors", data),
  getAll: () => api.get("/vendors"),
  getById: (id) => api.get(`/vendors/${id}`),
  update: (id, data) => api.put(`/vendors/${id}`, data),
  delete: (id) => api.delete(`/vendors/${id}`),
  getByType: (type) => api.get(`/vendors/type/${type}`),
};
