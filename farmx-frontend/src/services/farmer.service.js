import api from "./api";

export const farmerService = {
  getAll: () => api.get("/vendors?type=farmer"),

  getById: (id) => api.get(`/vendors/${id}`),

  create: (data) => api.post("/vendors", { ...data, type: "farmer" }),

  update: (id, data) => {
    const { id: _, ...updateData } = data;
    return api.put(`/vendors/${id}`, { ...updateData, type: "farmer" });
  },

  delete: (id) => api.delete(`/vendors/${id}`),

  search: (query) =>
    api.get(`/vendors/search`, { params: { query, type: "farmer" } }),

  getTransactions: (farmerId) =>
    api.get(`/transactions`, { params: { vendor_id: farmerId } }),

  getPendingAmount: (farmerId) =>
    api.get(`/transactions/pending-amount/${farmerId}`),
};
