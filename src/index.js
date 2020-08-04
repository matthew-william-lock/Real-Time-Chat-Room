// Imports
const express = require('express')
const path = require('path')
const http = require('http')
const socketio= require('socket.io')
const Filter = require('bad-words')
const{generateMessage,generateLocation} = require('../src/utils/messages')
const {addUser,removeUser,getUser,getUsersInRoom} = require('../src/utils/user')

// Setup the server
const app = express()
const server = http.createServer(app)

// Setup WebSockets
const io = socketio(server)

//Setup port
const port = process.env.PORT

// Define paths
const publicDirectoryPath = path.join(__dirname,'../public')

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

// Event Listenor
io.on('connection',(socket)=>{
    console.log("New WebSocket Connection!")    

    socket.on('join',({username,room},callback)=>{        
        const {error,user} = addUser({id:socket.id,username,room})

        if(error){
            return callback(error)
        }

        // Join a char room
        socket.join(user.room)

        socket.emit('message',generateMessage(user.room,"Welcome to Chat Room!"))    
        socket.broadcast.to(room).emit('message',generateMessage(user.room,`${user.username} has joined!`))
        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUsersInRoom(user.room)
        })

        callback()
    })

    socket.on('client-message',(msg,callback)=>{

        const filter = new Filter()

        if(filter.isProfane(msg.msg)){
            return callback('Profanity is not allowed!')
        }

        const user = getUser(socket.id)
        if(!user){
            return callback("User has been removed from room...")
        }

        io.to(user.room).emit('message',generateMessage(user.username,`${msg.msg}`))
        callback()
    })

    socket.on('location',(position,ack)=>{
        // console.log(position)

        const user = getUser(socket.id)
        if(!user){
            return ack("User has been removed from room...")
        }

        socket.broadcast.to(user.room).emit('locationMessage',generateLocation(user.username,`https://google.com/maps?q=${position.lat},${position.long}`))
        ack()
    })

    socket.on('disconnect',()=>{
        const user = removeUser(socket.id)

        if(user) {
            io.to(user.room).emit('message',generateMessage(user.room,`${user.username} has left!`))
            io.to(user.room).emit('roomData',{
                room:user.room,
                users:getUsersInRoom(user.room)
            })
        }
        
    })

})

// Start server
server.listen(port,()=>{
    console.log(`Server is up on port ${port}:`)
})