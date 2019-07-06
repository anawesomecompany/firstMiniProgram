//app.js
App({
  onLaunch: function () {

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
        // console.log('云函数获取到的openid:', res.result.openId)
        var openid = res.result.openId;
        that.globalData.openid = openid;
      }
    })
  },
  globalData: {
    openid: ''
  }
})