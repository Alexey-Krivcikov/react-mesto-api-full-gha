import React from "react";
import PopupWithForm from "./PopupWithForm";

function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar, isLoading }) {
  const inputRef = React.useRef();

  function handleSubmit(e) {
    e.preventDefault();

    onUpdateAvatar({
      avatar:
        inputRef.current.value /* Значение инпута, полученное с помощью рефа */,
    });
  }

  React.useEffect(() => {
    inputRef.current.value = "";
  }, [isOpen]);
  return (
    <PopupWithForm
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      name="avatar"
      title="Обновить аватар"
    >
      <input
        ref={inputRef}
        className="popup__input popup__input_type_avatar"
        placeholder="URL"
        id="avatar-url"
        name="avatar"
        type="url"
        required
      />
      <span className="popup__input-err avatar-url-error"></span>
    </PopupWithForm>
  );
}

export default EditAvatarPopup;
