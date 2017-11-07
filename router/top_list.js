const schedule =require('node-schedule');

const top_list_all = {
  '0': ['云音乐新歌榜', '/api/playlist/detail?id=3779629'],
  '1': ['云音乐热歌榜', '/api/playlist/detail?id=3778678'],
  '2': ['网易原创歌曲榜', '/api/playlist/detail?id=2884035'],
  '3': ['云音乐飙升榜', '/api/playlist/detail?id=19723756'],
  '4': ['云音乐电音榜', '/api/playlist/detail?id=10520166'],
  '5': ['UK排行榜周榜', '/api/playlist/detail?id=180106'],
  '6': ['美国Billboard周榜', '/api/playlist/detail?id=60198'],
  '7': ['KTV嗨榜', '/api/playlist/detail?id=21845217'],
  '8': ['iTunes榜', '/api/playlist/detail?id=11641012'],
  '9': ['Hit FM Top榜', '/api/playlist/detail?id=120001'],
  '10': ['日本Oricon周榜', '/api/playlist/detail?id=60131'],
  '11': ['韩国Melon排行榜周榜', '/api/playlist/detail?id=3733003'],
  '12': ['韩国Mnet排行榜周榜', '/api/playlist/detail?id=60255'],
  '13': ['韩国Melon原声周榜', '/api/playlist/detail?id=46772709'],
  '14': ['中国TOP排行榜(港台榜)', '/api/playlist/detail?id=112504'],
  '15': ['中国TOP排行榜(内地榜)', '/api/playlist/detail?id=64016'],
  '16': ['香港电台中文歌曲龙虎榜', '/api/playlist/detail?id=10169002'],
  '17': ['华语金曲榜', '/api/playlist/detail?id=4395559'],
  '18': ['中国嘻哈榜', '/api/playlist/detail?id=1899724'],
  '19': ['法国 NRJ EuroHot 30周榜', '/api/playlist/detail?id=27135204'],
  '20': ['台湾Hito排行榜', '/api/playlist/detail?id=112463'],
  '21': ['Beatport全球电子舞曲榜', '/api/playlist/detail?id=3812895']
}
const express = require('express')
const router = express()
const { createRequest } = require('../util/util')

let rank = {};
const rule = new schedule.RecurrenceRule(); // schedule定时器
rule.hour = 0;
rule.minute = 0;
rule.second = 0;
const job = schedule.scheduleJob(rule, () => {
  rank = {};
  getRankList();
});
router.get('/', (req, res) => {
  res.send(rank[req.query.idx]);
})

const ids = [0, 1, 3, 7, 8, 14, 15, 17, 18, 20];
function getRank(id) {
  const action = 'http://music.163.com' + top_list_all[id][1]
  return createRequest(`${action}`, 'GET', null)
    .then(result => {
      return result;
    })
    .catch(err => {
      throw new Error(err);
    })
}
function getRankList() {
  const promises = [];
  for (const id of ids) {
    promises.push(getRank(id))
  }
  Promise.all(promises).then((res) => {
    for (let i = 0; i < res.length; i++) {
      rank[ids[i]] = res[i];
    }
  })
}
getRankList();
module.exports = router
