// pages/user/user.js
const app = getApp()
const db = wx.cloud.database()
const questionsCollection = db.collection('questions')

Page({

  /**
   * Page initial data
   */
  data: {
    questionArr:[]
  },

  onPullDownRefresh: function() { 
    this.onLoad()
   },

  findQuestion: function () {
    questionsCollection.where({
      _openid: app.globalData.openid,
    }).get().then((res)=>{
      let array = res.data
      let questionArr = []
      for (var index = 0; index < array.length; index++) { 
        questionArr.push(array[index].question)
      } 
      this.setData({
        questionArr: questionArr
      })
    })
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    wx.stopPullDownRefresh()
    this.findQuestion()
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