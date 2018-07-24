//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },

  getCityInfo: function (lat, lon, cb) {
    var that = this;
    if (that.globalData.cityInfo) {
      typeof cb == "function" && cb(that.globalData.cityInfo);
      return;
    }

    var url = 'https://m.bingbaba.com/rtbus/v2/cityinfo/' + lat + '/' + lon;
    wx.request({
      url: url,
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (city_res) {
        // success
        if (city_res.data.errmsg == "OK") {
          that.globalData.cityInfo = city_res.data.data;
        } else {
          console.log(city_res.data);
        }
      },
      fail: function (city_res) {
        // fail
      },
      complete: function (city_res) {
        // complete
        typeof cb == "function" && cb(city_res.data);
      }
    })
  },
  getLocation: function (cb) {
    var that = this;
    if (that.locationShouldRefresh()) {
      console.log("重新定位...")
      wx.showLoading({
        title: '定位中...',
      });
      wx.getLocation({
        type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
        success: function (res) {
          wx.hideLoading();

          that.globalData.location = res;
          that.globalData.location_time = new Date().getTime() / 1000;

          that.getCityInfo(res.latitude, res.longitude, function () {
            typeof cb == "function" && cb(res);
          })


          // success
          // console.log(res)

          // wx.setStorageSync("location", res);
          // wx.setStorageSync("location_time", new Date().getTime() / 1000);
        },
        fail: function (res) {
          wx.hideLoading();

          wx.showToast({
            title: '定位失败',
            icon: 'success',
            duration: 2000
          });

          console.log(res);
        },
        complete: function (res) {
          // complete
        }
      });
    } else {
      cb(that.globalData.location);
    }
  },
  getSystemInfo: function () {
    var that = this;
    if (this.globalData.systemInfo) {
      return that.globalData.systemInfo;
    } else {
      try {
        var res = wx.getSystemInfoSync();
        that.globalData.systemInfo = res;
        return res;
      } catch (e) {
        console.log(e);
      }
    }
  },
  locationShouldRefresh: function () {
    var that = this;
    var location = that.globalData.location;
    var location_time = that.globalData.location_time;
    if (!location || !location_time ||
      location_time - new Date().getTime() / 1000 > 60
    ) {
      return true;
    } else {
      return false;
    }
  },
  getRefreshTime: function () {
    var rt = wx.getStorageSync("refresh_time");
    if (!rt) {
      return 20;
    } else {
      return rt;
    }
  },
  setRefreshTime: function (rt) {
    wx.setStorageSync("refresh_time", rt);
  },
  getAutoRefreshFlag: function () {
    var ar = wx.getStorageSync("auto_refresh");
    if (undefined == ar) {
      return false;
    } else {
      return ar;
    }
  },
  setAutoRefreshFlag: function (ar) {
    wx.setStorageSync("auto_refresh", ar);
  },

  //global
  globalData: {
    userInfo: null,
    location: null,
    location_time: 0,
    systemInfo: null,
    cityInfo: null,
  }
})