// pages/answer/answer.js
const db = wx.cloud.database()
const questionsCollection = db.collection('questions')
const answersCollection = db.collection('answers')
const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
    question_id: '',
    answer:'',
    answerArr: [],
    answerVisibleToAll: false
  },

  onChange(e) {
    this.setData({
      question_id: e.detail.value,
    })
  },

  onChangeAnswer(e) {
    this.setData({
      answer: e.detail.value,
    })
  },

  findQuestion: function () {
    questionsCollection.where({
      _id: this.data['question_id']
    }).get().then((res)=>{
      const question = res.data[0].question
      const answerVisibleToAll = res.data[0].answerVisibleToAll
      this.setData({
        question,
        answerVisibleToAll
      })
    }).then((res)=>{
      this.refreshAnswer(this.data['answerVisibleToAll'])
    })
  },

  submitAnswer: function () {
    answersCollection.add({
      data: {
        answer: this.data['answer'],
        question_id: this.data['question_id'],
        owner: app.globalData.openid,
        timeStamp: Math.floor(Date.now() / 1000)
      }
    }).then((res)=>{
      this.refreshAnswer(this.data['answerVisibleToAll'])
    })
  },

  refreshAnswer:function(answerVisibleToAll){
    if(!answerVisibleToAll){
      return
    }
    answersCollection.where({
      question_id: this.data['question_id']
    }).get().then((res)=>{
        console.log(res)
        // const question = res.data[0].question
        // console.log(res)
        let array = res.data
        let answerArr = []
        for (var index = 0; index < array.length; index++) { 
          answerArr.push(array[index].answer)
        } 
        this.setData({
          answerArr:answerArr
        })
    }).then(()=>{
      console.log(this.data['answerArr'])
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