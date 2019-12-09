//index.js
const app = getApp();
// 获取数据库的实例
const db = wx.cloud.database();
Page({
  data: {
    books: [],
    page: 0
  },
  getList(init) {
    wx.showLoading()
    // init: 是不是初始化 初始化直接渲染 不考虑分页
    if (init) {
      this.setData({
        page: 0
      })
    }
    const PAGE = 3;
    const offset = this.data.page * PAGE;
    let ret = db.collection('doubanbooks')
        .orderBy('create_time', 'desc');
    if (this.data.page > 0) {
      // 不是第一页
      ret = ret.skip(offset)
    }
    ret = ret.limit(PAGE)
      .get()
      .then(res => {
        // console.log(res);
        if (init) {
          this.setData({
            books: res.data
          })
        } else {
          // 加载下一页
          this.setData({
            books: [...this.data.books, ...res.data]
          })
        }
        wx.hideLoading()
      })
  },
  onLoad() {
    this.getList(true)
  },
  onReachBottom() {
    console.log(11111)
    this.setData({
      page: this.data.page + 1
    }, () => {
      this.getList();
    })
  },
  onPullDownRefresh() {
    console.log('xiala')
    this.getList(true)
    wx.pageScrollTo({
      scrollTop: 0,
    })
  },

  toDetail(e) {
    console.log(e.currentTarget.dataset);
    wx.navigateTo({
      url: '/pages/details/details?id=' + e.currentTarget.dataset.name,
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
