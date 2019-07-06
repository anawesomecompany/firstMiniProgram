// pages/user/user.js

const db = wx.cloud.database()
var getUserOkFlag = false;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: '',
    questionsCount: 0,
    user: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    console.log("in user.js onLoad")

    getUserOkFlag = false;

    var app = getApp();
    var openid = app.globalData.openid;

    this.setData({
      openid: openid
    })

    this.getUser(this.data.openid)
    if (getUserOkFlag && this.data.user == '') {
      this.insertUser()
    }
  },

  getUser: function(openid) {
    console.log("in user.js getUser")
    console.log("trying to get user with openid = " + openid)
    db.collection('users').where({
      _openid: openid
    }).get({
      success: res => {
        console.log("Successfully get user")
        getUserOkFlag = true
        console.log(res)
        if(res!='' && res.data!=''){
          this.setData({
            user: res.data[0]
          })
        }else{
          console.log("empty")
        }
      }
    })
  },

  insertUser: function(openid) {
    console.log("in user.js insertUser")

    db.collection('users').add({
      data: {
        openid: openid,
        questionsCount: 0
      },
      success: function(res) {
        console.log("Successfully insert user")
        console.log(res)
      }
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    console.log("in user.js onShow")
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    console.log("in user.js onPullDownRefresh")

    var app = getApp();
    var openid = app.globalData.openid;
    db.collection('users').where({
      openid: openid
    }).get({
      success: res => {
        this.setData({
          questionsCount: this.data.user.questionsCount
        })
      }
    })

    this.getUser(this.data.openid)
    if (getUserOkFlag && this.data.user == '') {
      this.insertUser()
    }

    this.addOneCount();
  },

  addOneCount: function () {
    console.log("in user.js addOneCount")

    const newCount = this.data.user.questionsCount + 1

    db.collection('users').doc(this.data.user._id).update({
      data: {
        questionsCount: newCount
      },
      success: function (res) {
        console.log(res)
      }
    })

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
})