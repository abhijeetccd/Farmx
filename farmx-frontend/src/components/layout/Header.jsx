import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Logo from "./Logo";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "डॅशबोर्ड", href: "/" },
    { name: "शेतकरी", href: "/farmers" },
    { name: "व्यापारी", href: "/merchants" },
    { name: "व्यवहार", href: "/transactions" },
  ];

  return (
    <header className="bg-white shadow-md relative z-50">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex w-full items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Logo />
              <span className="ml-2 text-xl font-bold text-gray-900">
                FarmX
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-base font-medium ${
                  location.pathname === item.href
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-gray-900"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:text-gray-900"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation - Overlay */}
        <div
          className={`fixed inset-0 backdrop-blur-sm bg-black/30 transition-opacity md:hidden z-40 ${
            isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Mobile Navigation - Sidebar */}
        <div
          className={`fixed top-0 left-0 bottom-0 w-64 bg-white transform transition-transform duration-300 ease-in-out md:hidden z-50 ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-4 border-b border-blue-500/30">
            <div className="flex items-center">
              <Logo className="text-white" />
              <span className="ml-2 text-xl font-bold text-black">FarmX</span>
            </div>
          </div>
          <div className="p-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block py-2 text-black font-medium ${
                  location.pathname === item.href
                    ? "text-white bg-blue-700/50 rounded px-3"
                    : "text-black hover:text-white hover:bg-blue-700/30 rounded px-3"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
