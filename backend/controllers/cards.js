const mongoose = require("mongoose");
const Card = require("../models/card");
const BadRequestError = require("../errors/bad-req-err");
const ForbiddenError = require("../errors/forbidden-err");
const NotFoundError = require("../errors/not-found-err");

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const { _id: userId } = req.user;

  Card.create({ name, link, owner: userId })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError("Некорректные данные при создании карточки."));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .orFail(() => {
      throw new NotFoundError("Карточка не найдена");
    })
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        return card.deleteOne().then(() => res.send(card));
      }
      throw new ForbiddenError("Нет прав доступа");
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError("Карточка не найдена");
    })
    .then((card) => res.send(card))
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError("Карточка не найдена");
    })
    .then((card) => res.send(card))
    .catch(next);
};
