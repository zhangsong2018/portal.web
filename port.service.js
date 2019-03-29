var express = require('express')
var compression = require('compression')
var config = require('./config/index')
var axios = require('axios')
var port = process.env.PORT || config.build.port
var port = 9001 
var app = express()

var apiRoutes = express.Router()


apiRoutes.post('/Org/OrgStruct', function (req, res) {
  var url = 'http://jujia01.ycsenior.com:5005'
  axios.post(url, {
    headers: {
      referer: 'https://jujia01.ycsenior.com:5005',
      host: 'jujia01.ycsenior.com:5005'
    },
    params: req.query
  }).then((response) => {
    var ret = response.data
    if (typeof ret === 'string') {
      var reg = /^\w+\(({.+})\)$/
      var matches = ret.match(reg)
      if (matches) {
        ret = JSON.parse(matches[1])
      }
    }
    res.json(ret)
  }).catch((e) => {
    console.log(e)
  })
})




app.use('/api', apiRoutes)

//app.use(compression())

app.use(express.static('./dist'))

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:' + port + '\n')
})