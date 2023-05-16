import React from "react";
import PopupWithForm from "./PopupWithForm";
import CurrentUserContext from "../contexts/CurrentUserContext";

function EditProfilePopup({ isOpen, onClose, onUpdateUser, isLoading }) {
  const currentUser = React.useContext(CurrentUserContext);
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");

  function handleChangeName(e) {
    setName(e.target.value);
  }
  function handleChangeDescription(e) {
    setDescription(e.target.value);
  }

  function handleSubmit(e) {
    // Запрещаем браузеру переходить по адресу формы
    e.preventDefault();

    // Передаём значения управляемых компонентов во внешний обработчик
    onUpdateUser({
      name,
      about: description,
    });
  }

  React.useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser, isOpen]);

  return (
    <PopupWithForm
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      name="profile-info"
      title="Редактировать профиль"
    >
      <input
        onChange={handleChangeName}
        className="popup__input popup__input_type_name"
        id="user-name"
        name="name"
        type="text"
        required
        minLength="2"
        maxLength="40"
        placeholder="Имя"
        value={name || ""}
      />
      <span className="popup__input-err user-name-error"></span>
      <input
        onChange={handleChangeDescription}
        className="popup__input popup__input_type_job"
        id="user-job"
        name="about"
        type="text"
        required
        minLength="2"
        maxLength="200"
        placeholder="Вид деятельности"
        value={description || ""}
      />
      <span className="popup__input-err user-job-error"></span>
    </PopupWithForm>
  );
}

export default EditProfilePopup;
