const express = require("express");
const router = express.Router();
const db = require("../models");
const multer = require("multer");
const { isLoggedIn } = require("./middlewares");
const path = require("path");

router.get("/", async (req, res, next) => {
  try {
    let where = {};
    if (parseInt(req.query.lastId, 10)) {
      where = {
        id: { [db.Sequelize.Op.lt]: parseInt(req.query.lastId, 10) },
      };
    }
    const posts = await db.Post.findAll({
      where,
      include: [
        {
          model: db.User,
          attributes: ["id", "nickname"],
        },
        { model: db.Image },
        {
          model: db.User,
          as: "Likers",
          attributes: ["id"],
        },
        {
          model: db.Comment,
          attributes: ["id"],
        },
        {
          model: db.Post,
          as: "Retweet",
          include: [
            {
              model: db.User,
              attributes: ["id", "nickname"],
            },
            { model: db.Image },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: parseInt(req.query.limit, 10) || 0,
    });
    res.json(posts);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
