const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const { errors } = require("celebrate");
const { errorHandler } = require("./errors/errorHandler");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const router = require("./routes/index");

const { PORT = 3000 } = process.env;
const app = express();

app.use(helmet());
app.use(express.json());
app.use(cookieParser());

mongoose.connect("mongodb://127.0.0.1:27017/mestodb");

const allowedCors = [
  "https://mesto.front.end.nomoredomains.monster",
  "http://api.mesto.front.end.nomoredomains.monster",
  "http://localhost:3000",
  "http://localhost:3005",
];

app.options("*", cors({
  origin: allowedCors,
  credentials: true,
}));

app.use(cors({
  origin: allowedCors,
  credentials: true,
}));

app.use(requestLogger);
app.use(router);
app.use(errorLogger);
app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
