
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName: '',
    avatarUrl: '',
    currentCity: '',
    auto_refresh: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserInfo()
    this.getLocation();
  },
  /* switch 单机事件 */
  setAutoRefresh: function (e) {
    this.setData({
      auto_refresh: e.detail.value
    })
    app.setAutoRefreshFlag(this.data.auto_refresh);
  },
  setRefreshTime: function (e) {
    this.setData({
      refresh_time: e.detail.value
    })
    app.setRefreshTime(this.data.refresh_time);
  },
  bindPickerChange: function (e) {
    this.setData({
      refresh_time_index: e.detail.value
    })
  },

  showPayPic: function () {
    wx.previewImage({
      current: 'pay',
      urls: ["http://140.143.234.132:8000/touxiang.jpeg"]
    });
  },


  getLocation: function () {
    var page = this
    wx.getLocation({
      type: 'wgs84', //<span class="comment" style="margin:0px;padding:0px;border:none;">默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标</span><span style="margin:0px;padding:0px;border:none;"> </span>  
      success: function (res) {
        // success    
        var longitude = res.longitude
        var latitude = res.latitude
        page.loadCity(longitude, latitude)
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  getUserInfo(longitude, latitude) {
    var that = this;
    wx.getUserInfo({
      success: function (res) {
        that.setData({
          nickName: res.userInfo.nickName,
          avatarUrl: res.userInfo.avatarUrl,
        })
      }
    })
  },
  loadCity: function (longitude, latitude) {
    var page = this
    wx.request({
      url: 'https://api.map.baidu.com/geocoder/v2/?ak=pz8dHcKGiQN7GEIPKa5duHTg&location=' + latitude + ',' + longitude + '&output=json',
      data: {},
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        // success    
        console.log(res);
        var city = res.data.result.addressComponent.city;
        page.setData({ currentCity: city });
      },
      fail: function () {
        page.setData({ currentCity: "获取定位失败" });
      },

    })
  }
})