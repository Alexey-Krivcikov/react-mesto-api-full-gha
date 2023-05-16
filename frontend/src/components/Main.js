import React from "react";
import CurrentUserContext from "../contexts/CurrentUserContext";
import Card from "./Card";

function Main({
  onEditProfile,
  onAddPlace,
  onEditAvatar,
  cards,
  onCardClick,
  onCardLike,
  onCardDelete,
}) {
  const currentUser = React.useContext(CurrentUserContext);
  return (
    <main className="main page__main">
      <section className="main__profile profile">
        <div className="profile__avatar-container">
          <img
            className="profile__avatar"
            src={currentUser.avatar}
            alt="аватар"
          />
          <div className="profile__cover">
            <button
              className="profile__avatar-btn"
              onClick={onEditAvatar}
            ></button>
          </div>
        </div>
        <div className="profile__info">
          <div className="profile__title">
            <h1 className="profile__name">{currentUser.name}</h1>
            <button
              onClick={onEditProfile}
              className="profile__edit-btn"
              type="button"
            ></button>
          </div>
          <p className="profile__subtitle">{currentUser.about}</p>
        </div>
        <button
          className="profile__add-btn"
          type="button"
          onClick={onAddPlace}
        ></button>
      </section>

      <section
        className="main__cards cards"
        aria-label="Картинки с красивыми местами"
      >
        <ul className="cards__list">
          {cards.map((card) => (
            <Card
              key={card._id}
              card={card}
              onCardLike={onCardLike}
              onCardClick={onCardClick}
              onCardDelete={onCardDelete}
            />
          ))}
        </ul>
      </section>
    </main>
  );
}

export default Main;
