import { useEffect } from "react";

const Popup = ({ isOpen, name, onClose, children }) => {
  useEffect(() => {
    if (!isOpen) return;
    const closeByEsc = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", closeByEsc);
    return () => document.removeEventListener("keydown", closeByEsc);
  }, [isOpen, onClose]);

  const handleOverlay = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };
  return (
    <div
      className={`popup ${isOpen ? "popup_opened" : ""} popup_type_${name}`}
      onClick={handleOverlay}
    >
      <div className={`popup__container popup__container_type_${name}`}>
        {children}
        <button
          className="popup__close-btn"
          type="button"
          onClick={onClose}
        ></button>
      </div>
    </div>
  );
};

export default Popup;
