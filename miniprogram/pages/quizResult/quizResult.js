// pages/quizResult/quizResult.js
const db = wx.cloud.database()
Page({
  data: {
    score:'',
    //quizHistory:[]
  },

  quit() {
    this.addQuizHistory();
    wx.switchTab({
      url: '../quizEntry/quizEntry',
    })
  },

  addQuizHistory: function () {
    var app = getApp();
    var openid = app.globalData.openid;
    db.collection('users').where({
      openid: openid
    }).get({
      success: res => {
        let quizHistoryOld = []
        quizHistoryOld = res.data[0].quizHistory
        quizHistoryOld.push(this.data.score)
        db.collection('users').doc(app.globalData.user._id).update({
          data: {
            quizHistory: quizHistoryOld
          },
          success: function (res) {
          }
        })
      }
    })
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {

  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {
    let scoreFromQuiz = wx.getStorageSync('quizScore')

    this.setData({
      score: (scoreFromQuiz/15*100).toFixed(1)
    })
  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})