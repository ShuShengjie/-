// 云函数入口文件
const axios = require('axios');
const doubanbook = require('doubanbook');
const cheerio = require('cheerio');
const cloud = require('wx-server-sdk')

cloud.init()

async function searchDouban(isbn) {

  const url = 'https://search.douban.com/book/subject_search?search_text=' + isbn;
  let serchInfo = await axios.get(url);
  // console.log(serchInfo.data);
  // 获取window.__DATA__ = 后面的数据 解密
  let reg = /window\.__DATA__ = "(.*)"/;
  if (reg.test(serchInfo.data)) {
    let searchData = doubanbook(RegExp.$1)[0];
    return searchData;
    // console.log(searchData);
  }
}

async function getDouban(isbn) {
  // console.log('isbn')
  // 第一个爬虫根据isbn查询豆瓣url
  let detailInfo = await searchDouban(isbn);
  console.log(detailInfo.title);
  let detailPage = await axios.get(detailInfo.url);
  // 第二个爬虫
  // 在node里使用jQuery的语法，解析文档
  const $ = cheerio.load(detailPage.data);
  const info = $('#info').text().split('\n')
        .map(v => v.trim()).filter(v => v);
  // console.log(info);
  let author = info[2];
  let tags = [];
  $('#db-tags-section a.tag').each((i, v) => {
    tags.push({
      title: $(v).text(),
    })
  })
  const ret = {
    create_time: new Date().getTime(),
    title: detailInfo.title,
    rate: detailInfo.rating.value,
    image: detailInfo.cover_url,
    url: detailInfo.url,
    summer: $('#link-report .intro').text(),
    tags,
    author,
  }
  console.log(ret);
  return ret;
}

// console.log(getDouban('9787121266775'));
// 所谓的云函数就是node的项目（函数）
exports.main = async (event, context) => {
  const {isbn} = event;
  return getDouban(isbn)
}