// pages/ask/ask.js
const db = wx.cloud.database()
const questionsCollection = db.collection('questions')
const imagesCollection = db.collection('images')
const choicesCollection = db.collection('choices')
const app = getApp()

Page({
  /**
   * Page initial data
   */
  data: {
    userID: app.globalData.openid,
    question_content: '',
    question_id: '',
    answer_visible_to_all: [],
    fileList: [],
    optionTextList: [],
    uploadButtonLabel: "图片",
    pollButtonLabel: "投票",
    showUpload: false,
    showPoll: false,
    isPoll: false,
    isPollImage: false,
  },
  onChange(e) {
    this.setData({
      question_content: e.detail.value,
    })
  },
  onClickUpload() {
    const updatedFlag = !this.data.showUpload;
    this.setData({
      fileList: [],
      optionTextList: [],
      isPoll: false,
      userID: app.globalData.openid,
    });
    this.setData({
      showUpload: updatedFlag,
      uploadButtonLabel: updatedFlag ? "取消上传" : "图片",
      showPoll: false,
      pollButtonLabel: "投票",
    });
  },
  onClickPoll(e) {
    const updatedFlag = !this.data.showPoll;
    if (updatedFlag) {
      const t = this;
      wx.showActionSheet({
        itemList: ['图片选项', '文字选项'],
        success(res) {
          t.setData({
            fileList: [],
            pollList: [],
            isPoll: true,
            userID: app.globalData.openid,
            showPoll: updatedFlag,
            pollButtonLabel: updatedFlag ? "取消选项" : "投票",
            showUpload: false,
            uploadButtonLabel: "图片",
          });
          if (res.tapIndex === 0) {
            t.setData({
              isPollImage: true
            });
          } else {
            t.setData({
              isPollImage: false
            });
          }
        }
      })
    } else {
      this.setData({
        fileList: [],
        optionTextList: [],
        isPoll: true,
        userID: app.globalData.openid,
        showPoll: updatedFlag,
        pollButtonLabel: updatedFlag ? "取消选项" : "投票",
        showUpload: false,
        uploadButtonLabel: "图片",
      });
    }
  },
  onUploadChange(e) {
    const {
      file,
      fileList
    } = e.detail
    if (file.status === 'uploading') {
      this.setData({
        progress: 0,
      })
      wx.showLoading()
    } else if (file.status === 'done') {
      this.setData({
        imageUrl: file.url,
      })
    }

    // Controlled state should set fileList
    this.setData({
      fileList
    })
  },
  onOptionTextListChange(e) {
    this.setData({
      optionTextList: e.detail.optionTextList
    });
  },
  onUploadSuccess(e) {
    // image path in e.detail.file.res.fileID
    // console.log('onSuccess', e)
    // console.log('files', this.data.fileList);
  },
  onUploadFail(e) {
    // console.log('onFail', e)
  },
  onUploadComplete(e) {
    // console.log('onComplete', e)
    wx.hideLoading()
  },
  onUploadProgress(e) {
    // console.log('onProgress', e)
    this.setData({
      progress: e.detail.file.progress,
    })
  },
  onUploadPreview(e) {
    console.log('onPreview', e)
    const {
      file,
      fileList
    } = e.detail
    wx.previewImage({
      current: file.url,
      urls: fileList.map((n) => n.url),
    })
  },
  onUploadRemove(e) {
    const {
      file,
      fileList
    } = e.detail
    wx.showModal({
      content: '确定删除？',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            fileList: fileList.filter((n) => n.uid !== file.uid),
          })
        }
      },
    })
  },

  submitQuestion() {
    console.log('fileList: ', this.data.fileList);
    console.log('optionTextList: ', this.data.optionTextList);

    const indexLetter = ['A','B','C','D','E','F','G','H','I']
    const question_type = this.data.isPoll? (this.data.isPollImage? 'imagePoll':'textPoll'): 'regular'

    let question_data = {
      question_content: this.data['question_content'],
      owner_id : this.data['userID'],
      answer_visible_to_all: this.data['answer_visible_to_all'].length==1,
      answers_count: 0,
      question_type: question_type,
      time_stamp: Math.floor(Date.now() / 1000)
    }

    // console.log(question_data)

    questionsCollection.add({
      data: question_data
    }).then((res) => {
      this.setData({
        question_id: res._id
      })
    }).then((res) => {
      const fileList = this.data['fileList']
      for (let index = 0; index < fileList.length; index++) { 
        imagesCollection.add({
          data: {
            image_id: fileList[index].res.fileID,
            question_id: this.data['question_id']
          }
        }).then((res) => {
          console.log('images saved')
        }) 

        if(question_type === 'imagePoll'){
          choicesCollection.add({
            data: {
              choice_content: fileList[index].res.fileID,
              question_id: this.data['question_id'],
              index: indexLetter[index]
            }
          }).then((res) => {
            console.log('choices saved')
          }) 
        }
      }
    
      if(question_type === 'textPoll'){
        const optionTextList = this.data.optionTextList
        for (let index = 0; index < optionTextList.length; index++) { 
          choicesCollection.add({
            data: {
              choice_content: optionTextList[index],
              question_id: this.data['question_id'],
              index: indexLetter[index]
            }
          }).then((res) => {
            console.log('choices saved')
          }) 
        }
      }
    }).then((res) => {
      let q_id = this.data['question_id']
      wx.navigateTo({
        url: `../qrcode/qrcode?q_id=${q_id}`
      })
    }) 
  },

  onChangeCheckBoxAnswerVisible(e) {
    this.onChangeCheckBox('answer_visible_to_all', e)
  },

  onChangeCheckBox(field, e) {
    const {
      value
    } = e.detail
    const data = this.data[field]
    const index = data.indexOf(value)
    const current = index === -1 ? [...data, value] : data.filter((n) => n !== value)
    this.setData({
      [field]: current,
    })
    console.log(current)
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