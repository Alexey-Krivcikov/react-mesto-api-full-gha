import React from "react";
import CurrentUserContext from "../contexts/CurrentUserContext";

function Card(props) {
  const currentUser = React.useContext(CurrentUserContext);
  // Определяем, являемся ли мы владельцем текущей карточки
  const isOwn = props.card.owner._id === currentUser._id;
  // Определяем, есть ли у карточки лайк, поставленный текущим пользователем
  const isLiked = props.card.likes.some((i) => i._id === currentUser._id);
  // Создаём переменную, которую после зададим в `className` для кнопки лайка
  const cardLikeButtonClassName = `card__like-btn ${
    isLiked && "card__like-btn_active"
  }`;

  function handleClick() {
    props.onCardClick(props.card);
  }
  function handleLikeClick() {
    props.onCardLike(props.card);
  }
  function handleCardDelete() {
    props.onCardDelete(props.card);
  }
  return (
    <li className="card">
      <img
        className="card__img"
        src={props.card.link}
        alt={props.card.name}
        onClick={handleClick}
      />
      {isOwn && (
        <button
          onClick={handleCardDelete}
          className="card__del-btn"
          type="button"
        ></button>
      )}
      <div className="card__text">
        <h2 className="card__title">{props.card.name}</h2>
        <div className="card__like-container">
          <button
            onClick={handleLikeClick}
            className={cardLikeButtonClassName}
            type="button"
          ></button>
          <p className="card__like-counter">{props.card.likes.length}</p>
        </div>
      </div>
    </li>
  );
}

export default Card;
