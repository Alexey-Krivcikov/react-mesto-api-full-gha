const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const BadRequestError = require("../errors/bad-req-err");
const ConflictError = require("../errors/conflict-err");
const NotFoundError = require("../errors/not-found-err");

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, "secret-key", { expiresIn: "7d" });

      res.cookie("jwt", token, {
        maxAge: 3600000,
        httpOnly: true,
      })
        .send({ data: email })
        .end();
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email,
  } = req.body;

  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      User.create({
        name, about, avatar, email, password: hash,
      }).then((user) => res.status(201).send({ data: user }))
        .catch((err) => {
          if (err.code === 11000) {
            next(new ConflictError("Пользователь с таким email уже существует."));
          } else if (err.name === "ValidationError") {
            next(new BadRequestError("Некорректные данные при создании пользователя."));
          } else {
            next(err);
          }
        });
    }).catch(next);
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res
        .send({ data: users });
    })
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new NotFoundError("Пользователь не найден");
    })
    .then((user) => {
      res.send({ data: user });
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  const { _id: userId } = req.user;
  User.findById(userId)
    .orFail(() => {
      throw new NotFoundError("Пользователь не найден");
    })
    .then((user) => {
      res.send({ data: user });
    })
    .catch(next);
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      throw new NotFoundError("Пользователь не найден");
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Некорректные данные при обновлении профиля."));
      } else {
        next(err);
      }
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      throw new NotFoundError("Пользователь не найден");
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Некорректные данные при обновлении аватара."));
      } else {
        next(err);
      }
    });
};
