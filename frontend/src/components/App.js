import React from "react";
import { useCallback } from "react";
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

  // Функция проверки авторизации
  const tokenCheck = useCallback(() => {
      const authorized = localStorage.getItem('authorized');
      if (authorized) {
        auth
          .checkToken()
          .then((userData) => {
            if (userData.email) {
              setLoggedIn(true);
              setEmail(userData.email);
              navigate("/", { replace: true });
              setCurrentUser((data) => ({ ...data, userData }));
            }
          })
          .catch((err) => console.log(err));
      }
    }, [navigate])

  React.useEffect(() => {
    tokenCheck();
    loggedIn &&
      Promise.all([api.getUserInfo(), api.getInitialCards()])
        .then(([userInfo, cards]) => {
          setCards(cards);
          setCurrentUser(userInfo);
        })
        .catch((err) => console.log(err));
  }, [loggedIn, tokenCheck]);

  const handleSubmitRegister = (e) => {
    const values = { email, password };
    e.preventDefault();
    return auth
      .register(values)
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
    const values = { email, password };
    e.preventDefault();
    auth
      .authorize(values)
      .then((data) => {
        if (data.message) {
          setLoggedIn(true);
          setEmail(email);
          // setPassword("");
          localStorage.setItem('authorized', 'true');
          navigate("/", { replace: true });
        }
      })
      .catch((err) => {
        console.log(err);
        setRegisterInfo("Что-то пошло не так! Попробуйте ещё раз.");
        handleRegister();
      });
  };

  function handleSignOut() {
    auth
      .signout()
      .then(() => {
        localStorage.removeItem('authorized')
        setLoggedIn(false);
        navigate('sign-in', { replace: true });
        setEmail('');
        setPassword('');
  })
    .catch((err) => { 
      console.log(err);
  });
  }

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

// Лайк карточки
  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some((i) => i === currentUser._id);
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

  function handleEmailChange(e) {
    setEmail(e.target.value);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  function handleRegister() {
    setIsRegisterPopupOpen(true);
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <Header email={email} signOut={handleSignOut} />

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
