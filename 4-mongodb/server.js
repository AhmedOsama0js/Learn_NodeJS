require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const morgan = require("morgan");
const usersRoute = require("./routes/usersRoutes");
const errorHandler = require("./middlewares/errorHandler");
const AppError = require("./utils/AppError");

const app = express();
app.use(express.json());

connectDB();

if (process.env.CODE_STATUS === "dev") {
  app.use(morgan("dev"));
}

app.use("/api/user", usersRoute);

app.all("*", (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server ⚠️`, 404));
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 server run in port http://localhost:${PORT}`);
});
