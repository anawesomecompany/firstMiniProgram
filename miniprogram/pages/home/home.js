// pages/home/home.js
Page({
  navigateToQuestion: function (event) {
    wx.navigateTo({
      url: '../question/question',
    })
  }

})