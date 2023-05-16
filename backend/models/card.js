const mongoose = require("mongoose");
const { regex } = require("../constants/regex");

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Поле name должно быть заполнено"],
    minlength: [2, "Минимальная длина поля name - 2"],
    maxlength: [30, "Максимальная длина поля name - 30"],
  },
  link: {
    type: String,
    validate: {
      validator(v) {
        return regex.test(v);
      },
      message: (props) => `${props.value} - некорректная ссылка`,
    },
    required: [true, "Поле link должно быть заполнено"],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  likes: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
}, { versionKey: false });

module.exports = mongoose.model("card", cardSchema);
