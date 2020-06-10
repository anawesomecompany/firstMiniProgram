// pages/ask/ask.js
const db = wx.cloud.database()
const questionsCollection = db.collection('questions')
const app = getApp()

Page({
  /**
   * Page initial data
   */
  data: {
    question : '',
    question_id: '',
    answerVisible: [],
  },

  onChange(e) {
    this.setData({
      question: e.detail.value,
    })
  },

  submitQuestion(){
    //TODO: write to questions DB
    questionsCollection.add({
      data: {
        question: this.data['question'],
        owner: app.globalData.openid,
        answerVisibleToAll: this.data['answerVisible'].length != 0
      }
    }).then((res)=>{
      this.setData({
        question_id: res._id
      })
    }).then((res)=>{
      let q_id = this.data['question_id']
      wx.navigateTo({
        url: `../qrcode/qrcode?q_id=${q_id}`
      })
      // console.log(q_id)
    })
  },

  onChangeCheckBoxAnswerVisible(e) {
    this.onChangeCheckBox('answerVisible', e)
  },

  onChangeCheckBox(field, e) {
    const { value } = e.detail
    const data = this.data[field]
    const index = data.indexOf(value)
    const current = index === -1 ? [...data, value] : data.filter((n) => n !== value)
    this.setData({
        [field]: current,
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
    wx.stopPullDownRefresh()
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