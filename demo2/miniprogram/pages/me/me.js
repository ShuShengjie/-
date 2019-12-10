// pages/me/me.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: wx.getStorageSync('userInfo') || {},
    // 加载动画
    loadingHidden: true,
  },
  onGetUserInfo(e) {
    console.log(e);
    let userInfo = e.detail.userInfo;
    // 需要调用云函数获取用户的openid
    wx.cloud.callFunction({
      name: 'login',
      complete: res => {
        userInfo.openid = res.result.openid;
        this.setData({
          userInfo
        })
        // console.log(res.result);
        // 写入本地缓存
        wx.setStorageSync('userInfo', userInfo);
      }
    })
  },
  scanCodes() {
    wx.scanCode({
      success: res => {
        this.setData({
          loadingHidden: false
        })
        // 图书的isbn号，去豆瓣获取详情
        this.addBook(res.result)
        console.log(res.result);
      },
    })
  },
  addBook(isbn) {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'getdouban',
      data: {isbn},
      success: ({result}) => {
        console.log(result, 'result');
        db.collection('doubanbooks').add({
          data: result
        }).then(res => {
          if (res._id) {
            wx.showModal({
              title: '添加成功',
              content: `${result.title}添加成功`,
            })
            this.setData({
              loadingHidden: true
            })
          }
          console.log(res);
        })
      },
      fail: ({ result }) => {
        wx.showModal({
          title: '添加失败',
          content: `该书不存在与豆瓣`,
        })
        this.setData({
          loadingHidden: true
        })
      }
    })
    // 云函数写一个爬虫
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})