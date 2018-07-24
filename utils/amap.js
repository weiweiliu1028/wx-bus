function locationSuggest(lat,lng,kw,key,cb) {
    var searchUrl = 'https://m.bingbaba.com/v3/assistant/inputtips';
    var url = searchUrl+"?key="+key
    url = url+"&location="+lng+","+lat
    url = url+"&keywords="+kw
    url = url+"&city=beijing"

    wx.request({
        url: url,
        header: {
            'content-type': 'application/json'
        },
        success: function(res) {
            console.log(res.data)
            typeof cb == "function" && cb(res.data)
        }
    })
}

module.exports = {
  locationSuggest: locationSuggest
}