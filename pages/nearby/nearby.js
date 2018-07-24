//index.js
//获取应用实例
var busapi = require('../../utils/busapi.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardIndex: -1,
    nearestStation: null,
    dataList: [
      {
        ca_name: '郑常庄',
        ca_name1: '经停:1条',
        ca_name2: "实时:1条",
        bound: "473路",
        bound1: "开往:六里桥北",
        cameras: [
        ]
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.refreshLoacation()
  },
  showCardList: function (e) {
    var that = this;
    console.log(e.currentTarget.dataset.index);
    // console.log(this.data.cardIndex);
    if (e.currentTarget.dataset.index == this.data.cardIndex) {
      this.setData({ 'cardIndex': -1 });
    } else {
      this.setData({ "cardIndex": e.currentTarget.dataset.index });
      var sindex = e.currentTarget.dataset.index;
      var nss = this.data.nearestStation;
      var ns = nss[sindex];
      this.setData({
        nearestStation: nss,
      });
      busapi.getLineOverviewByStation(ns.city, ns.linenos, ns.sn, function (data) {
        ns.lines = data;
        nss[sindex] = ns;

        // 读取已收藏线路列表
        var likeLine = wx.getStorageSync('likeline');
        if (likeLine != '') {
          // 获取是否是否收藏
          nss.forEach(val => {
            val.lines.forEach(v => {
              likeLine.forEach(ll => {
                if (v.lineno == ll.lineno) {
                  v.isLike = true;
                }
              });
            });
          });
        }
        console.log(nss)

        that.setData({
          nearestStation: nss,
        });
      })
    }



  },
  refreshLoacation: function () {
    var that = this;
    wx.getLocation({
      success: function (res) {
        // console.log(res)
        if (!res) {
          return;
        }

        var lat = res.latitude;
        var lon = res.longitude;

        var param = {
          lat: lat,
          lon: lon,
          lazy: true,
          nickname: '111'
        }

        wx.showLoading({
          title: '附近公交...',
        });
        // 获取附近公交数据
        busapi.getNearBuses(param, function (data) {
          wx.hideLoading();

          console.log(data);

          data[0].expand = true;
          data[0].geted = true;

          that.setData({
            nearestStation: data
          });
          // console.log(nearestStation)
        })
      },
    })
  },
  jumpToBusline: function (e) {
    var data = e.currentTarget.dataset;
    var url = '/pages/busline/busline?city=' + data.city + '&lineno=' + data.lineno + '&linedir=' + data.linedir + '&sn=' + data.sn;
    // console.log(url);
    wx.navigateTo({
      url: url,
    });
  },
  // 收藏
  likeLine: function (e) {
    console.log(e)
    // 点击线路完整信息
    var line = e.currentTarget.dataset.line
    //  取出已经收藏的线路列表
    var likeline = wx.getStorageSync('likeline');
    console.log(likeline)
    //判断已收藏的是否为空
    if (likeline == '') {
      //如果是空就办成空数组
      likeline = []
    }
    var islike = false
    //循环已收藏的列表，判断当前线路是否收藏
    likeline.forEach(val => {
      if (val.lineno == line.lineno) {
        islike = true;
      }
    })
    //如果没收藏 ，就添加到已收藏列表
    if (islike == false) {
      line.sn = e.currentTarget.dataset.sn;
      line.city = e.currentTarget.dataset.city;
      likeline.push(line)
    } else {
      //如果已收藏 ，就删除选中
      var newLikeLine = [];
      likeline.forEach(val => {
        if (val.lineno != line.lineno) {
          newLikeLine.push(val);
        }
      })
      likeline = newLikeLine;
    }
    // 改变当前点击心
    var nearestStation = [];
    this.data.nearestStation.forEach(val => {
      val.lines.forEach(v => {
        if (v.lineno == line.lineno) {
          v.isLike = !islike;
        }
      });
      nearestStation.push(val);
    });
    console.log(nearestStation);
    wx.setStorageSync('likeline', likeline)
    this.setData({
      nearestStation: nearestStation
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})