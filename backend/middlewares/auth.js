const jwt = require("jsonwebtoken");
const AuthenticationError = require("../errors/auth-err");
// Импорт переменной секретного ключа
const {
  NODE_ENV,
  JWT_SECRET,
} = process.env;

const handleAuthError = () => {
  throw new AuthenticationError("Необходима авторизация");
};

module.exports = (req, res, next) => {
  const { jwt: token } = req.cookies;

  if (!jwt) {
    return handleAuthError();
  }

  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === "production" ? JWT_SECRET : "secret-key");
  } catch (err) {
    return handleAuthError();
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};
