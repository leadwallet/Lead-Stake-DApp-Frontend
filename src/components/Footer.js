import React from "react";

export default () => {
  return (
    <div className="py-8 footer-bg">
      <footer className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <div className="logo hidden lg:flex flex-row items-center">
            <img
              src="/images/logo.svg"
              width="40"
              className="cursor-pointer"
              alt="LEAD"
            />
            <div className="font-Montserrat-ExtraBold text-white text-4xl ml-2">
              LEAD
            </div>
          </div>
          <div className="text-white leading-7 text-xs cursor-pointer">
            <div className="font-Montserrat-ExtraBold uppercase">Products</div>
            <div>Business Console</div>
            <div>Settlement Layer</div>
            <div>Crypto Wallets</div>
            <div>LEAD Pride</div>
          </div>
          <div className="text-white leading-7 text-xs cursor-pointer">
            <div className="font-Montserrat-ExtraBold uppercase">About Us</div>
            <div>Project</div>
            <div>Team</div>
            <div>Ecosystem</div>
            <div>The Token</div>
          </div>
          <div className="text-white leading-7 text-xs cursor-pointer">
            <div className="font-Montserrat-ExtraBold uppercase">Solutions</div>
            <div>Grow Your Business with our Monetization</div>
            <div>Technology</div>
            <div>The PSP Solution</div>
            <div>Use Your Cryptocurrency</div>
          </div>
          <div className="text-white leading-7 text-xs cursor-pointer">
            <div className="font-Montserrat-ExtraBold uppercase">
              Documentation
            </div>
            <div>API Documentation</div>
            <div>Whitepaper</div>
            <div>Legal</div>
            <div>Privacy Policy</div>
            <div>Terms & Conditions</div>
          </div>
        </div>
      </footer>
    </div>
  );
};
