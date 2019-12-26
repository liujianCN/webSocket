const express = require('express')
const app = express()


var http = require('http').createServer(app);
var io = require('socket.io')(http);


var list = [];

function pushCount(){
  io.emit('count', list.length)
}
io.on('connection', socket => {
  console.log('连接了')
  //定时发送消息
  // setInterval(()=>{
  //   io.emit('chat message', 'hello world' + new Date())
  // },2000)
  socket.on('login', name => {
    if (['刘健', '刘永辉', '梁爽', '王硕'].includes(name)) {
      console.log(name + '登录了')
      socket.userName = name;

      if (list.some(item => {
        if (item.userName === name) {
          item.emit('login', { ok: false, code: '002' })
          return true
        }
        return false
      })) {
        console.log(name+'重新登陆')
        const newList = list.filter(item => item.userName !== name)
        // console.log(newList.length)
        // console.log(newList)
        newList.push(socket)
        list = newList;
        socket.emit('login', { ok: true, code: '001', name })
      } else {
        console.log(name+'第一次登陆')
        list.push(socket)
        socket.emit('login', { ok: true, code: '001', name})
      }
      pushCount()
    } else {
      socket.emit('login', { ok: false, code: '003' })
    }
  })
  socket.on('send chat message', msg => {
    console.log(msg)
    list.forEach(item => {
      item.emit('chat message', { userName: socket.userName, msg: msg })
    })
  })
  socket.on('disconnect', () => {
    list = list.filter(item => item !== socket)
    pushCount()
  })
});


app.use(express.static(__dirname + '/client'))

app.get('/', function (req, res) {
  res.send('Hello World')
})
app.get('*', function (req, res) {
  res.sendFile(__dirname + '/client/index.html')
})

http.listen(3000, function () {
  console.log('listening on *:3000');
});