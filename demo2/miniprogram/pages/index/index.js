//index.js
const app = getApp();
// 获取数据库的实例
const db = wx.cloud.database();
Page({
  data: {
    books: []
  },
  onLoad() {
    db.collection('doubanbooks')
    .orderBy('create_time', 'desc')
    .get()
      .then(res => {
        // console.log(res);
        this.setData({
          books: res.data
        })
      })
  }
  // cloundfn() {
  //   // 获取云函数
  //   wx.cloud.callFunction(
  //     {
  //       name: 'getInfo',
  //       data: {
  //         a: 3,
  //         b: 4,
  //       },
  //       success(res) {
  //         console.log(res.result)
  //       }
  //     }
  //   )
  // },

})
