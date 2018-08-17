const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const fs = require('fs')
const os = require('os')
const screenshot = require('desktop-screenshot')
const ifaces = os.networkInterfaces()

let ipList = []
let usersConnected = 0

Object.keys(ifaces).forEach(ifname => {
  ifaces[ifname].forEach(iface => {
    if ('IPv4' !== iface.family || iface.internal !== false) return
    ipList.push({ interface: ifname, address: iface.address })
  })
})

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

io.on('connect', socket => {
  usersConnected++
  console.log(`Users Connected: ${usersConnected}`)
  socket.on('disconnect', () => {
    usersConnected--
    console.log(`Users Connected: ${usersConnected}`)
  })
  socket.on('start', () => {
    setTimeout(() =>{
      screenshot("src/images/screenshot.png", (error, complete) => {
        if (complete) {
          fs.readFile(__dirname + '/images/screenshot.png', (err, buf) => {
            socket.emit('start', { image: true, buffer: buf.toString('base64') })
          })
        }
      })
    }, 20)
  })
})

http.listen(80, () => {
  console.log(`Your network IP's:`)
  ipList.forEach((e, i) => {
    console.log(`${i+1}) ${e.interface}: ${e.address}`)
  })
  console.log('\nLogs:')
})
