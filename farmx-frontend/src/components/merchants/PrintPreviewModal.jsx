import React from "react";

const PrintPreviewModal = ({ isOpen, onClose, data, merchant, dateFilter }) => {
  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Payment Report - ${merchant?.name}</title>
          <style>
            body { font-family: Arial, sans-serif; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f3f4f6; }
            .header { margin-bottom: 20px; }
            .summary { margin: 20px 0; display: flex; justify-content: space-between; }
            .summary-item { padding: 10px; border: 1px solid #ddd; }
            @media print {
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>${merchant?.name} - जमा नावे विवरण</h2>
            <p>मोबाईल: ${merchant?.phone_no}</p>
            <p>दिनांक: ${new Date(dateFilter.from).toLocaleDateString(
              "mr-IN"
            )} ते ${new Date(dateFilter.to).toLocaleDateString("mr-IN")}</p>
          </div>

          <div class="summary">
            <div class="summary-item">
              <strong>एकूण नावे:</strong> ₹${data.totals.total_receivable.toFixed(
                2
              )}
            </div>
            <div class="summary-item">
              <strong>एकूण जमा:</strong> ₹${data.totals.total_received.toFixed(
                2
              )}
            </div>
            <div class="summary-item">
              <strong>शिल्लक:</strong> ₹${data.totals.balance.toFixed(2)}
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>दिनांक</th>
                <th>जमा दिनांक</th>
                <th>जमा रक्कम</th>
                <th>नावे रक्कम</th>
                <th>नावे दिनांक</th>
              </tr>
            </thead>
            <tbody>
              ${data.payments
                .map(
                  (payment) => `
                <tr>
                  <td>${new Date(payment.date).toLocaleDateString("mr-IN")}</td>
                  <td>${
                    payment.type === "जमा"
                      ? new Date(payment.date).toLocaleDateString("mr-IN")
                      : ""
                  }</td>
                  <td>${
                    payment.type === "जमा"
                      ? `₹${parseFloat(payment.amount).toFixed(2)}`
                      : ""
                  }</td>
                  <td>${
                    payment.type === "नावे"
                      ? `₹${parseFloat(payment.amount).toFixed(2)}`
                      : ""
                  }</td>
                  <td>${
                    payment.type === "नावे"
                      ? new Date(payment.date).toLocaleDateString("mr-IN")
                      : ""
                  }</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-4xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            प्रिंट पूर्वावलोकन
          </h3>
          <div className="space-x-2">
            <button
              onClick={handlePrint}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              प्रिंट करा
            </button>
            <button
              onClick={onClose}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
            >
              बंद करा
            </button>
          </div>
        </div>
        <iframe
          srcDoc={`
            <html>
              <head>
                <style>
                  body { font-family: Arial, sans-serif; padding: 20px; }
                  table { width: 100%; border-collapse: collapse; }
                  th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                  th { background-color: #f3f4f6; }
                </style>
              </head>
              <body>
                <!-- Preview content will be inserted here -->
              </body>
            </html>
          `}
          className="w-full h-[70vh] border-0"
        />
      </div>
    </div>
  );
};

export default PrintPreviewModal;
