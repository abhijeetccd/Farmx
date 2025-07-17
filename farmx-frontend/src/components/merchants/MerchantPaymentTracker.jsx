import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { merchantService } from "../../services/merchant.service";
import { merchantPaymentService } from "../../services/merchant_payment.service";
import {
  PencilSquareIcon,
  TrashIcon,
  PrinterIcon,
} from "@heroicons/react/24/outline";
import { printPaymentReport } from "../../utils/printUtils";

const MerchantPaymentTracker = () => {
  const { merchantId } = useParams();
  const [merchant, setMerchant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateFilter, setDateFilter] = useState(() => {
    const today = new Date();
    const fifteenDaysAgo = new Date();
    fifteenDaysAgo.setDate(today.getDate() - 15);

    return {
      from: fifteenDaysAgo.toISOString().split("T")[0],
      to: today.toISOString().split("T")[0],
    };
  });
  const [paymentData, setPaymentData] = useState({
    payments: [],
    totals: {
      total_receivable: 0,
      total_received: 0,
      balance: 0,
    },
  });
  const [newPayment, setNewPayment] = useState({
    amount: "",
    date: new Date().toISOString().split("T")[0],
    type: "जमा",
    // payment_mode: "cash",
    // remarks: "",
  });
  const [editingPayment, setEditingPayment] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState(null);

  useEffect(() => {
    fetchMerchantDetails();
    fetchPayments();
  }, [merchantId, dateFilter]);

  const fetchMerchantDetails = async () => {
    try {
      const response = await merchantService.getById(merchantId);
      setMerchant(response.data);
    } catch (err) {
      setError("व्यापारी माहिती लोड करण्यात अयशस्वी");
      console.error(err);
    }
  };

  const fetchPayments = async () => {
    try {
      const response = await merchantPaymentService.getByMerchant(
        merchantId,
        dateFilter
      );
      setPaymentData(response.data);
    } catch (err) {
      console.error(err);
      setError("पेमेंट माहिती लोड करण्यात अयशस्वी");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    try {
      await merchantPaymentService.create({
        ...newPayment,
        vendor_id: merchantId,
      });
      await fetchPayments();
      setNewPayment({
        amount: "",
        date: new Date().toISOString().split("T")[0],
        type: "जमा",
        // payment_mode: "cash",
        // remarks: "",
      });
    } catch (err) {
      setError("पेमेंट जतन करण्यात अयशस्वी");
      console.error(err);
    }
  };

  const handleEdit = (payment) => {
    setEditingPayment(payment);
    setNewPayment({
      amount: payment.amount,
      date: payment.date,
      type: payment.type,
      //   payment_mode: payment.payment_mode,
      //   remarks: payment.remarks || "",
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await merchantPaymentService.update(editingPayment.id, {
        ...newPayment,
        vendor_id: merchantId,
      });
      await fetchPayments();
      setEditingPayment(null);
      setNewPayment({
        amount: "",
        date: new Date().toISOString().split("T")[0],
        type: "जमा",
        // payment_mode: "cash",
        // remarks: "",
      });
    } catch (err) {
      setError("पेमेंट अपडेट करण्यात अयशस्वी");
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      await merchantPaymentService.delete(paymentToDelete.id);
      await fetchPayments();
      setShowDeleteConfirm(false);
      setPaymentToDelete(null);
    } catch (err) {
      setError("पेमेंट हटविण्यात अयशस्वी");
      console.error(err);
    }
  };

  // Group payments by date
  const groupedPayments = paymentData.payments.reduce((acc, payment) => {
    const date = payment.date;
    if (!acc[date]) {
      acc[date] = { जमा: 0, नावे: 0, जमा_date: null, नावे_date: null };
    }
    if (payment.type === "जमा") {
      acc[date].जमा += parseFloat(payment.amount);
      acc[date].जमा_date = payment.date;
    } else {
      acc[date].नावे += parseFloat(payment.amount);
      acc[date].नावे_date = payment.date;
    }
    return acc;
  }, {});

  const handlePrint = () => {
    printPaymentReport(paymentData, merchant, dateFilter);
  };

  if (loading) return <div className="text-center py-4">लोड करत आहे...</div>;
  if (error)
    return <div className="text-center text-red-500 py-4">{error}</div>;

  return (
    <div className="space-y-6">
      {/* Merchant Details Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {merchant?.name} - जमा नावे विवरण
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          मोबाईल: {merchant?.phone_no}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900">एकूण नावे</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">
            ₹{paymentData.totals.total_receivable.toFixed(2)}
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900">एकूण जमा</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">
            ₹{paymentData.totals.total_received.toFixed(2)}
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900">शिल्लक</h3>
          <p
            className={`mt-2 text-3xl font-bold ${
              paymentData.totals.balance < 0 ? "text-red-600" : "text-green-600"
            }`}
          >
            ₹{paymentData.totals.balance.toFixed(2)}
          </p>
        </div>
      </div>

      {/* New/Edit Payment Form */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {editingPayment ? "पेमेंट संपादित करा" : "नवीन पेमेंट"}
        </h3>
        <form
          onSubmit={editingPayment ? handleUpdate : handlePaymentSubmit}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                रक्कम
              </label>
              <input
                type="number"
                value={newPayment.amount}
                onChange={(e) =>
                  setNewPayment({ ...newPayment, amount: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                दिनांक
              </label>
              <input
                type="date"
                value={newPayment.date}
                onChange={(e) =>
                  setNewPayment({ ...newPayment, date: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                प्रकार
              </label>
              <select
                value={newPayment.type}
                onChange={(e) =>
                  setNewPayment({ ...newPayment, type: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="नावे">नावे</option>
                <option value="जमा">जमा</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            {editingPayment && (
              <button
                type="button"
                onClick={() => {
                  setEditingPayment(null);
                  setNewPayment({
                    amount: "",
                    date: new Date().toISOString().split("T")[0],
                    type: "जमा",
                    payment_mode: "cash",
                    remarks: "",
                  });
                }}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
              >
                रद्द करा
              </button>
            )}
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              {editingPayment ? "अपडेट करा" : "जतन करा"}
            </button>
          </div>
        </form>
      </div>

      {/* Date Filter and Print Button */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">पेमेंट इतिहास</h3>
          <div className="flex items-center space-x-4">
            <div className="flex space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  पासून
                </label>
                <input
                  type="date"
                  value={dateFilter.from}
                  onChange={(e) =>
                    setDateFilter({ ...dateFilter, from: e.target.value })
                  }
                  className="block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  पर्यंत
                </label>
                <input
                  type="date"
                  value={dateFilter.to}
                  onChange={(e) =>
                    setDateFilter({ ...dateFilter, to: e.target.value })
                  }
                  className="block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>
            <button
              onClick={handlePrint}
              className="bg-blue-600 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
            >
              <PrinterIcon className="h-5 w-5" />
              <span>प्रिंट करा</span>
            </button>
          </div>
        </div>
      </div>

      {/* Payment History Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  दिनांक
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  जमा दिनांक
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  जमा रक्कम
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  नावे रक्कम
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  नावे दिनांक
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  कृती
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paymentData.payments.map((payment) => (
                <tr key={payment.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(payment.date).toLocaleDateString("mr-IN")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.type === "जमा" &&
                      new Date(payment.date).toLocaleDateString("mr-IN")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                    {payment.type === "जमा" &&
                      `₹${parseFloat(payment.amount).toFixed(2)}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                    {payment.type === "नावे" &&
                      `₹${parseFloat(payment.amount).toFixed(2)}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.type === "नावे" &&
                      new Date(payment.date).toLocaleDateString("mr-IN")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(payment)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      <PencilSquareIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => {
                        setPaymentToDelete(payment);
                        setShowDeleteConfirm(true);
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-sm mx-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              पेमेंट हटवायचे आहे का?
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              हे पेमेंट कायमचे हटवले जाईल.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setPaymentToDelete(null);
                }}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
              >
                रद्द करा
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                हटवा
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MerchantPaymentTracker;
