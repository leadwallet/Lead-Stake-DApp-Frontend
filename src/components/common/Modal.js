import React, { useRef } from "react";
import useOnClickOutside from "../../hooks/useOnClickOutside";

const Modal = ({ children, onClose, title }) => {
  const ref = useRef(null);

  const closeModal = () => {
    document.querySelector("body").classList.remove("overflow-hidden");
    onClose();
  };

  useOnClickOutside(ref, () => {
    closeModal();
  });

  return (
    <div
      className="fixed overflow-auto flex items-center"
      style={{
        backgroundColor: "rgba(0, 0, 0, .2)",
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
        zIndex: 5000,
      }}
    >
      <div
        ref={ref}
        className="relative p-8 border-2 border-primary rounded-md bg-white w-full max-w-md m-auto h-custom"
        style={{
          minWidth: "300px",
          maxWidth: "700px",
        }}
      >
        <div className="flex flex-row items-center">
          <div className="text-3xl font-bold">{title}</div>
        </div>

        {children}
      </div>
    </div>
  );
};

export default Modal;
