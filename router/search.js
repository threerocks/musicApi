const express = require("express");
const router = express();
const { createWebAPIRequest } = require("../util/util");
const request = require('request');

router.get("/", (req, res) => {
  const cookie = req.get("Cookie") ? req.get("Cookie") : "";
  const keywords = req.query.keywords;
  const type = req.query.type || 1;
  const limit = req.query.limit || 30;
  const offset = req.query.offset || 0;
  // *(type)* 搜索单曲(1)，歌手(100)，专辑(10)，歌单(1000)，用户(1002)
  const data = {
    csrf_token: "",
    limit,
    type,
    s: keywords,
    offset
  };

  createWebAPIRequest(
    "music.163.com",
    "/weapi/search/get",
    "POST",
    data,
    cookie,
    music_req => res.send(music_req),
    err => res.status(502).send("fetch error")
  );
});

router.get("/hotkey", (req, res) => {
  const type = req.query.type || 1;
  const limit = req.query.limit || 30;
  const offset = req.query.offset || 0;

  request('https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg', (err, result) => {
    if (err) throw new Error(err);
    res.send(JSON.parse(result.body));
  })
});

module.exports = router;
