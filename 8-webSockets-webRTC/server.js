require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const morgan = require("morgan");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const socketManager = require("./sockets/socketManager");

const errorHandler = require("./middlewares/errorHandler");
const AppError = require("./utils/AppError");
const usersRoute = require("./routes/usersRoutes");
const authRouters = require("./routes/authRouters");

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

socketManager(io);

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

connectDB();

if (process.env.CODE_STATUS === "dev") {
  app.use(morgan("dev"));
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/login.html"));
});

app.get("/groupChat", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/groupChat.html"));
});

app.get("/privateChat/:id", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/privateChat.html"));
});

app.use("/api/user", usersRoute);
app.use("/api/auth", authRouters);

app.all("*", (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server ⚠️`, 404));
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`server run in port http://localhost:${PORT} 🚀 `);
});
