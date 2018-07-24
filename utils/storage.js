var util = require('util.js');
var app = getApp();

function removeFavoraLine(line){
  var key = 'lines-'+line.city
//   console.log(key);
  try {
    var lines = wx.getStorageSync(key);
    if (lines) {
      var newlines = [];
      for(var i=0;i<lines.length;i++){
          if(lines[i].lineno != line.lineno || lines[i].linedir != line.linedir){
              newlines.push(lines[i]);
          }
      }
      wx.setStorageSync(key, newlines);
    }
  }catch (e) {
      console.log(e)
  }
};
function putFavoraLine(line){
  var key = 'lines-'+line.city;
  try {
    var found = false;
    var lines = wx.getStorageSync(key);
    if (!lines) {
        lines = [line];
    }else {
        for(var i=0;i<lines.length;i++){
            if(lines[i].lineno == line.lineno && lines[i].linedir == line.linedir){
                found = true;
                break;
            }
        }
        if(!found){
            lines.unshift(line);
        }
    }

    if(!found){
        wx.setStorageSync(key, lines);
    }
  }catch (e) {
      console.log(e)
  }
};

function putToHistory(line) {
  var key = 'history-' + line.city;
  try {
    var found = false;
    var lines = wx.getStorageSync(key);
    if (!lines) {
      lines = [line];
    } else {
      for (var i = 0; i < lines.length; i++) {
        var distance = util.getInstance(
          line.latitude, line.longitude, 
          lines[i].latitude, lines[i].longitude, 
        );
        if (lines[i].lineno == line.lineno && distance < 0.5) {
          found = true;
          lines[i] = line;
          break;
        }
      }
      if (!found) {
        lines.unshift(line);
      }
    }

    // console.log(lines)
    wx.setStorageSync(key, lines);
  } catch (e) {
    console.log(e)
  }
};

function removeFromHistory(line) {
  var key = 'history-' + line.city;
  try {
    var found = false;
    var lines = wx.getStorageSync(key);
    if (lines) {
      var newlines = [];
      for (var i = 0; i < lines.length; i++) {
        if (lines[i].lineno != line.lineno || lines[i].linedir != line.linedir || lines[i].sn != line.sn){
          newlines.push(line[i]);
        }
      }
      wx.setStorageSync(key, newlines);
    }
  } catch (e) {
    console.log(e)
  }
};

function getSuggest(cb) {
  app.getLocation(function (location){
    var cityInfo = app.globalData.cityInfo;
    if (!cityInfo){
      console.log("get cityInfo...")
      app.getCityInfo(location.latitude, location.longitude, function () {
        _getSuggest(cb)
      })
    }else {
      _getSuggest(cb)
    }
  });
};

function _getSuggest(cb){
  var cityInfo = app.globalData.cityInfo;
  var location = app.globalData.location;

  var key = 'history-' + cityInfo.city;
  var history = wx.getStorageSync(key);
  if (history) {
    // result
    var suggest_line = [];
    var suggestFound = {};

    // console.log(history);
    for (var i = 0; i < history.length; i++) {
      var lat = history[i].latitude;
      var lng = history[i].longitude;
      var distance = util.getInstance(location.latitude, location.longitude, lat, lng);
      // console.log(location.latitude, location.longitude, lat, lng);
      // console.log(history[i]);
      // console.log("distance:"+distance);
      if (distance < 0.5) {
        var key = history[i].lineno + "." + history[i].linedir;
        if (!suggestFound[key]) {
          var s = history[i];
          s.city = cityInfo.city;
          s.distance = distance;
          suggest_line.push(s);
          suggestFound[key] = true;
        }
      }
    }

    suggest_line.sort(function (a, b) {
      return a.distance - b.distance;
    });

    typeof cb == "function" && cb(suggest_line);
  } else {
    console.log("no history")
  }
}

module.exports = {
  removeFavoraLine: removeFavoraLine,
  putFavoraLine: putFavoraLine,
  putToHistory: putToHistory,
  getSuggest: getSuggest,
  removeFromHistory: removeFromHistory,
}