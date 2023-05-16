const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { regex } = require("../constants/regex");
const AuthenticationError = require("../errors/auth-err");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, "Минимальная длина поля name - 2"],
    maxlength: [30, "Максимальная длина поля name - 30"],
    default: "Жак-Ив Кусто",
  },
  about: {
    type: String,
    minlength: [2, "Минимальная длина поля name - 2"],
    maxlength: [30, "Максимальная длина поля name - 30"],
    default: "Исследователь",
  },
  email: {
    type: String,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: "Некорректный email",
    },
    required: [true, "Поле email должно быть заполнено"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Поле password должно быть заполнено"],
    select: false,
  },
  avatar: {
    type: String,
    validate: {
      validator(v) {
        return regex.test(v);
      },
      message: (props) => `${props.value} - некорректная ссылка`,
    },
    default: "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
  },
}, { toJSON: { useProjection: true }, toObject: { useProjection: true }, versionKey: false });

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(new AuthenticationError("Неправильные почта или пароль"));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new AuthenticationError("Неправильные почта или пароль"));
          }
          return user;
        });
    });
};

module.exports = mongoose.model("user", userSchema);
