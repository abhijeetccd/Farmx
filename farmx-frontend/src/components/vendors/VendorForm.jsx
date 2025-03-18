import { useState, useEffect } from "react";
import { farmerService } from "../../services/farmer.service";
import { merchantService } from "../../services/merchant.service";
import Modal from "../common/Modal";

const VendorForm = ({
  isOpen,
  onClose,
  onSuccess,
  editData = null,
  vendorType = "farmer",
}) => {
  const initialState = {
    name: "",
    phone_no: "",
    account_no: "",
    address: "",
    type: vendorType,
  };

  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const service = vendorType === "farmer" ? farmerService : merchantService;
  const vendorTitle = vendorType === "farmer" ? "शेतकरी" : "व्यापारी";

  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name || "",
        phone_no: editData.phone_no || "",
        account_no: editData.account_no || "",
        address: editData.address || "",
        type: editData.type || vendorType,
      });
    } else {
      setFormData({ ...initialState, type: vendorType });
    }
  }, [editData, vendorType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (editData) {
        await service.update(editData.id, formData);
      } else {
        await service.create(formData);
      }
      setFormData(initialState);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          (editData
            ? `${vendorTitle} अपडेट करण्यात अयशस्वी`
            : `${vendorTitle} जोडण्यात अयशस्वी`)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editData ? `${vendorTitle} संपादित करा` : `नवीन ${vendorTitle}`}
    >
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            नाव *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            मोबाईल नंबर
          </label>
          <input
            type="text"
            name="phone_no"
            value={formData.phone_no}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, phone_no: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            खाते क्रमांक
          </label>
          <input
            type="text"
            name="account_no"
            value={formData.account_no}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, account_no: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            पत्ता
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, address: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            className={`bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
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

export default VendorForm;
