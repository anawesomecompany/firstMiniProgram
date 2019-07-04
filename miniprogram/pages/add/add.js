const db = wx.cloud.database()
const javaCoreQuestionsCollection = db.collection('java_core_questions')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  addData: function (event) {
    console.log(event)
    javaCoreQuestionsCollection.add({
      data:{
        question:"do you know java",
        answer: "fuck off"
      },
      success:res=>{
        console.log(res)
      }
    })
  },
})