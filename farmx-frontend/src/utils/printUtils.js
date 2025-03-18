export const printPaymentReport = (data, merchant, dateFilter) => {
  const printWindow = window.open("", "_blank");
  printWindow.document.write(`
    <html>
      <head>
        <title>Payment Report - ${merchant?.name}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
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
            <strong>एकूण जमा:</strong> ₹${data.totals.total_received.toFixed(2)}
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
