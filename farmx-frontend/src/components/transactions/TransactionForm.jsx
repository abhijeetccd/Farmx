import { useState, useEffect } from "react";
import { transactionService } from "../../services/transaction.service";
import { farmerService } from "../../services/farmer.service";
import { merchantService } from "../../services/merchant.service";
import Modal from "../common/Modal";

const TransactionForm = ({ isOpen, onClose, onSuccess, editData = null }) => {
  const initialState = {
    date: new Date().toISOString().split("T")[0],
    vendor_id: "",
    amount: "",
    payment_status: "pending",
    description: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [vendors, setVendors] = useState({ farmers: [], merchants: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setFormData(editData || initialState);
      fetchVendors();
    }
  }, [isOpen, editData]);

  const fetchVendors = async () => {
    try {
      const [farmers, merchants] = await Promise.all([
        farmerService.getAll(),
        merchantService.getAll(),
      ]);
      setVendors({
        farmers: farmers.data,
        merchants: merchants.data,
      });
    } catch (err) {
      setError("व्यापारी माहिती लोड करण्यात अयशस्वी");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (editData) {
        await transactionService.update(editData.id, formData);
      } else {
        await transactionService.create(formData);
      }
      setFormData(initialState);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          (editData
            ? "व्यवहार अपडेट करण्यात अयशस्वी"
            : "व्यवहार जोडण्यात अयशस्वी")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editData ? "व्यवहार संपादित करा" : "नवीन व्यवहार"}
    >
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            दिनांक *
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            व्यक्ती *
          </label>
          <select
            name="vendor_id"
            value={formData.vendor_id}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            required
          >
            <option value="">निवडा</option>
            {vendors.farmers.length > 0 && (
              <optgroup label="शेतकरी">
                {vendors.farmers.map((farmer) => (
                  <option key={farmer.id} value={farmer.id}>
                    {farmer.name}
                  </option>
                ))}
              </optgroup>
            )}
            {vendors.merchants.length > 0 && (
              <optgroup label="व्यापारी">
                {vendors.merchants.map((merchant) => (
                  <option key={merchant.id} value={merchant.id}>
                    {merchant.name}
                  </option>
                ))}
              </optgroup>
            )}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            रक्कम *
          </label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            required
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            स्थिती *
          </label>
          <select
            name="payment_status"
            value={formData.payment_status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            required
          >
            <option value="pending">बाकी</option>
            <option value="paid">पूर्ण</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            टीप
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            rows="3"
          />
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:text-gray-900"
          >
            रद्द करा
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "जतन करत आहे..." : "जतन करा"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TransactionForm;
