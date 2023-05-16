import React from "react";
import Popup from "./Popup";

function InfoTooltip({ isOpen, onClose, registerInfo, registerStatus }) {
  return (
    <Popup isOpen={isOpen} onClose={onClose}>
      <div
        className={`popup__status ${
          registerStatus ? `popup__status_type_ok` : `popup__status_type_err`
        }`}
      ></div>
      <h2 className="popup__status-title">{registerInfo}</h2>
    </Popup>
  );
}

export default InfoTooltip;
