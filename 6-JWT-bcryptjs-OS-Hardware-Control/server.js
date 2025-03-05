require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const morgan = require("morgan");
const path = require("path");

const errorHandler = require("./middlewares/errorHandler");
const AppError = require("./utils/AppError");
const usersRoute = require("./routes/usersRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const authRouters = require("./routes/authRouters");

const app = express();
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

connectDB();

if (process.env.CODE_STATUS === "dev") {
  app.use(morgan("dev"));
}

app.use("/api/user", usersRoute);
app.use("/api/product", productRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/auth", authRouters);

app.all("*", (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server ⚠️`, 404));
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server run in port http://localhost:${PORT} 🚀 `);
});
