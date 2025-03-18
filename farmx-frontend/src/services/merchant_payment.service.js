import api from "./api";

export const merchantPaymentService = {
  create: (data) => api.post("/merchant-payments", data),
  update: (id, data) => api.put(`/merchant-payments/${id}`, data),
  delete: (id) => api.delete(`/merchant-payments/${id}`),
  getByMerchant: (merchantId, dateFilter = {}) =>
    api
      .get(`/merchant-payments/merchant/${merchantId}`, {
        params: dateFilter,
      })
      .then((response) => {
        return {
          data: {
            payments: response.data.payments || [],
            totals: response.data.totals || {
              total_receivable: 0,
              total_received: 0,
              balance: 0,
            },
          },
        };
      }),
};
