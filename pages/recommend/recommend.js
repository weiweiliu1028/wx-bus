//index.js
//获取应用实例
var busapi = require('../../utils/busapi.js');
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    likeline: null
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var likeline = wx.getStorageSync('likeline');
    this.setData({
      likeline: likeline
    })
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  onShow: function () {
    var likeline = wx.getStorageSync('likeline');
    this.setData({
      likeline: likeline
    })
  },
  jumpToBusline: function (e) {
    console.log(e)
    var data = e.currentTarget.dataset;
    var url = '/pages/busline/busline?city=' + data.city + '&lineno=' + data.lineno + '&linedir=' + data.linedir + '&sn=' + data.sn;
    // console.log(url);
    wx.navigateTo({
      url: url,
    });
  },
})
