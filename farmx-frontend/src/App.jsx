import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import DashboardPage from "./pages/DashboardPage";
import FarmersPage from "./pages/FarmersPage";
import MerchantsPage from "./pages/MerchantsPage";
import TransactionsPage from "./pages/TransactionsPage";
import MerchantPaymentTracker from "./components/merchants/MerchantPaymentTracker";
import Footer from "./components/Footer";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsAndConditions from "./components/TermsAndConditions";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <main className="py-8">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/farmers" element={<FarmersPage />} />
            <Route path="/merchants" element={<MerchantsPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route
              path="/merchant-payments/:merchantId"
              element={<MerchantPaymentTracker />}
            />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route
              path="/terms-and-conditions"
              element={<TermsAndConditions />}
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
