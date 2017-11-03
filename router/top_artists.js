const express = require('express')
const router = express()
const { createWebAPIRequest } = require('../util/util')
const pinyin = require('pinyin');
const schedule =require('node-schedule');

let artists = null;
const rule = new schedule.RecurrenceRule(); // schedule定时器
rule.hour = 0;
rule.minute = 0;
rule.second = 0;
const job = schedule.scheduleJob(rule, () => {
  artists = null;
});

router.get('/', (req, res) => {
  if(artists) {
    res.send(artists);
    return;
  }
  const cookie = req.get('Cookie') ? req.get('Cookie') : ''
  const data = {
    offset: req.query.offset || 0,
    total: true,
    limit: req.query.limit || 50,
    csrf_token: ''
  }
  createWebAPIRequest(
    'music.163.com',
    `/weapi/artist/top`,
    'POST',
    data,
    cookie,
    music_req => {
      const data = JSON.parse(music_req);

      for (let i = 0; i < data.artists.length; i++) {
        const pinyinName = getPinyin(data.artists[i].name)[0][0];
        fIndex = pinyinName.split('')[0].toUpperCase();
        data.artists[i].fIndex = fIndex;
      }
      artists = data;
      res.send(artists)
    },
    err => res.status(502).send('fetch error')
  )
})

function getPinyin(item) {
  return pinyin(item, {
    style: pinyin.STYLE_NORMAL, // 设置拼音风格
    heteronym: true,
  });
}   

module.exports = router
