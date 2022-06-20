const START_ENROLL_CMD = '!start'
const STOP_ENROLL_CMD = '!stop'

const JOIN_CMD = '!join'
var ENROLL_IN_PROGRESS = false
var USERS = []
var CHOSEN_USER = null
var BOARD = [
    [0, 0, 0, 0 ,0 ,0, 0],
    [0, 0, 0, 0 ,0 ,0, 0],
    [0, 0, 0, 0 ,0 ,0, 0],
    [0, 0, 0, 0 ,0 ,0, 0],
    [0, 0, 0, 0 ,0 ,0, 0],
    [0, 0, 0, 0 ,0 ,0, 0]
];
var MY_MOVE = false

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
        ENROLL_IN_PROGRESS = true;
        document.getElementById("players_count").textContent = 'Players joined: 0';
        document.getElementById("started_text").style.display='block';
    }

    if (nick === 'K1pero' && message === STOP_ENROLL_CMD) {
        CHOSEN_USER = get_random(USERS)
        document.getElementById("user").textContent = 'Playing with: ' + CHOSEN_USER;

        USERS = []
        ENROLL_IN_PROGRESS = false
        document.getElementById("started_text").style.display='none';
    }

    if (ENROLL_IN_PROGRESS && message === JOIN_CMD) {
        if (!USERS.includes(nick)){
            USERS.push(nick);
            document.getElementById("players_count").textContent = 'Players joined: ' + USERS.length;
        }
    }

    if (nick === CHOSEN_USER && !MY_MOVE) {
        parse_chosen_user_message(message)
    }

    console.log(USERS);
});

function parse_chosen_user_message(message) {
    parsed_message = +message
    console.log(parsed_message)

    if (parsed_message >= 1 && parsed_message <= 7) {
        console.log("MAKE A MOVE")
        MY_MOVE = true
        row = find_first_empty_row_in_column(parsed_message - 1)
        if(row != -1){
            BOARD[row][parsed_message - 1] = 2
            document.getElementById("field" + row + (parsed_message - 1)).className = "dot_clicked2";
        }
        enable_buttons();
    }
    else {
        console.log("NOT A MOVE")
    }
}

function get_random (list) {
    return list[Math.floor((Math.random()*list.length))];
}

function find_first_empty_row_in_column(column){
    for(var i = 5; i >= 0; i--) {
        if(BOARD[i][column] === 0){
            return i;
        }
    }
    return -1;
}

function on_my_move(column){
    row = find_first_empty_row_in_column(column);
    if(row != -1){
        BOARD[row][column] = 1
        document.getElementById("field" + row + column).className = "dot_clicked1";
    }
    MY_MOVE = false;
    disable_buttons();
}

function disable_buttons(){
    document.getElementById("btn1").disabled = true;
    document.getElementById("btn2").disabled = true;
    document.getElementById("btn3").disabled = true;
    document.getElementById("btn4").disabled = true;
    document.getElementById("btn5").disabled = true;
    document.getElementById("btn6").disabled = true;
    document.getElementById("btn7").disabled = true;
}

function enable_buttons(){
    document.getElementById("btn1").disabled = false;
    document.getElementById("btn2").disabled = false;
    document.getElementById("btn3").disabled = false;
    document.getElementById("btn4").disabled = false;
    document.getElementById("btn5").disabled = false;
    document.getElementById("btn6").disabled = false;
    document.getElementById("btn7").disabled = false;
}

document.getElementById("btn1").addEventListener('click', function(){
    on_my_move(0);
});
document.getElementById("btn2").addEventListener('click', function(){
    on_my_move(1);
});
document.getElementById("btn3").addEventListener('click', function(){
    on_my_move(2);
});
document.getElementById("btn4").addEventListener('click', function(){
    on_my_move(3);
});
document.getElementById("btn5").addEventListener('click', function(){
    on_my_move(4);
});
document.getElementById("btn6").addEventListener('click', function(){
    on_my_move(5);
});
document.getElementById("btn7").addEventListener('click', function(){
    on_my_move(6);
});

disable_buttons();
