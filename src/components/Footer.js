import React from "react";

export default () => {
  return (
    <div className="py-8 footer-bg">
      <footer className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
          <div>
            <a
              href="https://leadwallet.io/"
              className="logo flex flex-row items-center"
            >
              <img
                src="/images/full-logo-footer.png"
                width="220"
                className="cursor-pointer"
                alt="LEAD"
              />
            </a>
            <div className="uppercase text-white text-md mb-3 mt-4 text-left">
              Follow Us
            </div>
            <div className="flex flex-row items-center ">
              <a
                href="https://instagram.com/lead_wallet"
                target="_blank"
                rel="noopener noreferrer"
                className="mr-4"
              >
                <img src="/images/sm-instagram.svg" alt="" width="20" />
              </a>
              <a
                href="https://www.linkedin.com/company/leadwallet"
                target="_blank"
                rel="noopener noreferrer"
                className="mr-4"
              >
                <img src="/images/sm-linkedin.svg" alt="" width="20" />
              </a>
              <a
                href="https://twitter.com/leadwallet"
                target="_blank"
                rel="noopener noreferrer"
                className="mr-4"
              >
                <img src="/images/sm-twitter.svg" alt="" width="20" />
              </a>
              <a
                href="https://www.reddit.com/r/LeadWallet"
                target="_blank"
                rel="noopener noreferrer"
                className="mr-4"
              >
                <img src="/images/sm-reddit.svg" alt="" width="20" />
              </a>
              <a
                href="https://github.com/leadwallet"
                target="_blank"
                rel="noopener noreferrer"
                className="mr-4"
              >
                <img src="/images/sm-github.svg" alt="" width="20" />
              </a>
              <a
                href="https://medium.com/@LeadWallet"
                target="_blank"
                rel="noopener noreferrer"
                className="mr-4"
              >
                <img src="/images/sm-medium.svg" alt="" width="20" />
              </a>
              <a
                href="https://t.me/Leadwallet"
                target="_blank"
                rel="noopener noreferrer"
                className="mr-4"
              >
                <img src="/images/sm-telegram.svg" alt="" width="20" />
              </a>
              <a
                href="https://discord.gg/62Zh9Ch"
                target="_blank"
                rel="noopener noreferrer"
                className="mr-4"
              >
                <img src="/images/sm-discord.svg" alt="" width="20" />
              </a>
            </div>
          </div>
          {/* <div className="text-white leading-7 text-xs cursor-pointer">
            <div className="font-Montserrat-ExtraBold uppercase">Products</div>
            <div>Business Console</div>
            <div>Settlement Layer</div>
            <div>Crypto Wallets</div>
            <div>LEAD Pride</div>
          </div> */}
          <div className="text-white leading-7 text-xs cursor-pointer flex flex-col">
            <a
              href="https://www.leadwallet.io/about"
              className="font-Montserrat-ExtraBold uppercase"
            >
              About Us
            </a>
            {/* <div>Project</div> */}
            <a href="https://www.leadwallet.io/contact">Contact Us</a>
            <a href="https://www.leadwallet.io/team">Team</a>
            {/* <div>Ecosystem</div> */}
            <a href="https://www.leadwallet.io/token">The Token</a>
          </div>
          {/* <div className="text-white leading-7 text-xs cursor-pointer">
            <div className="font-Montserrat-ExtraBold uppercase">Solutions</div>
            <div>Grow Your Business with our Monetization</div>
            <div>Technology</div>
            <div>The PSP Solution</div>
            <div>Use Your Cryptocurrency</div>
          </div> */}
          <div className="text-white leading-7 text-xs cursor-pointer flex flex-col">
            <div className="font-Montserrat-ExtraBold uppercase">
              Documentation
            </div>
            <a
              href="https://www.leadwallet.io/pdf/Lead Wallet Whitepaper 1_0_2.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              Whitepaper
            </a>
            <a
              href="https://leadwallet.io/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </a>
            <a
              href="https://leadwallet.io/pdf/Terms%20of%20Service.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms of Service
            </a>
          </div>
        </div>
        <div className="footer-copyright text-center py-3 text-white">
        <div fluid>
          &copy; {new Date().getFullYear()} Copyright: <a href="#"> Lead Cyber Services Limited </a>
        </div>
      </div>
      </footer>
    </div>
  );
};
