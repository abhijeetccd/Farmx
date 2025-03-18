import api from "./api";

export const merchantTransactionService = {
  getAll: (filters) => api.get("/merchant-transactions", { params: filters }),

  getById: (id) => api.get(`/merchant-transactions/${id}`),

  create: (data) => api.post("/merchant-transactions", data),

  update: (id, data) => api.put(`/merchant-transactions/${id}`, data),

  delete: (id) => api.delete(`/merchant-transactions/${id}`),

  getByMerchant: (merchantId, filters) =>
    api.get(`/merchant-transactions/merchant/${merchantId}`, {
      params: filters,
    }),
};
