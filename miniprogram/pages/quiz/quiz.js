// pages/quiz/quiz.js

import { $wuxToast } from '../../wux-weapp/index'
const db = wx.cloud.database()
const mcqCollection = db.collection('java_quiz_mcq')
Page({

  /**
   * Page initial data
   */
  data: {
     value3: [],
     score:0,
     q_num:0,
     preEvent: ''
  },

  onChange(field, e) {
    const { value } = e.detail
    const data = this.data[field]
    const index = data.indexOf(value)
    const current = index === -1 ? [...data, value] : data.filter((n) => n !== value)
    this.setData({
      [field]: current,
    })
    //console.log('checkbox发生change事件，携带value值为：', e.detail.value)
  },

  onChange3(e) {
    if (this.data.preEvent != '') {
      this.onResetCheckBox(this.data.preEvent);
    }
    this.setData({
      preEvent: e
    })
    this.onChange('value3', e)
  },
  formSubmit(e) {
    //console.log('form发生了submit事件，携带数据为：', e.detail.value.choice[0])
    //console.log(e.detail.value.choice.length)
    if (e.detail.value.choice.length==1 &&
      e.detail.value.choice[0]==this.data.q.answer){
      this.setData({
        score:this.data.score+1
      })
      this.showToast()
    }else{
      this.showToastCancel()
    }
    this.next();
    if (e.detail.value.choice.length != 0){
      this.onResetCheckBox(this.data.preEvent);
    }
    this.data.preEvent = ''
  },

  onResetCheckBox(e){
    e.detail.checked = false;
    this.onChange('value3',e);
  },


  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    mcqCollection.get().then(res => {
      res.data.sort(function () {
        return .5 - Math.random();
      });

      this.setData({
        qs: res.data
      })
      this.setData({
        q: this.data.qs[this.data.qs.length - 1]
      })
    })
  },

  next:function(){
    if(this.data.qs.length==0){
      this.quit();
    }
    this.data.qs.pop();
    this.setData({
      q: this.data.qs[this.data.qs.length - 1]
    })
    this.setData({
      q_num: this.data.q_num + 1
    })
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

  },
  quit() {
    wx.setStorageSync('quizScore', this.data.score)
    wx.redirectTo({
      url: '../quizResult/quizResult',
    })
  },

  showToast() {
    $wuxToast().show({
      type: 'success',
      duration: 1000,
      color: '#fff',
      text: 'Bingo'
    })
  },
  showToastCancel() {
    $wuxToast().show({
      type: 'cancel',
      duration: 1000,
      color: '#fff',
      text: 'Wrong'
    })
  },
})