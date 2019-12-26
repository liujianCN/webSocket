const express = require('express')
const app = express()


var http = require('http').createServer(app);
var io = require('socket.io')(http);

const source = [
    ['product'],
    ['餐食'],
    ['行李'],
    ['保险']
  ]

/**
 * @description: 每隔一段时间向source里的每一项push一项数据
 */
function getData(n) {
  source[0].push(n * 2)
  source[0].length = n + 2
  source.forEach((item, i) => {
    if (i > 0) {
      item.push(Math.random().toFixed(2) * 400 + 100)
      item.length = n + 2
    }
  })
}


let total = 0
let count = 0;

setInterval(() => {
  count = count > 11 ? 0 : count
  getData(count++)
  io.emit('send bar data', source)
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