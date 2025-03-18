import api from "./api";

export const transactionService = {
  getAll: (params) => api.get("/transactions", { params }),

  getAllFarmerTransactions: () =>
    api.get("/transactions", { params: { vendor_type: "farmer" } }),

  getAllMerchantTransactions: () =>
    api.get("/transactions", { params: { vendor_type: "merchant" } }),

  getById: (id) => api.get(`/transactions/${id}`),

  create: (data) => api.post("/transactions", data),

  update: (id, data) => {
    const { id: _, ...updateData } = data;
    return api.put(`/transactions/${id}`, updateData);
  },

  delete: (id) => api.delete(`/transactions/${id}`),

  updatePaymentStatus: (id, status) =>
    api.patch(`/transactions/${id}/payment-status`, { payment_status: status }),
};
