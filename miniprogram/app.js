//app.js
App({
  onLaunch: function () {

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    var that = this

    // wx.login({
    //   success: function (res) {
    //     if (res.code) {
    //       //发起网络请求
    //       wx.request({
    //         url: 'https://api.techfoco.com/account/wxlogin',
    //         data: {
    //           code: res.code
    //         },
    //         header: {
    //           'Content-Type': 'application/json'
    //         },
    //         success: function (res) {
    //           var res = JSON.parse(res.data);
    //           that.globalData.openid = res.openid;
    //         }
    //       })
    //     } else {
    //       console.log('登录失败！' + res.errMsg)
    //     }
    //   }
    // });
    wx.login({
      success: function (res) {
        if (res.code) {
          var code = res.code; //返回code
          //console.log(code);
          var appId = 'wx58a51cddffa75a36';
          var secret = 'eb0ee757d997a243b1a1f9ec0d4dde12';
          wx.request({
            url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appId + '&secret=' + secret + '&js_code=' + code + '&grant_type=authorization_code',
            data: {},
            header: {
              'content-type': 'json'
            },
            success: function (res) {
              //var res = JSON.parse(res.data);
              that.globalData.openid = res.data.openid;
              console.log("openid is : "+that.globalData.openid);
            }
          })

        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });
  },
  globalData: {
    openid: ''
  }
})