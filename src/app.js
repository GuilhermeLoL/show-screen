const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const fs = require('fs')
const screenshot = require('desktop-screenshot')

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

io.on('connect', socket => {
  console.log('user has connected')
  socket.on('disconnect', () => console.log('user has disconnected'))
  socket.on('start', () => {
    setTimeout(() =>{
      screenshot("src/images/screenshot.png", (error, complete) => {
        if (complete) {
          fs.readFile(__dirname + '/images/screenshot.png', (err, buf) => {
            socket.emit('start', { image: true, buffer: buf.toString('base64') })
          })
        }
      })
    }, 100)
  })
})

http.listen(80, () => console.log('Express is running'))
