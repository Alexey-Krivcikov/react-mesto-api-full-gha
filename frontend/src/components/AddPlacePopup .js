import React from "react";
import PopupWithForm from "./PopupWithForm";
import { useForm } from "../hooks/useForm";

function AddPlacePopup({ isOpen, onClose, onAddPlaceSubmit, isLoading }) {
  const { values, handleChange, setValues } = useForm({
    name: "",
    link: "",
  });

  function handleSubmit(e) {
    e.preventDefault();

    onAddPlaceSubmit(values);
  }

  React.useEffect(() => {
    setValues({
      name: "",
      link: "",
    });
  }, [isOpen]);

  return (
    <PopupWithForm
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      name="card-add"
      title="Новое место"
    >
      <input
        onChange={handleChange}
        value={values.name}
        className="popup__input popup__input_type_card-name"
        placeholder="Название"
        id="card-name"
        name="name"
        type="text"
        minLength="2"
        maxLength="30"
        required
      />
      <span className="popup__input-err card-name-error"></span>
      <input
        onChange={handleChange}
        value={values.link}
        className="popup__input popup__input_type_card-link"
        placeholder="Ссылка на картинку"
        id="card-link"
        name="link"
        type="url"
        required
      />
      <span className="popup__input-err card-link-error"></span>
    </PopupWithForm>
  );
}

export default AddPlacePopup;
