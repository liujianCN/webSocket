const express = require('express')
const app = express()


var http = require('http').createServer(app);
var io = require('socket.io')(http, {
  path: '/line'
});

const data = {
  xAxis: [
    {
      type: 'category',
      boundaryGap: false,
      data: []
    }
  ],
  series: [
    {
      name: '餐食',
      type: 'line',
      stack: '总量',
      areaStyle: {},
      data: []
    },
    {
      name: '行李',
      type: 'line',
      stack: '总量',
      areaStyle: {},
      data: []
    },
    {
      name: '保险',
      type: 'line',
      stack: '总量',
      areaStyle: {},
      data: []
    }
  ]
}

function getData(n) {
  data.xAxis[0].data.push(n * 2)
  data.xAxis[0].data.length = n + 1
  data.series.forEach(item => {
    item.data.push(Math.random().toFixed(2) * 400 + 100)
    item.data.length = n + 1
  })
}


let total = 0
let count = 0;

setInterval(() => {
  count = count > 11 ? 0 : count
  getData(count++)
  io.emit('send line data', data)
}, 5000)

setInterval(() => {
  total += parseInt(Math.random() * 1000)
  io.emit('total price', total)
}, 2000)


// io.on('connection', socket => {
//   console.log('连接了')
//   // 定时发送消息
// });

http.listen(3000, function () {
  console.log('listening on *:3000');
});