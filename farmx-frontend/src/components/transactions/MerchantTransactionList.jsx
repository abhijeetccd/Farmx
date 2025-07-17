import { useState, useEffect } from "react";
import { merchantTransactionService } from "../../services/merchant_transaction.service";
import { merchantService } from "../../services/merchant.service";
import MerchantExpenses from "./MerchantExpenses";
import { merchantExpenseService } from "../../services/merchant_expense.service";
import { PrinterIcon } from "@heroicons/react/24/outline";
import PrintPreviewModal from "./PrintPreviewModal";
import { calculateTotals } from "../../utils/transactionCalculations";
import { merchantCommissionService } from "../../services/merchant_commission.service";

const MerchantTransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [merchants, setMerchants] = useState([]);
  const [filters, setFilters] = useState({
    vendor_id: "",
    start_date: new Date().toISOString().split("T")[0],
    end_date: new Date().toISOString().split("T")[0],
  });
  const [expenses, setExpenses] = useState([]);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [commission, setCommission] = useState(null);

  // Initialize totals
  const [totals, setTotals] = useState({
    bags: 0,
    weight: 0,
    deduction: 0,
    net_weight: 0,
    amount: 0,
    expenses: 0,
    final_amount: 0,
    commission: 0,
    final_total: 0,
  });

  const fetchMerchants = async () => {
    try {
      const response = await merchantService.getAll();
      setMerchants(response.data);
    } catch (err) {
      console.error("Error fetching merchants:", err);
      setError("व्यापारी माहिती लोड करण्यात अयशस्वी");
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await merchantTransactionService.getAll(filters);
      setTransactions(response.data);

      // Calculate totals only if there are transactions
      if (response.data.length > 0) {
        const calculatedTotals = calculateTotals(response.data);
        setTotals(calculatedTotals);
      } else {
        // Reset totals if no transactions
        setTotals({
          bags: 0,
          weight: 0,
          deduction: 0,
          net_weight: 0,
          amount: 0,
          expenses: 0,
          final_amount: 0,
          commission: 0,
          final_total: 0,
        });
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError("व्यवहार माहिती लोड करण्यात अयशस्वी");
    } finally {
      setLoading(false);
    }
  };

  const fetchExpenses = async () => {
    if (!filters.vendor_id || !filters.start_date) return;

    try {
      const response = await merchantExpenseService.getByMerchantAndDate(
        filters.vendor_id,
        filters.start_date
      );
      setExpenses(response.data);
    } catch (err) {
      console.error("Error fetching expenses:", err);
      setError("खर्च माहिती लोड करण्यात अयशस्वी");
    }
  };

  const fetchCommission = async () => {
    if (!filters.vendor_id || !filters.start_date || !areDatesEqual()) return;
    try {
      const response = await merchantCommissionService.getByMerchantAndDate(
        filters.vendor_id,
        filters.start_date
      );
      setCommission(response.data);
    } catch (err) {
      console.error("Error fetching commission:", err);
    }
  };

  useEffect(() => {
    fetchMerchants();
    fetchCommission();
  }, []);

  useEffect(() => {
    fetchTransactions();
    fetchCommission();
  }, [filters]);

  useEffect(() => {
    if (filters.vendor_id) {
      fetchExpenses();
      fetchCommission();
    }
  }, [filters.vendor_id, filters.start_date]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add this function to calculate expense totals
  const calculateExpenseTotal = () => {
    return expenses.reduce(
      (total, expense) => total + (parseFloat(expense.amount) || 0),
      0
    );
  };

  const expenseTotal = calculateExpenseTotal();

  const handleExpenseChange = async (expenseData) => {
    try {
      // Only proceed if we have a merchant selected
      if (!filters.vendor_id) {
        setError("कृपया व्यापारी निवडा");
        return;
      }

      // Validate items
      if (expenseData.items && expenseData.items.length > 0) {
        await merchantExpenseService.create({
          ...expenseData,
          vendor_id: parseInt(filters.vendor_id),
          date: filters.start_date,
        });
        await fetchExpenses();
      }
    } catch (err) {
      console.error("Error saving expenses:", err);
      setError(err.response?.data?.message || "खर्च जतन करण्यात अयशस्वी");
    }
  };

  // Add this function to check if merchant is selected
  const isMerchantSelected = Boolean(filters.vendor_id);

  // Add this function to get selected merchant name
  const getSelectedMerchantName = () => {
    const merchant = merchants.find(
      (m) => m.id === parseInt(filters.vendor_id)
    );
    return merchant?.name || "";
  };

  // Get selected merchant
  const selectedMerchant = merchants.find(
    (m) => m.id === parseInt(filters.vendor_id)
  );

  // Add save/update function
  const handleCommissionSave = async () => {
    if (!areDatesEqual()) {
      setError("कमिशन फक्त एकाच दिवसासाठी जतन करू शकता");
      return;
    }

    try {
      const commissionData = {
        vendor_id: parseInt(filters.vendor_id),
        date: filters.start_date,
        amount: totals.commission,
        weight: totals.weight,
      };

      if (commission) {
        await merchantCommissionService.update(commission.id, commissionData);
      } else {
        await merchantCommissionService.create(commissionData);
      }

      await fetchCommission();
    } catch (err) {
      console.error("Error saving commission:", err);
      setError("कमिशन जतन करण्यात अयशस्वी");
    }
  };

  // Add a function to check if dates are same
  const areDatesEqual = () => {
    return filters.start_date === filters.end_date;
  };

  if (loading) return <div className="text-center py-4">लोड करत आहे...</div>;
  if (error)
    return <div className="text-red-500 text-center py-4">{error}</div>;

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col">
      {/* Header with Filters */}
      <div className="px-4 py-4 border-b bg-white sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">व्यापारी व्यवहार</h1>
          {isMerchantSelected && transactions.length > 0 && (
            <button
              onClick={() => setShowPrintModal(true)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <PrinterIcon className="h-5 w-5 mr-2" />
              प्रिंट करा
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              व्यापारी
            </label>
            <select
              name="vendor_id"
              value={filters.vendor_id}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">सर्व व्यापारी</option>
              {merchants.map((merchant) => (
                <option key={merchant.id} value={merchant.id}>
                  {merchant.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              पासून
            </label>
            <input
              type="date"
              name="start_date"
              value={filters.start_date}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              पर्यंत
            </label>
            <input
              type="date"
              name="end_date"
              value={filters.end_date}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto p-4">
        {/* Transactions Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    अनु
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    दिनांक
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    व्यापारी
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    शेतकरी
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    डाग
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    वजन
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    घट
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    पक्के
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    भाव
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    रक्कम
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    शेरा
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction, index) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(transaction.date).toLocaleDateString("mr-IN")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.merchant?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.farmer_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.bags}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.weight}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.deduction}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.net_weight}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{transaction.rate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{transaction.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.remarks}
                    </td>
                  </tr>
                ))}

                {/* Totals Row */}
                {transactions.length > 0 && (
                  <tr className="bg-gray-50 font-semibold">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      एकूण
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {totals?.bags?.toFixed(0) || "0"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {totals?.weight?.toFixed(2) || "0.00"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {totals?.deduction?.toFixed(2) || "0.00"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {totals?.net_weight?.toFixed(2) || "0.00"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{totals?.amount?.toFixed(2) || "0.00"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"></td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* Final Totals */}
        {transactions.length > 0 && (
          <div className="bg-white rounded-lg shadow p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500">एकूण रक्कम</div>
                <div className="mt-1 text-xl font-semibold text-gray-900">
                  ₹{totals?.amount?.toFixed(2) || "0.00"}
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500">एकूण खर्च</div>
                <div className="mt-1 text-xl font-semibold text-gray-900">
                  ₹{expenseTotal?.toFixed(2) || "0.00"}
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  {expenses.length} खर्च नोंदी
                </div>
              </div>

              {/* Commission Card - Only show when dates are same */}
              {areDatesEqual() && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500">कमिशन</div>
                  <div className="mt-1 text-xl font-semibold text-gray-900">
                    ₹{totals?.commission?.toFixed(2) || "0.00"}
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    ({totals?.weight?.toFixed(2) || "0.00"} kg × ₹0.8)
                  </div>
                  {filters.vendor_id && (
                    <button
                      onClick={handleCommissionSave}
                      className="mt-2 px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                      {commission ? "अपडेट करा" : "जतन करा"}
                    </button>
                  )}
                </div>
              )}

              {/* Final Amount Card */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500">एकूण देय रक्कम</div>
                <div className="mt-1 text-2xl font-bold text-blue-600">
                  ₹
                  {(
                    (totals?.amount || 0) +
                    (expenseTotal || 0) +
                    (areDatesEqual() ? totals?.commission || 0 : 0)
                  ) // Only add commission if dates are same
                    .toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Expenses Section */}
        {transactions.length > 0 && isMerchantSelected && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-4 py-2 border-b">
              <h2 className="text-lg font-semibold text-gray-800">
                {getSelectedMerchantName()} - खर्च विवरण (
                {new Date(filters.start_date).toLocaleDateString("mr-IN")})
              </h2>
            </div>

            <MerchantExpenses
              expenses={expenses}
              onRefresh={fetchExpenses}
              date={filters.start_date}
              merchantId={filters.vendor_id}
            />
          </div>
        )}
        {/* Messages */}
        {transactions.length > 0 && !isMerchantSelected && (
          <div className="bg-white rounded-lg shadow p-4 text-center text-gray-500">
            खर्च पाहण्यासाठी व्यापारी निवडा
          </div>
        )}
        {transactions.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg">कोणताही व्यवहार आढळला नाही</p>
          </div>
        )}
      </div>

      {/* Add Print Modal */}
      <PrintPreviewModal
        isOpen={showPrintModal}
        onClose={() => setShowPrintModal(false)}
        transactions={transactions}
        expenses={expenses}
        merchant={selectedMerchant}
        date={filters.start_date}
        totals={totals}
        expenseTotal={expenseTotal}
        finalTotal={totals.final_total + expenseTotal + totals.amount}
      />
    </div>
  );
};

export default MerchantTransactionList;
