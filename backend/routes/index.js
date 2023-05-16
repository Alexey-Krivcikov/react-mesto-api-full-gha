const router = require("express").Router();
const userRouter = require("./users");
const cardRouter = require("./cards");

const { login, createUser } = require("../controllers/users");

const { validateCreateUser, validateLogin } = require("../middlewares/validation");
const auth = require("../middlewares/auth");

const NotFoundError = require("../errors/not-found-err");

router.post("/signup", validateCreateUser, createUser);
router.post("/signin", validateLogin, login);

router.use("/users", auth, userRouter);
router.use("/cards", auth, cardRouter);

router.get("/signout", (req, res) => {
  res.clearCookie("jwt").send({ message: "Выход" });
});

router.use("*", () => {
  throw new NotFoundError("Некорректный путь или запрос.");
});

module.exports = router;
