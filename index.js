const tmi = require('tmi.js');
const axios = require('axios');

const START_ENROLL_CMD = '!start'
const STOP_ENROLL_CMD = '!stop'

const JOIN_CMD = '!join'
var ENROLL_IN_PROGRESS = false
var USERS = []
var CHOSEN_USER = null

const client = new tmi.Client({
    connection: {
        secure: true,
        reconnect: true
    },
    channels: ['k1pero']
});

client.connect();

client.on('message', (channel, tags, message, self) => {
    nick = tags['display-name']
    console.log(`${nick}: ${message}`);

    if (nick === 'K1pero' && message === START_ENROLL_CMD) {
        console.log("PROGRAM SHOULD START!")
        ENROLL_IN_PROGRESS = true
    }

    if (nick === 'K1pero' && message === STOP_ENROLL_CMD) {
        console.log("PROGRAM SHOULD STOP!")
        CHOSEN_USER = get_random(USERS)
        console.log(CHOSEN_USER)
        send_start_post_request()

        USERS = []
        ENROLL_IN_PROGRESS = false
    }

    if (ENROLL_IN_PROGRESS && message === JOIN_CMD) {
        if (!USERS.includes(nick)){
            USERS.push(nick);
        }
    }

    if (nick === CHOSEN_USER) {
        parse_chosen_user_message(message)
    }

    console.log(USERS);
});

function parse_chosen_user_message(message) {
    parsed_message = +message
    console.log(parsed_message)

    if (parsed_message in [1, 2, 3, 4, 5, 6, 7]) {
        console.log("MAKE A MOVE")

    }
    else {
        console.log("NOT A MOVE")
    }
}

function send_start_post_request() {
    axios
        .post("http://127.0.0.1:5000/", {
            user: CHOSEN_USER
        })
        .then(res => {
            console.log(`statusCode: ${res.status}`);
            console.log(res.data);
        })
        .catch(error => {
            console.error(error);
        });
}

function get_random (list) {
    return list[Math.floor((Math.random()*list.length))];
}
