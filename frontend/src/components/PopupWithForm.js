import React from "react";
import Popup from "./Popup";

function PopupWithForm({
  name,
  title,
  isOpen,
  onClose,
  onSubmit,
  btnText,
  children,
  isLoading,
}) {
  return (
    <Popup isOpen={isOpen} name={name} onClose={onClose}>
      <h2 className="popup__title">{title}</h2>
      <form onSubmit={onSubmit} className="popup__form" action="#" name={name}>
        {children}
        <button className="popup__btn" type="submit">
          {(btnText = isLoading ? "Сохранение..." : "Сохранить")}
        </button>
      </form>
    </Popup>
  );
}

export default PopupWithForm;
