var amap = require('../../utils/amap.js');
var busapi = require('../../utils/busapi.js');
var storage = require('../../utils/storage.js');
var app = getApp()
Page({
    data: {
        busline:{},
        buses:{},
        nearbuses:{},
        // location:{},
        chooseline:{
            lineno:"",
            linedir:"",
            city:"",
            latitude:0,
            longitude:0
        },     
        refreshTimer:null,
        screenHeight: 600,
    },
    onUnload:function(){
        if (this.data.refreshTimer) {
          clearInterval(this.data.refreshTimer);
        }
    },
    onHide: function () {
      if (this.data.refreshTimer){
        clearInterval(this.data.refreshTimer);
      }
    },
    onLoad: function(opt){
        var that = this;
        var res = app.getSystemInfo();
        that.setData({
            screenHeight: res.windowHeight
        })

        var chooseline = this.data.chooseline;
        var location = app.globalData.location;
        if(location){
          chooseline.latitude = location.latitude;
          chooseline.longitude = location.longitude;
        }
        
        if(opt.city != undefined){
            chooseline.city = opt.city;
        }
        if(opt.lineno != undefined){
            chooseline.lineno = opt.lineno;
        }
        if(opt.linedir != undefined){
            chooseline.linedir = opt.linedir;
        }
        if(opt.sn != undefined){
            chooseline.sn = opt.sn;
        }
        if(opt.order != undefined){
            chooseline.order = opt.order;
        }

        storage.putToHistory(chooseline);
        storage.putFavoraLine(chooseline);

        // getBusLine
        busapi.getBusLine(chooseline,function(data){
            that.setData({
                busline: data
            });
            wx.hideLoading (); 

            chooseline.linedir = data.startsn + "-" + data.endsn;
            //the station order
            for(var i=0;i<data.stations.length;i++){
                if(data.stations[i].sn == that.data.chooseline.sn){
                    
                    chooseline.order = data.stations[i].order;
                    that.setData({
                        chooseline: chooseline
                    });
                    break;
                }
            }
            that.setData({
                chooseline: chooseline
            });

            //saveStorage
            // console.log(chooseline);
        });

        // this.setAutoRefresh(this.data.autoRefresh);
    },

    onShow: function () {
      this.getBuses();
      if(app.getAutoRefreshFlag()){
        var refresh_time = app.getRefreshTime();
        this.setData({
          refreshTimer: setInterval(this.getBuses, refresh_time*1000)
        });
      }
    },

    // setAutoRefresh: function(flag){
    //     var that = this;
    //     var oldAutoRefresh = that.data.autoRefresh;
    //     if(typeof flag == "boolean"){
    //         if(flag==oldAutoRefresh){
    //             clearInterval(that.data.refreshTimer);
    //         }
    //         that.setData({
    //             autoRefresh: flag
    //         });
    //     }else{
    //         that.setData({
    //             autoRefresh: !oldAutoRefresh
    //         });
    //     }
        
    //     if(that.data.autoRefresh){
    //         that.getBuses();

    //         var refreshInterval = app.getRefreshTime();
    //         that.setData({
    //             refreshTimer:setInterval(that.getBuses, that.data.refreshInterval)
    //         });
    //     }else {
    //         clearInterval(that.data.refreshTimer);
    //     }
    // },
    
    getBuses:function(e){
        // console.log(this.data.chooseline);
        var that = this;
        busapi.getBuses(that.data.chooseline,function(data){
            that.setData({
                buses:  data
            });

            //nearby buses
            var nearbuses = [];
            for(var i=data.length-1;i>=0;i--){
                // console.log(data[i]);
                if(data[i].order <= that.data.chooseline.order){
                    nearbuses.push(data[i]);
                    if(nearbuses.length >= 3){
                        break;
                    }
                }
            }
            that.setData({
                nearbuses: nearbuses,
            });

            if(typeof e != "undefined"){
                wx.showToast({
                    title: '数据刷新中',
                    icon: 'loading',
                    duration: 2000
                });
            }
            // console.log("refresh over!");
        });
    },
    buslineReserve: function(e){
        // wx.showToast({
        //     title: '数据刷新中',
        //     icon: 'loading',
        //     duration: 100
        // });
        wx.showLoading({
            title: '更换方向...'
        })
        // console.log(e);
        var that = this;
        that.onLoad({
            linedir: that.data.busline.otherDirIds[0],
        })
    },
});