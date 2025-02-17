const express = require("express");
const userRoutes = require("./routes");
const errorHandler = require("./errorHandler");
const AppError = require("./AppError");

const app = express();
app.use(express.json());

app.use("/api/user", userRoutes);



app.all("*", (req, res, next) => {
  next(new AppError(`⚠️ Cannot find ${req.originalUrl} on this server`, 404));
});

app.use(errorHandler);

app.listen(3000, () => {
  console.log("🚀 server run in port http://localhost:3000");
});
