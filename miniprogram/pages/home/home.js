// pages/home/home.js
Page({
  navigateToAdd:function(event){
    wx.navigateTo({
      url: '../add/add',
    })
  },

  navigateToGet: function (event) {
    wx.navigateTo({
      url: '../get/get',
    })
  }

})