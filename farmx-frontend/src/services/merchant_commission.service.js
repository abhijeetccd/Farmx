import api from "./api";

export const merchantCommissionService = {
  create: (data) => api.post("/merchant-commissions", data),
  update: (id, data) => api.put(`/merchant-commissions/${id}`, data),
  getByMerchantAndDate: (merchantId, date) =>
    api.get(`/merchant-commissions/merchant/${merchantId}/date/${date}`),
};
