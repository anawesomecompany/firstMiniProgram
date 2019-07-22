// pages/user/user.js

const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: '',
    questionsCount: 0,
    user: '',
    quizAveScore: 0,
  },

  getQuizAve: function (openid) {
    db.collection('users').where({
      _openid: openid
    }).get({
      success: res => {
        let quizHistory = []
        quizHistory = res.data[0].quizHistory
        var sum = 0;
        for (var i = 0; i < quizHistory.length; i++) {
          sum += parseFloat(quizHistory[i], 10); 
        }
        this.setData({
          quizAveScore:(sum/quizHistory.length).toFixed(1)
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    //console.log("in user.js onLoad")
    var app = getApp();
    var openid = app.globalData.openid;
    var user = app.globalData.user;
    var questionsCount = app.globalData.user.questionsCount;

    this.setData({
      openid: openid,
      user: user,
      questionsCount: questionsCount
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var app = getApp();
    var openid = app.globalData.openid;
    db.collection('users').where({
      _openid: openid
    }).get({
      success: res => {
        this.setData({
          questionsCount: res.data[0].questionsCount
        })
      }
    })
    this.getQuizAve(openid)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
})