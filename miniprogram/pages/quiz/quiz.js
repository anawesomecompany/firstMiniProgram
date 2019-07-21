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
     q:''
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
    this.onChange('value3', e)
  },
  formSubmit(e) {
    //console.log('form发生了submit事件，携带数据为：', e.detail.value.choice[0])
    //console.log(e.detail.value.choice.length)
    if (e.detail.value.choice.length==1 &&
      e.detail.value.choice[0]==this.data.q.answer){
      this.showToast()
    }else{
      this.showToastCancel()
    }
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    mcqCollection.get().then(res => {
      this.setData({
        q: res.data[0]
      })
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

  showToast() {
    $wuxToast().show({
      type: 'success',
      duration: 500,
      color: '#fff',
      text: 'Bingo',
      success: () => console.log('Bingo')
    })
  },
  showToastCancel() {
    $wuxToast().show({
      type: 'cancel',
      duration: 500,
      color: '#fff',
      text: 'Wrong',
      success: () => console.log('Wrong')
    })
  },
})