const userRouter = require("express").Router();
const {
  getUsers,
  getUser,
  getCurrentUser,
  updateUserInfo,
  updateUserAvatar,
} = require("../controllers/users");
const { validateUserId, validateUpdateUserInfo, validateAvatar } = require("../middlewares/validation");

userRouter.get("/", getUsers);
userRouter.get("/me", getCurrentUser);
userRouter.get("/:userId", validateUserId, getUser);
userRouter.patch("/me", validateUpdateUserInfo, updateUserInfo);
userRouter.patch("/me/avatar", validateAvatar, updateUserAvatar);

module.exports = userRouter;
