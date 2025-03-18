import React, { useState, useEffect } from "react";
import { dashboardService } from "../../services/dashboard.service";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    stats: {
      totalBags: 0,
      totalWeight: 0,
      farmerAmount: 0,
      merchantAmount: 0,
    },
    farmerTransactions: [],
    merchantTransactions: [],
    commission_stats: {
      total_yearly_commission: 0,
      merchant_wise_commission: [],
    },
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await dashboardService.getTodayStats();
      setData(response.data);
      setError(null);
    } catch (err) {
      setError("माहिती लोड करण्यात अयशस्वी");
      console.error("Dashboard data error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-4">लोड करत आहे...</div>;
  if (error)
    return <div className="text-center text-red-500 py-4">{error}</div>;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-2 md:gap-4 p-2 md:p-4 mx-auto max-w-7xl">
        <div className="bg-white rounded-lg shadow p-3 md:p-6 flex flex-col items-center justify-center">
          <h3 className="text-gray-500 text-xs md:text-base lg:text-lg font-medium text-center">
            एकूण डाग
          </h3>
          <p className="text-sm md:text-2xl lg:text-3xl font-bold my-1 md:my-2">
            {data.stats.totalBags}
          </p>
          <h4 className="text-gray-500 text-xs md:text-sm text-center">आज</h4>
        </div>

        <div className="bg-white rounded-lg shadow p-3 md:p-6 flex flex-col items-center justify-center">
          <h3 className="text-gray-500 text-xs md:text-base lg:text-lg font-medium text-center">
            शेतकरी
          </h3>
          <p className="text-sm md:text-2xl lg:text-3xl font-bold my-1 md:my-2">
            ₹{data.stats.farmerAmount.toFixed(2)}
          </p>
          <h4 className="text-gray-500 text-xs md:text-sm text-center">आज</h4>
        </div>

        <div className="bg-white rounded-lg shadow p-3 md:p-6 flex flex-col items-center justify-center">
          <h3 className="text-gray-500 text-xs md:text-base lg:text-lg font-medium text-center">
            व्यापारी
          </h3>
          <p className="text-sm md:text-2xl lg:text-3xl font-bold my-1 md:my-2">
            ₹{data.stats.merchantAmount.toFixed(2)}
          </p>
          <h4 className="text-gray-500 text-xs md:text-sm text-center">आज</h4>
        </div>
        <div className="bg-white rounded-lg shadow p-3 md:p-6 flex flex-col items-center justify-center">
          <h3 className="text-gray-500 text-xs md:text-base lg:text-lg font-medium text-center">
            वार्षिक कमिशन
          </h3>
          <p className="text-sm md:text-2xl lg:text-3xl font-bold my-1 md:my-2">
            ₹{data.commission_stats.total_yearly_commission.toFixed(2)}
          </p>
          <h4 className="text-gray-500 text-xs md:text-sm text-center">
            {new Date().getFullYear()}
          </h4>
        </div>
      </div>

      {/* Add Commission Card */}
      {/* <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900">वार्षिक कमिशन</h3>
            <p className="mt-1 text-3xl font-semibold text-blue-600">
              ₹{data.commission_stats.total_yearly_commission.toFixed(2)}
            </p>
          </div>
        </div>
      </div> */}

      {/* Transactions Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Farmer Transactions */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">आजचे शेतकरी व्यवहार</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    शेतकरी
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    डाग
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    वजन
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    रक्कम
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.farmerTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4">{transaction.vendor.name}</td>
                    <td className="px-6 py-4">{transaction.bags}</td>
                    <td className="px-6 py-4">{transaction.weight}</td>
                    <td className="px-6 py-4">₹{transaction.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Merchant Transactions */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">आजचे व्यापारी व्यवहार</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    व्यापारी
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    डाग
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    वजन
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    रक्कम
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.merchantTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4">{transaction.merchant.name}</td>
                    <td className="px-6 py-4">{transaction.bags}</td>
                    <td className="px-6 py-4">{transaction.weight}</td>
                    <td className="px-6 py-4">₹{transaction.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Merchant-wise Commission Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            व्यापारी निहाय कमिशन
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  व्यापारी
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  एकूण वजन
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  एकूण कमिशन
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.commission_stats.merchant_wise_commission.map((stat) => (
                <tr key={stat.merchant_id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {stat.merchant_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {stat.total_weight.toFixed(2)} kg
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₹{stat.total_commission.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
