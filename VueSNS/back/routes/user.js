const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../models");
const passport = require("passport");
const { isNotLoggedIn, isLoggedIn } = require("./middlewares");
const user = require("../models/user");

router.get("/", async (req, res, next) => {
  const user = req.user;
  res.json(user);
});

router.get("/:id", async (req, res, next) => {
  try {
    const user = await db.User.findOne({
      where: { id: parseInt(req.params.id, 10) },
      include: [
        {
          model: db.Post,
          as: "Posts",
          attributes: ["id"],
        },
        {
          model: db.User,
          as: "Followings",
          attributes: ["id"],
        },
        {
          model: db.User,
          as: "Followers",
          attributes: ["id"],
        },
      ],
      attributes: ["id", "nickname"],
    });
    res.json(user);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post("/", isNotLoggedIn, async (req, res, next) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 12);
    const exUser = await db.User.findOne({
      where: { email: req.body.email },
    });
    if (exUser) {
      return res.status(403).json({
        errorCode: 1,
        message: "이미 회원가입되어 있습니다.",
      });
    }
    await db.User.create({
      email: req.body.email,
      nickname: req.body.nickname,
      password: hash,
    });
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        console.log(err);
        return next(err);
      }
      if (info) {
        return res.status(401).send(info.reason);
      }
      return req.login(user, async (err) => {
        if (err) {
          console.log(err);
          return next(err);
        }
        const fullUser = await db.User.findOne({
          where: {
            id: user.id,
          },
          attributes: ["id", "nickname", "email"],
          include: [
            {
              model: db.Post,
              attributes: ["id"],
            },
            {
              model: db.User,
              as: "Followings",
              attributes: ["id"],
            },
            {
              model: db.User,
              as: "Followers",
              attributes: ["id"],
            },
          ],
        });
        return res.json(fullUser);
      });
    })(req, res, next);
  } catch (err) {
    console.log(err);
    return next(err);
  }
});

router.post("/login", isNotLoggedIn, (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.log(err);
      return next(err);
    }
    if (info) {
      return res.status(401).send(info.reason);
    }
    return req.login(user, async (err) => {
      //세션에 사용자 정보 저장 (serializeUser)
      if (err) {
        console.log(err);
        return next(err);
      }
      const fullUser = await db.User.findOne({
        where: {
          id: user.id,
        },
        attributes: ["id", "nickname", "email"],
        include: [
          {
            model: db.Post,
            attributes: ["id"],
          },
          {
            model: db.User,
            as: "Followings",
            attributes: ["id"],
          },
          {
            model: db.User,
            as: "Followers",
            attributes: ["id"],
          },
        ],
      });
      return res.json(fullUser);
    });
  })(req, res, next);
});

router.post("/logout", isLoggedIn, (req, res) => {
  if (req.isAuthenticated()) {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      req.session.destroy(function (err) {
        if (err) {
          return next(err);
        }
        return res.status(200).send("로그아웃되었습니다.");
      });
    });
  }
});

router.get("/:id/posts", async (req, res, next) => {
  try {
    let where = {
      UserId: parseInt(req.params.id, 10),
      RetweetId: null,
    };
    if (parseInt(req.query.lastId, 10)) {
      where[db.Sequelize.Op.lt] = parseInt(req.query.lastId, 10);
    }
    const posts = await db.Post.findAll({
      where,
      include: [
        {
          model: db.User,
          attributes: ["id", "nickname"],
        },
        {
          model: db.Image,
        },
        {
          model: db.User,
          through: "Like",
          as: "Likers",
          attributes: ["id"],
        },
      ],
    });
    res.json(posts);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.patch("/nickname", isLoggedIn, async (req, res, next) => {
  try {
    await db.User.update(
      {
        nickname: req.body.nickname,
      },
      {
        where: {
          id: req.user.id,
        },
      }
    );
    res.send(req.body.nickname);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.post("/:id/follow", isLoggedIn, async (req, res, next) => {
  try {
    const me = await db.User.findOne({
      where: {
        id: req.user.id,
      },
    });
    await me.addFollowing(req.params.id);
    res.send(req.params.id);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.delete("/:id/follow", isLoggedIn, async (req, res, next) => {
  try {
    const me = await db.User.findOne({
      where: {
        id: req.user.id,
      },
    });
    await me.removeFollowing(req.params.id);
    res.send(req.params.id);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.delete("/:id/follower", isLoggedIn, async (req, res, next) => {
  try {
    const me = await db.User.findOne({
      where: {
        id: req.user.id,
      },
    });
    await me.removeFollower(req.params.id);
    res.send(req.params.id);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get("/:id/followings", isLoggedIn, async (req, res, next) => {
  try {
    const user = await db.User.findOne({
      where: {
        id: req.user.id,
      },
    });
    const followings = await user.getFollowings({
      attributes: ["id", "nickname"],
      limit: parseInt(req.query.limit || 3, 10),
      offset: parseInt(req.query.offset || 0, 10),
    });
    res.json(followings);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get("/:id/followers", isLoggedIn, async (req, res, next) => {
  try {
    const user = await db.User.findOne({
      where: {
        id: req.user.id,
      },
    });
    const followers = await user.getFollowers({
      attributes: ["id", "nickname"],
      limit: parseInt(req.query.limit || 3, 10),
      offset: parseInt(req.query.offset || 0, 10),
    });
    res.json(followers);
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
