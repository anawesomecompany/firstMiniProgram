
//index.js
//获取应用实例
const app = getApp()
 
Page({
  data: {
  },
  onLoad: function (options) {
    var that = this;
    var q_id = decodeURIComponent(options.q_id)
    that.setData({
        q_id
    })
    wx.cloud.callFunction({
        name: 'getQRCode',
        data: {
            scene: q_id,
            // page: 'pages/index/index',
            width: 180
        }
    }).then(res => {
        let qr = "data:image/png;base64," + wx.arrayBufferToBase64(res.result)
        that.setData({
            qr
        })
    })

    //console.log(q_id)
    // wx.request({
    //   url: 'https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=33_tkyjcFw_MFDz3pQi0jH51dXPlR-jHET_vZzyJ2Vw_zlRQ6DY7aNgHA7fPrBEko2sEUCWDtGQvM_NJtP3jXiWiZ49fCrjS-bOF8hqa-Yxtzy3Ip65agrmo6jZYTI2OrtllvAFWSYU5SUv49Q6SCFeAEAFPS',
    //   data: {
    //     scene: q_id,
    //     auto_color: true,
    //     // page: "pages/index/index"  //这里按照需求设置值和参数   
    //   },
    //   method: "POST",
    //   responseType: 'arraybuffer',  //设置响应类型
    //   success(res) {
    //     //console.log(res)
    //     var src2 = wx.arrayBufferToBase64(res.data);  //对数据进行转换操作
    //     that.setData({
    //       src2
    //     })
    //   },
    //   fail(e) {
    //     console.log(e)
    //   }
    // })
  },
})