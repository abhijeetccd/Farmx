import { useState, useEffect } from "react";
import { farmerService } from "../../services/farmer.service";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import VendorForm from "../vendors/VendorForm";
import ConfirmationModal from "../common/ConfirmationModal";
import {
  EllipsisVerticalIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { Menu } from "@headlessui/react";

const FarmerList = () => {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [farmerToDelete, setFarmerToDelete] = useState(null);

  const fetchFarmers = async () => {
    try {
      const response = await farmerService.getAll();
      setFarmers(response.data);
      setError(null);
    } catch (err) {
      setError("शेतकरी माहिती लोड करण्यात अयशस्वी");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarmers();
  }, []);

  const handleDeleteClick = (farmer) => {
    setFarmerToDelete(farmer);
    setShowDeleteConfirmation(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await farmerService.delete(farmerToDelete.id);
      fetchFarmers();
    } catch (err) {
      setError("शेतकरी काढून टाकण्यात अयशस्वी");
    }
  };

  const filteredFarmers = farmers.filter(
    (farmer) =>
      farmer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (farmer.phone_no && farmer.phone_no.includes(searchQuery)) ||
      (farmer.account_no && farmer.account_no.includes(searchQuery))
  );

  const handleFormClose = () => {
    setSelectedFarmer(null);
    setShowForm(false);
  };

  const handleEdit = (farmer) => {
    setSelectedFarmer(farmer);
    setShowForm(true);
  };

  if (loading) return <div className="text-center py-4">लोड करत आहे...</div>;
  if (error)
    return <div className="text-red-500 text-center py-4">{error}</div>;

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col">
      {/* Header */}
      <div className="px-4 py-4 border-b">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">शेतकरी यादी</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            नवीन शेतकरी
          </button>
        </div>

        {/* Search Bar */}
        <div className="mt-4">
          <div className="relative">
            <input
              type="text"
              placeholder="शेतकरी शोधा..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
          </div>
        </div>
      </div>

      {/* Table Container with Scroll */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  अनु
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  नाव
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  मोबाईल नंबर
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  खाते क्रमांक
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  पत्ता
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  कृती
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFarmers.map((farmer, index) => (
                <tr key={farmer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {farmer.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {farmer.phone_no || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {farmer.account_no || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {farmer.address || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Menu as="div" className="relative inline-block text-left">
                      <Menu.Button className="p-2 hover:bg-gray-100 rounded-full">
                        <EllipsisVerticalIcon className="h-5 w-5 text-gray-500" />
                      </Menu.Button>
                      <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => handleEdit(farmer)}
                              className={`${
                                active ? "bg-gray-100" : ""
                              } flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                            >
                              <PencilSquareIcon className="h-4 w-4 mr-2" />
                              संपादित करा
                            </button>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => handleDeleteClick(farmer)}
                              className={`${
                                active ? "bg-red-50" : ""
                              } flex items-center w-full px-4 py-2 text-sm text-red-600`}
                            >
                              <TrashIcon className="h-4 w-4 mr-2" />
                              काढून टाका
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Menu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* No Results Message */}
          {filteredFarmers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">कोणताही शेतकरी आढळला नाही</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={handleDeleteConfirm}
        title="शेतकरी काढून टाका"
        message={
          farmerToDelete
            ? `तुम्हाला खात्री आहे की तुम्ही "${farmerToDelete.name}" यांना काढून टाकू इच्छिता?`
            : ""
        }
        confirmText="काढून टाका"
        cancelText="रद्द करा"
        type="danger"
      />

      {/* Form Modal */}
      <VendorForm
        isOpen={showForm}
        onClose={handleFormClose}
        onSuccess={() => {
          handleFormClose();
          fetchFarmers();
        }}
        editData={selectedFarmer}
        vendorType="farmer"
      />
    </div>
  );
};

export default FarmerList;
