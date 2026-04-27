const createError = require("http-errors");
const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
require("dotenv").config();

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const lostRouter = require("./routes/lost");
const eventsRouter = require("./routes/events");
const tutorRouter = require("./routes/tutors");
const marketplaceRoutes = require("./routes/marketplace");
const housingRouter = require("./routes/housing");
const studyGroupsRouter = require("./routes/studyGroups");
const connectDB = require("./middleware/db");

const app = express();

connectDB();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(logger("dev"));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
  console.log(">>> Incoming Request:", req.method, req.url);
  console.log(">>> Body:", req.body);
  next();
});

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "Server is running",
  });
});

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/events", eventsRouter);
app.use("/lost", lostRouter);
app.use("/tutors", tutorRouter);
app.use("/housing", housingRouter);
app.use("/api/marketplace", marketplaceRoutes);

/*
  IMPORTANT:
  This supports both:
  /studyGroups
  /api/studyGroups
*/
app.use("/studyGroups", studyGroupsRouter);
app.use("/api/studyGroups", studyGroupsRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500).json({
    success: false,
    message: err.message,
  });
});

module.exports = app;