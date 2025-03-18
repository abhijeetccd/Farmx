import api from "./api";

export const merchantService = {
  getAll: () => api.get("/vendors?type=merchant"),

  getById: (id) => api.get(`/vendors/${id}`),

  create: (data) => api.post("/vendors", { ...data, type: "merchant" }),

  update: (id, data) => {
    const { id: _, ...updateData } = data;
    return api.put(`/vendors/${id}`, { ...updateData, type: "merchant" });
  },

  delete: (id) => api.delete(`/vendors/${id}`),

  search: (query) =>
    api.get(`/vendors/search`, { params: { query, type: "merchant" } }),

  getTransactions: (merchantId) =>
    api.get(`/transactions`, { params: { vendor_id: merchantId } }),

  getPendingAmount: (merchantId) =>
    api.get(`/transactions/pending-amount/${merchantId}`),
};
