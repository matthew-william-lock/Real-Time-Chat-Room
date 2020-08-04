const users = []

// Add user
const addUser=({id,username,room})=>{

    // Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //Validate 
    if(!username || !room){
        return {
            error:"User and room are required!"
        }
    }

    // Check for existing user
    const existingUser = users.find((user)=>{
        return user.room == room && user.username == username
    })

    // Validate username
    if (existingUser){
        return {
            error:"User is in use!"
        }
    }

    // Store user
    const user = {
        id, 
        username, 
        room
    }

    users.push(user)
    return {user}
}

// Remove user
const removeUser = (id) =>{
    const index = users.findIndex((user)=>{
        return user.id == id
    })

    if(index!==-1){
        return users.splice(index,1)[0]
    }
}

// Get user 
const getUser = (id) =>{
    const index = users.findIndex((user)=>{
        return user.id == id
    })

    if(index!==1){
        return users[index]
    }
}

// Get users in room
const getUsersInRoom = (room) =>{
    room = room.trim().toLowerCase()
    return users.filter((user) => user.room === room)
}

addUser({
    id:22,
    username:"Matt ",
    room:"yes"
})

addUser({
    id:33,
    username:"Jess",
    room:"tes"
})

addUser({
    id:87,
    username:"bleh",
    room:"yes"
})

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}