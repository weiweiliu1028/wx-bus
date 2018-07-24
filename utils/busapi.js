function getBusLine(line,cb){
    var url = 'https://m.bingbaba.com/rtbus/v2/line/'+line.city+'/'+line.lineno;
    // console.log("getBusLine: "+url);
    if(line.linedir != undefined){
      url += '/'+line.linedir;
    }

    wx.request({
      url: url,
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        // success
        if(res.data.errmsg == "OK") {
          typeof cb == "function" && cb(res.data.data);
        }else {
          console.log(res.data);
        }
      },
      fail: function(res) {
        // fail
      },
      complete: function(res) {
        // complete
      }
    })
};

function getBuses(line, cb) {
    var url = 'https://m.bingbaba.com/rtbus/v2/line/'+line.city+'/'+line.lineno+'/'+line.linedir+'/bus';
    // console.log("getBuses: "+url);

    wx.request({
      url: url,
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        // success
        if(res.data.errmsg == "OK") {
          typeof cb == "function" && cb(res.data.data);
        }else {
          console.log(res.data);
        }
      },
      fail: function(res) {
        // fail
      },
      complete: function(res) {
        // complete
      }
    })
};

function getNearBuses(param,cb){
  // console.log(param)
  var url = 'https://m.bingbaba.com/rtbus/v2/suggest/'+param.lat+'/'+param.lon;
  if(param.lazy){
    url = url+"?lazy=true";
  }
  for(var pkey in param){
    if(pkey=="lat"||pkey=="lon"||pkey=="lazy"){
      continue;
    }
    url = url+"&"+pkey+"="+param[pkey];
  }
  // console.log(url)

  wx.request({
    url: url,
    data: {},
    method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    // header: {}, // 设置请求的 header
    success: function(res){
      // success
      if(res.data.errmsg == "OK") {
        typeof cb == "function" && cb(res.data.data);
      }else {
        console.log(res.data);
      }
    },
    fail: function(res) {
      // fail
    },
    complete: function(res) {
      // complete
    }
  })
};

function getLineOverviewByStation(city,linenos,sn,cb){
  var linenos_str;
  if(linenos instanceof Array){
    linenos_str = linenos.join(",");
  }else {
    linenos_str = linenos;
  }

  var url = 'https://m.bingbaba.com/rtbus/v2/overview/'+city+'/'+linenos_str+'/'+sn;
  // console.log(url);

  wx.request({
    url: url,
    data: {},
    method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    // header: {}, // 设置请求的 header
    success: function(res){
      // success
      if(res.data.errmsg == "OK") {
        typeof cb == "function" && cb(res.data.data);
      }else {
        console.log(res.data);
      }
    },
    fail: function(res) {
      // fail
    },
    complete: function(res) {
      // complete
    }
  })
}

module.exports = {
  getBusLine: getBusLine,
  getBuses: getBuses,
  getNearBuses: getNearBuses,
  getLineOverviewByStation: getLineOverviewByStation,
}