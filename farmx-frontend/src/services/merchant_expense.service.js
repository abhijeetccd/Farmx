import api from "./api";

export const merchantExpenseService = {
  getAll: (params) => api.get("/merchant-expenses", { params }),

  create: (data) => api.post("/merchant-expenses", data),

  update: (id, data) => api.put(`/merchant-expenses/${id}`, data),

  delete: (id) => api.delete(`/merchant-expenses/${id}`),

  getByMerchantAndDate: (merchantId, date) =>
    api.get(`/merchant-expenses/merchant/${merchantId}/date/${date}`),
};
