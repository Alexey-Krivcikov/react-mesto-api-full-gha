import React from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import Login from "./Login";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";
import PopupWithForm from "./PopupWithForm";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup ";
import InfoTooltip from "./InfoTooltip";
import ImagePopup from "./ImagePopup";
import api from "../utils/Api";
import * as auth from "../utils/auth";
import CurrentUserContext from "../contexts/CurrentUserContext";
//

function App() {
  // хуки состояния
  const [isEditProfilePopupOpen, SetEditProfilePopupOpen] =
    React.useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = React.useState(false);
  const [isRegisterPopupOpen, setIsRegisterPopupOpen] = React.useState(false);
  const [cards, setCards] = React.useState([]);
  const [selectedCard, setSelectedCard] = React.useState(null);
  const [currentUser, setCurrentUser] = React.useState({});
  //
  const [isLoading, setIsLoading] = React.useState(false);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [registerInfo, setRegisterInfo] = React.useState("");
  const [registerStatus, setRegisterStatus] = React.useState(false);

  const navigate = useNavigate();

  function handleEditProfileClick() {
    SetEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setAddPlacePopupOpen(true);
  }

  function handleEditAvatarClick() {
    setEditAvatarPopupOpen(true);
  }

  function closeAllPopups() {
    SetEditProfilePopupOpen(false);
    setAddPlacePopupOpen(false);
    setEditAvatarPopupOpen(false);
    setIsRegisterPopupOpen(false);
    setSelectedCard(null);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    // Отправляем запрос в API и получаем обновлённые данные карточки
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => console.log(err));
  }

  function handleCardDelete(card) {
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((state) => state.filter((item) => item._id !== card._id));
      })
      .catch((err) => console.log(err));
  }

  function handleUpdateUser(userData) {
    setIsLoading(true);
    api
      .setUserInfo(userData)
      .then((newUserData) => {
        setCurrentUser(newUserData);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsLoading(false));
  }

  function handleUpdateAvatar(userAvatar) {
    setIsLoading(true);
    api
      .setAvatar(userAvatar)
      .then((newUserAvatar) => {
        setCurrentUser(newUserAvatar);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsLoading(false));
  }

  function handleAddPlaceSubmit(cardData) {
    setIsLoading(true);
    api
      .addNewCard(cardData)
      .then((newCardData) => {
        setCards([newCardData, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsLoading(false));
  }

  React.useEffect(() => {
    Promise.all([api.getUserInfo(), api.getInitialCards()])
      .then(([userInfo, cards]) => {
        setCards(cards);
        setCurrentUser(userInfo);
      })
      .catch((err) => console.log(err));
  }, []);

  React.useEffect(() => {
    tokenCheck();
  }, []);

  //

  function handleEmailChange(e) {
    setEmail(e.target.value);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  function handleRegister() {
    setIsRegisterPopupOpen(true);
  }

  function signOut() {
    localStorage.removeItem("token");
    setLoggedIn(false);
  }

  function tokenCheck() {
    const token = localStorage.getItem("token");
    if (token) {
      auth
        .checkToken(token)
        .then((res) => {
          if (res) {
            const userData = {
              email: res.data.email,
            };
            setEmail(userData.email);
            setLoggedIn(true);
            setCurrentUser((data) => ({ ...data, userData }));
            navigate("/", { replace: true });
          }
        })
        .catch((err) => console.log(err));
    }
  }

  const handleSubmitRegister = (e) => {
    e.preventDefault();
    auth
      .register(email, password)
      .then((res) => {
        if (res) {
          setRegisterInfo("Вы успешно зарегистрировались!");
          setRegisterStatus(true);
          navigate("/sign-in", { replace: true });
        }
      })
      .catch((err) => {
        console.log(err);
        setRegisterInfo("Что-то пошло не так! Попробуйте ещё раз.");
      })
      .finally(() => {
        handleRegister();
      });
  };

  const handleSubmitLogin = (e) => {
    e.preventDefault();
    auth
      .authorize(email, password)
      .then((data) => {
        if (data.token) {
          setEmail(email);
          setPassword("");
          setLoggedIn(true);
          navigate("/", { replace: true });
        }
      })
      .catch((err) => {
        console.log(err);
        setRegisterInfo("Что-то пошло не так! Попробуйте ещё раз.");
        handleRegister();
      });
  };

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <Header email={email} signOut={signOut} />

      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute
              element={Main}
              loggedIn={loggedIn}
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              onEditAvatar={handleEditAvatarClick}
              onCardClick={handleCardClick}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
              cards={cards}
            />
          }
        />
        <Route
          path="/sign-up"
          element={
            <Register
              email={email}
              password={password}
              handleEmailChange={handleEmailChange}
              handlePasswordChange={handlePasswordChange}
              handleSubmitRegister={handleSubmitRegister}
            />
          }
        />
        <Route
          path="/sign-in"
          element={
            <Login
              email={email}
              password={password}
              handleEmailChange={handleEmailChange}
              handlePasswordChange={handlePasswordChange}
              handleSubmitLogin={handleSubmitLogin}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Footer />

      <EditProfilePopup
        isOpen={isEditProfilePopupOpen}
        onClose={closeAllPopups}
        onUpdateUser={handleUpdateUser}
        isLoading={isLoading}
      />

      <AddPlacePopup
        isOpen={isAddPlacePopupOpen}
        onClose={closeAllPopups}
        onAddPlaceSubmit={handleAddPlaceSubmit}
        isLoading={isLoading}
      />

      <PopupWithForm
        name="delete"
        title="Вы уверены?"
        btnText="Да"
      ></PopupWithForm>

      <EditAvatarPopup
        isOpen={isEditAvatarPopupOpen}
        onClose={closeAllPopups}
        onUpdateAvatar={handleUpdateAvatar}
        isLoading={isLoading}
        name="avatar"
        title="Обновить аватар"
      />

      <InfoTooltip
        isOpen={isRegisterPopupOpen}
        onClose={closeAllPopups}
        registerInfo={registerInfo}
        registerStatus={registerStatus}
      />

      <ImagePopup card={selectedCard} onClose={closeAllPopups} />
    </CurrentUserContext.Provider>
  );
}

export default App;
