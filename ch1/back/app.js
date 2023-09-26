const express = require("express");
const db = require("./models");
const cors = require("cors");
const app = express();
const passport = require("passport");
const bcrypt = require("bcrypt");
const passportConfig = require("./passport");
const session = require("express-session");
const cookie = require("cookie-parser");
const morgan = require("morgan");
const hpp = require("hpp");
const helmet = require("helmet");
const dotenv = require("dotenv");

const prod = process.env.NODE_ENV === "production";
const usersRouter = require("./routes/user");
const postRouter = require("./routes/post");
const postsRouter = require("./routes/posts");
const hashtagRouter = require("./routes/hashtag");

dotenv.config();
db.sequelize.sync({});
passportConfig();

if (prod) {
  app.use(helmet());
  app.use(hpp());
  app.use(morgan("combined "));
  app.use(
    cors({
      origin: "http://jjgssns.com",
      credentials: true,
    })
  );
} else {
  app.use(morgan("dev"));
  app.use(
    cors({
      origin: "http://localhost:3080",
      credentials: true,
    })
  );
}

app.use("/", express.static("uploads"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookie(process.env.COOKIE_SECRETE));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRETE,
    cookie: {
      httpOnly: true,
      secure: false,
      domain: prod && ".jjgssns.com",
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send("안녕 엔드");
});

app.use("/user", usersRouter);
app.use("/post", postRouter);
app.use("/posts", postsRouter);
app.use("/hashtag", hashtagRouter);

app.listen(prod ? process.env.PORT : 3085, () => {
  console.log(`백엔드 서버${process.env.PORT}번에서 작동중`);
});
