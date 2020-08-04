const socket = io()

// Elements
const $messages = document.querySelector("#messages") 

// Templates
const messageTemplate = document.querySelector("#message-template").innerHTML
const locationTemplate = document.querySelector("#location-template").innerHTML
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML

// Options
const {username,room} = Qs.parse(location.search,{
    ignoreQueryPrefix:true
})

const autoScroll = () => {
    // New message elements
    const $newMessage = $messages.lastElementChild

    // Heigh of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible Height
    const visibleHeight = $messages.offsetHeight

    // Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have i scrolled
    const scrollOffSet =$messages.scrollTop + visibleHeight

    if(containerHeight - newMessageHeight <= scrollOffSet){
        $messages.scrollTop = $messages.scrollHeight
    }

    console.log(newMessageMargin)
}


// Message recieved from other clients
socket.on('message',(message)=>{
    console.log(message)
    const html = Mustache.render(messageTemplate,{
        username:message.username,
        message:message.text,
        createdAt:moment(message.createdAt).format('H:mm')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoScroll()
})

// Recieve Location
socket.on('locationMessage',(location)=>{
    console.log(location)
    const html = Mustache.render(locationTemplate,{
        username:location.username,
        url:location.url,
        createdAt:moment(location.createdAt).format('H:mm')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoScroll()
})

socket.on('server-message',(message)=>{
    console.log(message.text)
})

// Update list of users
socket.on('roomData',({room,users})=>{  
    console.log(users)  
    const html = Mustache.render(sidebarTemplate,{
        room,
        users
    })
    document.querySelector("#sidebar").innerHTML=html
})

// Share Location
const btnLocation = document.querySelector('#btn-share-loc')
btnLocation.addEventListener('click',() =>{    
    if (!navigator.geolocation){
        return alert('Geolocation is not supported by your browser...')
    }

    // Disable button
    btnLocation.setAttribute('disabled','disabled')

    navigator.geolocation.getCurrentPosition((position)=>{        
        socket.emit('location',{
            "lat":position.coords.latitude,
            "long":position.coords.longitude
        }, (error)=>{

            // enable button
            btnLocation.removeAttribute('disabled')

            if(error){
                return console.log(error) 
            } 
            console.log("Location shared!")      
        })
    })    
})

// FormOnclick listener
const $messageForm = document.querySelector('#message-form')
const $btnSubmit = document.querySelector('#btn-submit')
const $msgInput = document.querySelector('input')

$messageForm.addEventListener('submit',(e) =>{    
    e.preventDefault() // Prevent refresh

    //Disable btn
    $btnSubmit.setAttribute('disabled','disabled')

    // const msg = $msgInput.value
    const msg = e.target.elements.message.value

    // Dont send anything if button is empty
    if(!msg) {
        e.target.elements.message.focus()
        $btnSubmit.removeAttribute('disabled')
        return
    }

    socket.emit('client-message',{
        msg,
        timestamp:new Date()
    },(error)=>{

        // enable button, clear input and set focus
        e.target.elements.message.value=''
        e.target.elements.message.focus()
        $btnSubmit.removeAttribute('disabled')

        if(error){
            return console.log(error) 
        }       
        console.log("The message was delivered!") 
    })
})

console.log(username)
console.log(room)

socket.emit('join',{
    username,
    room
},(error)=>{
    if(error) {
        alert(error)
        location.href='/'
    }
})