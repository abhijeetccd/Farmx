import api from "./api";

export const dashboardService = {
  getTodayStats: () => api.get("/dashboard/today-stats"),
};
