import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white text-center py-4">
      <p className="text-sm">
        © {new Date().getFullYear()} FarmX. All rights reserved.
      </p>
      <p className="text-sm">
        Contact:{" "}
        <a href="tel:9921410715" className="text-blue-400">
          9921410715
        </a>
      </p>
      <p className="text-sm">Designed and Developed by Sanket Gaikwad</p>
      <p className="text-sm">
        <a href="/privacy-policy" className="text-blue-400">
          Privacy Policy
        </a>{" "}
        |
        <a href="/terms-and-conditions" className="text-blue-400">
          {" "}
          Terms & Conditions
        </a>
      </p>
    </footer>
  );
};

export default Footer;
