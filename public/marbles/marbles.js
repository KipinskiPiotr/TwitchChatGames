var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser',
    physics: {
        default: 'arcade',
        arcade: {
            // debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('chicken', 'img/chicken2.png');
    this.load.image('wood', 'img/wood.png');
}

SPRITES = []
NICKS = []
PLAYERS = null

function create ()
{
    this.physics.world.setBounds(0, 0, 800, 2000);
    this.cameras.main.setBounds(0, 0, 800, 2000);

    PLAYERS = this.physics.add.group({
        immovable: false,
        collideWorldBounds: true,
        gravityY: 100
    });
    var balls = this.physics.add.group({
        immovable: true
    });
    this.physics.add.collider(PLAYERS, [balls, PLAYERS]);

    var obstacle_area = new Phaser.Geom.Rectangle(0, 100, 800, 2000);
    for (var i = 0; i < 100; i++)
    {
        var p = obstacle_area.getRandomPoint();
        balls.create(p.x, p.y, 'wood').setScale(0.05).setCircle(150);
    }

    this.physics.pause();
}

var pos = 30;

function update(){
    if(USERS.length > SPRITES.length){
        for(var i = SPRITES.length; i < USERS.length; i++){
            var sprite = PLAYERS.create(pos+=60, 30, 'chicken').setBounce(0.9);
            sprite.setScale(0.05).setCircle(300);
            var nick = this.add.text(0,0,USERS[i]);
            SPRITES.push(sprite);
            NICKS.push(nick);
        }
    }

    var lowest_pos = 0;
    var lowest_i = 0;
    // update nick position to sprite position
    // and find lowest sprite
    for(var i = 0; i < SPRITES.length; i++){
        NICKS[i].setPosition(SPRITES[i].x-30, SPRITES[i].y-30);

        if(SPRITES[i].y > lowest_pos){
            lowest_pos = SPRITES[i].y
            lowest_i = i;
        }
    }

    if(SPRITES.length > 0){
        this.cameras.main.startFollow(SPRITES[lowest_i]);
    }

    if(ENROLL_STOPPED){
        this.physics.resume();
        ENROLL_STOPPED = false;
    }
}


const START_ENROLL_CMD = '!start'
const STOP_ENROLL_CMD = '!stop'
const JOIN_CMD = '!join'

var USERS = []
var ENROLL_IN_PROGRESS = false
var ENROLL_STOPPED = false

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
    // console.log(`${nick}: ${message}`);

    if (nick === 'K1pero' && message === START_ENROLL_CMD) {
        ENROLL_IN_PROGRESS = true;
        document.getElementById("players_count").textContent = 'Players joined: 0';
        document.getElementById("started_text").style.display='block';
    }

    if (nick === 'K1pero' && message === STOP_ENROLL_CMD) {
        USERS = []
        ENROLL_IN_PROGRESS = false
        ENROLL_STOPPED = true
        document.getElementById("started_text").style.display='none';
    }

    if (ENROLL_IN_PROGRESS && message === JOIN_CMD) {
        if (!USERS.includes(nick)){
            USERS.push(nick);
            document.getElementById("players_count").textContent = 'Players joined: ' + USERS.length;
        }
    }

    // console.log(USERS);
});