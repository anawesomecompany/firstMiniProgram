//app.js
wx.cloud.init()
const db = wx.cloud.database()


App({
  onLaunch: function () {
    //console.log("in app.js onLaunch")
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'douyouzhe-4r24u',
        traceUser: true,
      })
    }

    let that = this;
    wx.cloud.callFunction({
      name: 'getOpenId',
      complete: res => {
        // console.log(res)
        //console.log('云函数获取到的openid:', res.result.openId)
        var openid = res.result.openId;
        that.globalData.openid = openid;
        this.getUser(openid);
      }
    })
  },

  getUser: function (openid) {
    // console.log("in app.js getUser")
    // console.log("trying to get user with openid = " + openid)

    let that = this;
    db.collection('users').where({
      _openid: openid
    }).get({
      success: res => {
        //console.log(res)
        if (res != '' && res.data != '') {
          //console.log("Successfully get user")
          that.globalData.user = res.data[0]
        } else {
          //console.log("failed to find any user with such openid, so insert new user")
          this.insertUser(openid)
        }
      }
    })
  },

  insertUser: function (openid) {
    console.log("in app.js insertUser")

    db.collection('users').add({
      data: {
        openid: openid
      },
      success: function (res) {
        console.log("Successfully insert user")
        console.log(res)
      }
    })
  },

  globalData: {
    openid: '',
    user:'',
  }
})