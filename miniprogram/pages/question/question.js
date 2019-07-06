// pages/question/question.js
const db = wx.cloud.database()
const questions = db.collection('java_core_questions')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showAnswer: false
  },

  resetQuestion: function () {
    console.log("in question.js resetQuestion")
    questions.get().then(res => {
      var size = res.data.length
      var rand = Math.floor(Math.random() * size)
      this.setData({
        q: res.data[rand]
      })
    })
  },

  addOneCount: function () {
    console.log("in question.js addOneCount")

    var app = getApp();
    var openid = app.globalData.openid;
    var oldCount = 0;
    db.collection('users').where({
      openid: openid
    }).get({
      success: res => {
        oldCount = res.data[0].questionsCount
        db.collection('users').doc(app.globalData.user._id).update({
          data: {
            questionsCount: oldCount+1
          },
          success: function (res) {
            //console.log(res)
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    console.log("in question.js onLoad")
    this.resetQuestion();
  },

  showAnswer:function(){
    console.log("in question.js showAnswer")
    this.setData({
      showAnswer: true
    })
  },

  showNext:function(){
    console.log("in question.js showNext")
      this.setData({
        showAnswer: false
      })
    this.resetQuestion();
    this.addOneCount();
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
