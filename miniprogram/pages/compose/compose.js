// pages/ask/ask.js
const db = wx.cloud.database()
const questionsCollection = db.collection('questions')
const app = getApp()

Page({
  /**
   * Page initial data
   */
  data: {
    userID: app.globalData.openid,
    question: '',
    question_id: '',
    answerVisible: [],
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
      question: e.detail.value,
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

    //TODO: write to questions DB
    questionsCollection.add({
      data: {
        question: this.data['question'],
        owner: app.globalData.openid,
        answerVisibleToAll: this.data['answerVisible'].length != 0,
        timeStamp: Math.floor(Date.now() / 1000)
      }
    }).then((res) => {
      this.setData({
        question_id: res._id
      })
    }).then((res) => {
      let q_id = this.data['question_id']
      wx.navigateTo({
        url: `../qrcode/qrcode?q_id=${q_id}`
      })
      // clear state data
      this.setData({
        userID: app.globalData.openid,
        question: '',
        question_id: '',
        answerVisible: [],
        fileList: [],
        optionTextList: [],
        uploadButtonLabel: "图片",
        pollButtonLabel: "投票",
        showUpload: false,
        showPoll: false,
        isPoll: false,
        isPollImage: false,
      });
    })
  },

  onChangeCheckBoxAnswerVisible(e) {
    this.onChangeCheckBox('answerVisible', e)
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