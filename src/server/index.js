const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const { generalError, notFoundError } = require("./middlewares/errors");
const userRouter = require("./routers/userRouter");
const auth = require("./middlewares/auth");
const petsRouter = require("./routers/petsRouter");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());

app.use("/user", userRouter);
app.use("/pets", auth, petsRouter);

app.use(notFoundError);
app.use(generalError);

module.exports = app;
