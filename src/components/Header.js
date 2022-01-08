import React, { useState } from "react";
import cx from "classnames";

export default () => {
  const [clicked, setClicked] = useState(false);

  const renderButton = () => {
    return (
      <button
        className={cx(
          "menu focus:outline-none",
          clicked ? "opened absolute z-50 top-0 right-1 mt-2" : ""
        )}
        onClick={() => {
          window.scrollTo(0, 0);
          if (!clicked) {
            document.body.style.overflowY = "hidden";
          } else {
            document.body.style.overflowY = "auto";
          }
          setClicked(!clicked);
        }}
        aria-label="Main Menu"
        aria-expanded={clicked}
      >
        <svg width="60" height="60" viewBox="0 0 100 100">
          <path
            className="line line1"
            d="M 20,29.000046 H 80.000231 C 80.000231,29.000046 94.498839,28.817352 94.532987,66.711331 94.543142,77.980673 90.966081,81.670246 85.259173,81.668997 79.552261,81.667751 75.000211,74.999942 75.000211,74.999942 L 25.000021,25.000058"
          />
          <path className="line line2" d="M 20,50 H 80" />
          <path
            className="line line3"
            d="M 20,70.999954 H 80.000231 C 80.000231,70.999954 94.498839,71.182648 94.532987,33.288669 94.543142,22.019327 90.966081,18.329754 85.259173,18.331003 79.552261,18.332249 75.000211,25.000058 75.000211,25.000058 L 25.000021,74.999942"
          />
        </svg>
      </button>
    );
  };

  return (
    <header className="container px-4 mx-auto py-4">
      <div className="flex flex-row justify-between items-center relative">
        <a
          href="https://www.leadwallet.io"
          className="logo flex flex-row items-center"
        >
          <img
            src="/images/full-logo.png"
            width="180"
            className="cursor-pointer"
            alt="LEAD"
          />
        </a>
        <div className="cursor-pointer">{renderButton()}</div>
      </div>
      <div
        className={cx(
          "w-full h-full fixed inset-0 z-40  text-white font-Montserrat-ExtraBold uppercase flex-col justify-center text-4xl transition duration-500 ease-in-out",
          clicked ? "flex bg-black" : "hidden bg-transparent"
        )}
      >
        <div className="flex flex-col mx-auto justify-center text-center">
          <a
            className={cx(
              "transition duration-500 ease-in-out delay-500 py-4",
              clicked ? "opacity-100" : "opacity-0"
            )}
            href="https://www.leadwallet.io/about"
          >
            About Us
          </a>
          <a
            className={cx(
              "transition duration-500 ease-in-out delay-500 py-4",
              clicked ? "opacity-100" : "opacity-0"
            )}
            href="https://www.leadwallet.io/token"
          >
            The Token
          </a>
          <a
            className={cx(
              "transition duration-500 ease-in-out delay-500 py-4",
              clicked ? "opacity-100" : "opacity-0"
            )}
            href="https://www.leadwallet.io/team"
          >
            Team
          </a>
          <a
            className={cx(
              "transition duration-500 ease-in-out delay-500 py-4",
              clicked ? "opacity-100" : "opacity-0"
            )}
            href="https://www.leadwallet.io/contact"
          >
            Contact Us
          </a>
        </div>
      </div>
    </header>
  );
};
