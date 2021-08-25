
const moment = require('moment')

function systemMessage(userName,msg){
    return{
        name: userName,
        text: msg,
        time: moment().format('MMMM Do YYYY, h:mm:ss a')
    }
}

function formatMessage({room,hostRoll,username,userroll,msg}){
    return {
        id          : room,
        host        : hostRoll,
        sender      : username,
        senderRoll  : userroll,
        sendingtime : moment().format('MMMM Do YYYY, h:mm:ss a'),
        message     : msg
    }
}

module.exports = {systemMessage ,formatMessage} 