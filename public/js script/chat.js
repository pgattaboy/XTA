//reloading the chat page when the page loads
//because we need to reload again to have the lattest number in rooms
window.onload = function () {
    if (!window.location.hash) {
        window.location = window.location + '#loaded'
        window.location.reload()
    }
}

const chatForm = document.getElementById('message_form')
const messageArea = document.querySelector('.message_area')

let username = document.getElementById('username').innerHTML
let userroll = document.getElementById('userroll').innerHTML
let rooms=0,hostids

//io() -- method is defined in socket.io/socket.io.js
// through this we are trying to create a connection
const socket = io()


document.querySelector('.chatrooms').onclick = () => {
    let headerPortion = document.querySelector('.header')
    //getting room 
    let formData = document.querySelector("input[name=rooms]:checked").value
    let subs = formData.split(' ')

    let hostRoll = parseInt(subs[2])
    let room = parseInt(subs[1])
    document.querySelector('.message_area').innerHTML=''
    if(rooms!==0){
        socket.emit('leave',(rooms))
    }
    rooms=room
    hostids=hostRoll
    //console.log(hostRoll+" "+room);
    // console.log(hostRoll);
    // console.log(roomId);

    //clearing the html created child element
    headerPortion.innerHTML = ""
    //creating new paragraph element
    let para = document.createElement('p')
    let data = document.createTextNode(`Room: ${room} & Host: ${hostRoll}`)
    para.appendChild(data)
    headerPortion.appendChild(para)

    //Join chatroom
    console.log("joining cahtroom");
    socket.emit("joinRoom", { room, hostRoll, username , userroll })
}

//message submit
chatForm.addEventListener('submit', (e) => {
    //preventing to send a file tp grab data
    e.preventDefault();
    let room = rooms
    let hostRoll = hostids
    //getting the message 
    const msg = e.target.elements.msg.value
    //emit message to the server
    socket.emit('chatmessage',({room,hostRoll,username, userroll, msg}))

    //to scroll to bootom
    messageArea.scrollTop = messageArea.scrollHeight

    //clear writing area
    e.target.elements.msg.value = ''
    e.target.elements.msg.focus()

})

//message from server
socket.on('message', (dataPacket)=> {
    console.log(dataPacket)
    comingMessage(dataPacket)
    //to scroll to bootom`
    messageArea.scrollTop = messageArea.scrollHeight;
})

//message send by other user
function comingMessage(dataPacket) {
    const div = document.createElement('div')
    if (userroll !== dataPacket.senderRoll) {
        div.classList.add('message_cntn', 'incoming')
    }
    else {
        div.classList.add('message_cntn', 'outgoing')
    }

    div.innerHTML = `<p class="meta">${dataPacket.senderRoll}_${dataPacket.sender}<span> ${dataPacket.sendingtime}</span></p>
                    <p class="text"> ${dataPacket.message}</p>`
    document.querySelector('.message_area').appendChild(div)
}

socket.on('botmessage', (dataPacket)=>{
    const div = document.createElement('div')
    div.classList.add('message_cntn', 'incoming')
    div.innerHTML = `<p class="meta">${dataPacket.sender}<span> ${dataPacket.sendingtime}</span></p>
                    <p class="text"> ${dataPacket.msg}</p>`
    document.querySelector('.message_area').appendChild(div)
})

//get room and users
// socket.on("roomUsers",({room,users})=>{
//     outputRoom
// })

