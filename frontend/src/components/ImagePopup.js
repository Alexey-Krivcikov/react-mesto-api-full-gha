import React from "react";
import Popup from "./Popup";

function ImagePopup({ onClose, card }) {
  return (
    <Popup onClose={onClose} isOpen={card} name={`card`}>
      <figure className="popup__item">
        <img className="popup__img" src={card?.link} alt={card?.name} />
        <figcaption className="popup__img-desc">{card?.name}</figcaption>
      </figure>
    </Popup>
    // <div className={`popup popup_type_card-open ${card ? "popup_opened" : ""}`}>
    //   <div className="popup__card-container">
    //     <figure className="popup__item">
    //       <img className="popup__img" src={card?.link} alt={card?.name} />
    //       <figcaption className="popup__img-desc">{card?.name}</figcaption>
    //     </figure>
    //     <button
    //       className="popup__close-btn"
    //       type="reset"
    //       onClick={onClose}
    //     ></button>
    //   </div>
    // </div>
  );
}

export default ImagePopup;
