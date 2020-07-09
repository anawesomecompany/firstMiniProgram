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
    question_type: '',
    choices:'',
    images_arr:[],
    my_answer_content:'',
    my_choice:'',
    answer_arr: [],
    answer_visible_to_all: false,
    showAnswerTextArea: false,
    showTextChoicesArea: false,
    showImageChoicesArea: false,
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

  onChange3(e) {
    if (this.data.preEvent != '') {
      this.onResetCheckBox(this.data.preEvent);
    }
    this.setData({
      preEvent: e
    })
    this.onChangeCheckBox('value3', e)
  },

  onResetCheckBox(e){
    e.detail.checked = false;
    this.onChange('value3',e);
  },

  onChange(e) {
    this.setData({
      question_id: e.detail.value,
    })
  },

  onChangeAnswer(e) {
    this.setData({
      my_answer_content: e.detail.value,
    })
  },

  findQuestion: function () {
    questionsCollection.where({
      _id: this.data['question_id']
    }).get().then((res)=>{
      // const question = res.data[0].question
      // const answer_visible_to_all = res.data[0].answer_visible_to_all
      this.setData({
        question_type: res.data[0].question_type,
        answer_visible_to_all: res.data[0].answer_visible_to_all,
        showAnswerTextArea: this.data.question_type === 'regular',
        showTextChoicesArea: this.data.question_type === 'textPoll',
        showImageChoicesArea: this.data.question_type === 'imagePoll',
      })
    }).then((res)=>{
      // this.refreshAnswer(this.data['answer_visible_to_all'])
      // console.log(this.data.question_type === 'textPoll')
      // console.log(this.data.showAnswerTextArea)
      // console.log(this.data.showTextChoicesArea)
      // console.log(this.data.showImageChoicesArea)

    })
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

  submitAnswer: function () {
    answersCollection.add({
      data: {
        answer: this.data['my_answer_content'],
        question_id: this.data['question_id'],
        owner: app.globalData.openid,
        timeStamp: Math.floor(Date.now() / 1000)
      }
    }).then((res)=>{
      this.refreshAnswer(this.data['answer_visible_to_all'])
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
          answer_arr:answerArr
        })
    }).then(()=>{
      console.log(this.data['answer_arr'])
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