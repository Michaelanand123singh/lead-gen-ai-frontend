// frontend/src/components/common/Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-500">
            © 2024 Website Analyzer. All rights reserved.
          </div>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href="#" className="text-sm text-gray-500 hover:text-gray-700">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-700">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-700">
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;