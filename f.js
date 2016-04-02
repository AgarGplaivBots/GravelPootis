//node --max-old-space-size=8192 a/f.js
var facebookManager = require("./facebookManager.js");
var options = {
    owned: false,
    maxMass: false,
    minLevel: 0,
    maxLevel: 100,
};
facebookManager.generateTokens(options, function() {
    console.log("All FBs Successfully Checked..");
    fbChecked = 1;
    
var fs = require('fs-extra');
var path = require('path');
extend = require("extend");

if (!fs.existsSync('proxy.txt')) {
    console.log("INFO: did not found proxy.txt - creating it.");
    fs.copySync(path.resolve(__dirname,'./proxy.sample.txt'), 'proxy.txt');
}

if (!fs.existsSync('config.js')) {
    console.log("INFO: did not found config.js - creating it.");
    fs.copySync(path.resolve(__dirname,'./config.sample.js'), 'config.js');
}

var config = require('./config');
var names = require('./names');

function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

var AgarioClient = require('agario-client'); //Use this in your scripts
spawnCount = 0;

function FeederBot(bot_id, agent, bot_number, server) {
    this.bot_id = bot_id; //ID of bot for logging

    if (config.useRandomSkinName) {
   this.nickname = names.getRandomName();
   } else {
        this.nickname = config.useStaticName;
    }

    this.interval_id = 0; //here we will store setInterval's ID
    this.ball_id = null;
    this.server = ''; //server address will be stored here
    this.client = new AgarioClient('Bot_' + this.bot_id); //creates new client
    this.client.debug = 0;
    this.client.agent = agent;
    this.client.headers['user-agent'] = config.userAgent;
        if (facebookManager.hasAvailableToken()) {
        this.client.auth_token = facebookManager.getToken();
    }
    this.isOnFeedMission = false;
    this.lastsent = {minx: 0, miny: 0, maxx: 0, maxy: 0};
    this.onboard_client(server, bot_number);
}

FeederBot.prototype = {
    log: function(text) {
        if (config.verbosityLevel > 0) {
            console.log('Bot_' + this.bot_id + ': ' + text);
        }
    },

    reset_map_data: function(){
        var bot = this;
        bot.map_min_x = null;
        bot.map_min_y = null;
        bot.map_max_x = null;
        bot.map_max_y = null;
    },

    onboard_client: function(server, bot_number) {
        var bot = this;
        setTimeout(function() {
            bot.connect(server);
        }, config.onboardingTimer * bot_number);
    },

    connect: function(server) {
        if (config.verbosityLevel > 0) {
            this.log('Connecting to: ' + server);
        }

        if (spawnCount > config.maxBots) {
            this.log('ERROR: spawned to many bots - Increase config.maxBots for more bots.');
            return;
        }

        this.server = server;
        this.client.connect(server);
        this.attachEvents();
    },

    attachEvents: function() {
        var bot = this;

        bot.client.on('ballDisppear', function(ball_id) {
            setTimeout(function(){
                if (bot.client.balls[ball_id]) bot.client.balls[ball_id].destroy();
            }, 200);
        });

        bot.client.on('connected', function() {
            bot.reset_map_data();
            if (config.verbosityLevel > 0) {
                bot.log('Connection Success, spawning');
            }
            bot.client.spawn(bot.nickname);
            spawnCount++;
            socket.emit("spawn-count", spawnCount + '/' + config.maxBots);
            //we will search for target to eat every 100ms
            bot.interval_id = setInterval(function() {
                bot.recalculateTarget();
            }, 100);
			interval_id2 = setInterval(function() {
                if(spawnCount==0 && reconnect==true) {
            reconnect = false;					
            bot_count=0;
			facebookManager.generateTokens(options, function() {
            console.log("All FBs Successfully Checked..");
			});
			setTimeout(function() {
            startFeederBotOnProxies();
        }, 3000);
		}
            }, 100);
        });

        bot.client.on('mapSizeLoad', function(server_minx, server_miny, server_maxx, server_maxy) {
            //bot.log('got my map-size: ' + min_x + ";" + min_y + ";" + max_x + ";" + max_y);
            if (bot.valcompare(server_maxx - server_minx, server_maxy - server_miny)) {
              bot.real_minx = server_minx;
              bot.real_miny = server_miny;
              bot.real_maxx = server_maxx;
              bot.real_maxy = server_maxy;
            } else {
              if (bot.valcompare(server_minx, bot.lastsent.minx)) {
                if (0.01 < server_maxx - bot.lastsent.maxx || -0.01 > server_maxx - bot.lastsent.maxx) {
                  bot.real_minx = server_minx;
                  bot.real_maxx = server_minx + 14142.135623730952;
                }
              }
              if (0.01 < server_minx - bot.lastsent.minx || -0.01 > server_minx - bot.lastsent.minx) {
                if (bot.valcompare(server_maxx, bot.lastsent.maxx)) {
                  bot.real_maxx = server_maxx;
                  bot.real_minx = server_maxx - 14142.135623730952;
                }
              }
              if (0.01 < server_miny - bot.lastsent.miny || -0.01 > server_miny - bot.lastsent.miny) {
                if (bot.valcompare(server_maxy, bot.lastsent.maxy)) {
                  bot.real_maxy = server_maxy;
                  bot.real_miny = server_maxy - 14142.135623730952;
                }
              }
              if (bot.valcompare(server_miny, bot.lastsent.miny)) {
                if (0.01 < server_maxy - bot.lastsent.maxy || -0.01 > server_maxy - bot.lastsent.maxy) {
                  bot.real_miny = server_miny;
                  bot.real_maxy = server_miny + 14142.135623730952;
                }
              }
              if (server_minx < bot.real_minx) {
                bot.real_minx = server_minx;
                bot.real_maxx = server_minx + 14142.135623730952;
              }
              if (server_maxx > bot.real_maxx) {
                bot.real_maxx = server_maxx;
                bot.real_minx = server_maxx - 14142.135623730952;
              }
              if (server_miny < bot.real_miny) {
                bot.real_miny = server_miny;
                bot.real_maxy = server_miny + 14142.135623730952;
              }
              if (server_maxy > bot.real_maxy) {
                bot.real_maxy = server_maxy;
                bot.real_miny = server_maxy - 14142.135623730952;
              }
              bot.lastsent.minx = server_minx;
              bot.lastsent.miny = server_miny;
              bot.lastsent.maxy = server_maxy;
              bot.lastsent.maxx = server_maxx;
            }

            bot.offset_x = bot.real_minx || -7071;
            bot.offset_y = bot.real_miny || -7071;
        });

        bot.client.on('connectionError', function(e) {
            if (config.verbosityLevel > 0) {
                bot.log('Connection Failed: ' + e);
            }
        });

        bot.client.on('myNewBall', function(ball_id) {
            // Should always be generated.
            if (config.verbosityLevel > -1) {
                bot.log('New Cell Generated (' + ball_id + ')');
            }
        });

        bot.client.once('leaderBoardUpdate', function(old, leaders) {
            var name_array = leaders.map(function(ball_id) {
                return bot.client.balls[ball_id].name || 'unnamed'
            });
            if (config.verbosityLevel > 0) {
                bot.log('Server Leaderboard: ' + name_array.join(' - '));
            }
        });

        bot.client.on('somebodyAteSomething', function(eater_ball, eaten_ball) {
            var ball = bot.client.balls[eater_ball];
            if (!ball) return; //if we don't know that ball, we don't care
            if (!ball.mine) return; //if it's not our ball, we don't care
            //bot.client.log('I ate ' + eaten_ball + ', my new size is ' + ball.size);
        });

        bot.client.on('mineBallDestroy', function(ball_id, reason) { //when my ball destroyed
            if (reason.by) {
                if (config.verbosityLevel > 0) {
                    bot.log(bot.client.balls[reason.by] + ' has killed a cell.');
                }
            }

            if (reason.reason == 'merge') {
                if (config.verbosityLevel > 1) {
                    bot.log('Merged with another cell. Bot_' + ball_id + ' now has ' + bot.client.my_balls.length + ' balls.')
                }
            } else {
                if (config.verbosityLevel > 1) {
                    bot.log('Lost a cell! Bot_' + ball_id + ' has ' + bot.client.my_balls.length + ' cells left.');
                }
            }
        });

        bot.client.on('lostMyBalls', function() {
            if (config.verbosityLevel > 0) {
                bot.log('Has been killed, respawning.');
            }
            bot.reset_map_data();
            bot.client.spawn(bot.nickname);
            bot.isOnFeedMission = false;
        });

        bot.client.on('disconnect', function() {
            if (config.verbosityLevel > 0) {
                bot.log('Disconnected from the server.');
            }
            if (spawnCount > 0){ spawnCount--; bot_count--;}
            socket.emit("spawn-count", spawnCount + '/' + config.maxBots);
        });

        bot.client.on('reset', function() { //when client clears everything (connection lost?)
            clearInterval(bot.interval_id);
        });

		process.on('uncaughtException', function (err) {
		  console.log(err);
		});
		
		process.setMaxListeners(0);
		
        bot.client.on('packetError', function(packet, err, preventCrash) {
           bot.log('Packet error detected for packet: ' + packet.toString());
           bot.log('Crash will be prevented, bot will be disconnected');
           preventCrash();
           //bot.client.disconnect();
        });
    },

    valcompare: function (Y, Z) {
        return 0.01 > Y - Z && -0.01 < Y - Z;
    },

    getDistanceBetweenBalls: function(ball_1, ball_2) {
        return this.getDistanceBetweenBallAndPosition(ball_1, ball_2.x, ball_2.y);
    },

    getDistanceBetweenBallAndPosition: function(ball_1, x, y) {
        return this.getDistanceBetweenPositions(ball_1.x, ball_1.y, x, y);
    },

    getDistanceBetweenPositions: function(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y1 - y2, 2));
    },

    getAvailableTransporter: function() {
        var bot = this;
        var my_ball = bot.client.balls[bot.client.my_balls[0]];
        if (!my_ball) return;

        possible_transporter = null

        for (var bot_id in bots) {
            ball_id = bots[bot_id].id
            bot_ball = bots[bot_id].client.balls[bots[bot_id].client.my_balls[0]];
            if (!bot_ball) continue;
            if (bot.getDistanceBetweenBallAndPosition(my_ball, bot_ball.x, bot_ball.y) > 2000) {
                continue;
            }
            if (bot.getDistanceBetweenBallAndPosition(my_ball, bot_ball) > bot.getDistanceBetweenBallAndPosition(my_ball, possible_transporter)) {
                continue;
            }
            if (my_ball.size / bot_ball.size > 0.8) continue;

            possible_transporter = bot_ball;
        }

        return possible_transporter;
    },

    getMassPixelRadius: function(mass) {
        return Math.ceil(Math.sqrt(100 * mass));
    },

    canSplitFeedPlayer: function(botMass, otherMass) {
        requiredMass = otherMass * 1.25;
        return requiredMass < botMass
    },

    playerInRange: function(my_ball, playerX, playerY, playerSize, range) {
        var bot = this;
        bot_distance = bot.getDistanceBetweenBallAndPosition(my_ball, playerX, playerY) - bot.getMassPixelRadius(valid_player_pos.size)
        ditance_needed = range //400 - bot.getMassPixelRadius(my_ball.size);
        return bot_distance < ditance_needed;
    },

    in_circle: function(center_x, center_y, radius, x, y) {
        //square_dist = (center_x - x) ^ 2 + (center_y - y) ^ 2;
        //return square_dist <= (radius/2) ^ 2;
        dx = x - center_x
        dy = y - center_y
        return dx * dx + dy * dy <= radius * radius
    },

    getCoordinatesOfCircleAngle: function(center_x, center_y, radius, angle) {
        x = Math.ceil(center_x + radius * Math.cos(angle));
        y = Math.ceil(center_y + radius * Math.sin(angle));
        return {
            "x": x,
            "y": y
        };
    },

    checkIfPathCrossesBall: function(from_x, from_y, dest_x, dest_y, ball_id) {
        bot = this;
        ball = bot.client.balls[ball_id];

        // Translate coordinates
        var x1 = Math.ceil(from_x);
        var y1 = Math.ceil(from_y);
        var x2 = Math.ceil(dest_x);
        var y2 = Math.ceil(dest_y);
        // Define differences and error check
        var dx = Math.abs(x2 - x1);
        var dy = Math.abs(y2 - y1);
        var sx = (x1 < x2) ? 1 : -1;
        var sy = (y1 < y2) ? 1 : -1;
        var err = dx - dy;
        // Main loop
        while (!((x1 == x2) && (y1 == y2))) {
            var e2 = err << 1;
            if (e2 > -dy) {
                err -= dy;
                x1 += sx;
            }
            if (e2 < dx) {
                err += dx;
                y1 += sy;
            }

            if (bot.in_circle(ball.x, ball.y, bot.getMassPixelRadius(ball.mass), x1, y1)) {
                return true;
            }
        }
        // Return the result
        return false;
    },

    getNearestBallOnPath: function(from_x, from_y, dest_x, dest_y) {
        bot = this;
        my_ball = bot.client.balls[bot.client.my_balls[0]];

        for (ball_id in bot.client.balls) {
            ball = bot.client.balls[ball_id];
            if (!ball.virus) {
                continue;
            }

            if (bot.checkIfPathCrossesBall(from_x, from_y, dest_x, dest_y, ball_id)) {
                console.log("Path not safe: bot would die!");
                return ball_id;
            }
        }

        return null;
    },

    safeMoveTo: function(x, y) {
        bot = this;
        my_ball = bot.client.balls[bot.client.my_balls[0]];

        safeX = x;
        safeY = y;

        nearest_obstacle = bot.getNearestBallOnPath(my_ball.x, my_ball.y, x, y);

        if (nearest_obstacle != null) {
            ball = bot.client.balls[nearest_obstacle];
            bestXDistance = 99999999;
            bestX = 0;
            bestY = 0;

            for (var i = 0; i < 360; i = i + 16) {
                pos = bot.getCoordinatesOfCircleAngle(ball.x, ball.y, bot.getMassPixelRadius(ball.mass) + bot.getMassPixelRadius(my_ball.mass), i)
                test_path = bot.getNearestBallOnPath(pos.x, pos.y, my_ball.x, my_ball.y);
                test_path2 = bot.getNearestBallOnPath(pos.x, pos.y, x, y);

                if (test_path == null && test_path2 == null) {
                    console.log("this path is safe.")

                    distance1 = bot.getDistanceBetweenPositions(pos.x, pos.y, my_ball.x, my_ball.y);
                    distance2 = bot.getDistanceBetweenPositions(pos.x, pos.y, x, y);
                    totalDistance = distance1 + distance2;
                    if (totalDistance < bestXDistance) {
                        bestXDistance = totalDistance;
                        bestX = pos.x;
                        bestY = pos.y;
                        console.log("found safe spot!");
                    }
                } else {
                    console.log("pathfinding: this path is not safe.")
                }
            }

            if (bestX == 0 && bestY == 0) {
                console.log("pathfinding: impossible.")
                return;
            } else {
                safeX = bestX;
                safeY = bestY;
            }

            console.log("pathfinding done:")
            console.log(safeX)
            console.log(safeY)
        }

        bot.client.moveTo(safeX, safeY);
    },

    moveToPlayerPosWithOffset: function() {
        bot = this;
        if(valid_player_pos==null){return;}

        if(valid_player_pos["dimensions"] == null){
            console.log("!!UPDATE USERSCRIPT!!")
            return;
        }

        offset_x = bot.offset_x + 7071;
        offset_y = bot.offset_y + 7071;

        //console.log("offset move " + offset_x + ";" + offset_y);

        bot.client.moveTo(valid_player_pos["x"] + offset_x, valid_player_pos["y"] + offset_y);
    },

    getCandidateBall: function(){
        var bot = this;
        var candidate_ball = null;
        var candidate_distance = 0;
        var my_ball = bot.client.balls[bot.client.my_balls[0]];

        for (var ball_id in bot.client.balls) {
            var ball = bot.client.balls[ball_id];
            if (ball.virus) {
                if (config.verbosityLevel > 1) { bot.log('virus ( green ball ) has been spotted.');}
                continue;
            }

            if (!ball.visible) continue;
            if (ball.mine) continue;

            if (config.botMode == "blind") {
                if(valid_player_pos["suicide_targets"] == null){
                    console.log("!!UPDATE USERSCRIPT!!")
                    return;
                }

                if(valid_player_pos["suicide_targets"].indexOf(ball.id) > -1){ return ball; }
            }



            if (ball.size / my_ball.size > 0.5) continue;
            var distance = bot.getDistanceBetweenBalls(ball, my_ball);
            if (candidate_ball && distance > candidate_distance) continue;

            candidate_ball = ball;
            candidate_distance = bot.getDistanceBetweenBalls(ball, my_ball);
        }
        return candidate_ball;
    },

    recalculateTarget: function() {
        var bot = this;
        var candidate_ball = null;
        var candidate_distance = 0;
        var my_ball = bot.client.balls[bot.client.my_balls[0]];
        if (!my_ball) return;

        if(config.botMode == "default"){

            if (valid_player_pos != null && bot.isOnFeedMission == true) {

                if (config.enableSaveMoveTo) {
                    bot.safeMoveTo(valid_player_pos["x"] + (bot.offset_x + 7071), valid_player_pos["y"] + (bot.offset_y + 7071));
                } else {
                    bot.moveToPlayerPosWithOffset();
                    //console.log("swag m8");
                }

                if (bot.playerInRange(my_ball, valid_player_pos["x"], valid_player_pos["y"], valid_player_pos.size, 400)) {
                    if (bot.canSplitFeedPlayer(my_ball.mass, valid_player_pos.size)) {
                        bot.client.split();
                    }
                }

                return
            }

            bot.candidate_ball = bot.getCandidateBall(bot);

            got_tranporter = false;
            transporter = bot.getAvailableTransporter();
            if (transporter != null) {
                candidate_ball = transporter;
                got_tranporter = true;
            }

            if (valid_player_pos != null && my_ball.mass > config.minimumMassBeforeFeed) {
                bot.isOnFeedMission = true;
                return;
            }

            if (valid_player_pos != null && bot.playerInRange(my_ball, valid_player_pos["x"], valid_player_pos["y"], valid_player_pos.size, 1000)) {

                if (!got_tranporter ||
                    bot.getDistanceBetweenBalls(candidate_ball, my_ball) >
                    bot.getDistanceBetweenBallAndPosition(my_ball, valid_player_pos["x"], valid_player_pos["y"])
                ) {
                    bot.isOnFeedMission = true;
                    return;
                }
            }

            if (candidate_ball == null) {
                //console.log("normal move");
                bot.moveToPlayerPosWithOffset();
            } else {
                //console.log("normal move");
                bot.client.moveTo(candidate_ball.x, candidate_ball.y);
            }
        }else if(config.botMode == "blind"){
            candidate_ball = bot.getCandidateBall(bot);
            if (candidate_ball == null) {
                //bot.client.moveTo(0, 0);
            } else {
                bot.client.moveTo(candidate_ball.x, candidate_ball.y);
            }

        }
    }

};

//you can do this in your code to use bot as lib
//module.exports = ExampleBot;

//launching bots below

var contains = function(needle) {
    // Per spec, the way to identify NaN is that it is not equal to itself
    var findNaN = needle !== needle;
    var indexOf;

    if (!findNaN && typeof Array.prototype.indexOf === 'function') {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function(needle) {
            var i = -1,
                index = -1;

            for (i = 0; i < this.length; i++) {
                var item = this[i];

                if ((findNaN && item !== item) || item === needle) {
                    index = i;
                    break;
                }
            }
            return index;
        };
    }

    return indexOf.call(this, needle) > -1;
};

var WebSocket = require('ws');
var valid_player_pos = null;
var reconnect = false;
var suicide_targets = null;
var socket = require('socket.io-client')(config.feederServer);

socket.on('pos', function(data) {
    valid_player_pos = data;
    //console.log(data);
});
socket.on('cmd', function(data) {
    console.log(data);
    if (data.name == "split") {
        for (bot in bots) {
            bots[bot].client.split();
        }
    } else if (data.name == "eject") {
        for (bot in bots) {
            bots[bot].client.eject();
        }
    } else if (data.name == "connect_server") {
        if (data.ip == null) {
            return;
        }
        if (data.ip == "") {
            return;
        }
        for (bot in bots) {
            bots[bot].client.disconnect();
        }
        bots = {};
        game_server_ip = data.ip;
        console.log("client requested bots on: " + game_server_ip); 
		setTimeout(function() {
            startFeederBotOnProxies();
        }, 1000);
    } else if(data.name == "reconnect_server") {
		reconnect = true;
		if (data.ip == null) {
            return;
        }
        if (data.ip == "") {
            return;
        }
        for (bot in bots) {
            bots[bot].client.disconnect();
        }
        bots = {};
        game_server_ip = data.ip;
        console.log("client requested bots on: " + game_server_ip);
	}
});

socket.on('force-login', function(data) {
    console.log(data);
    if (data == "server-booted-up") {
        return;
    }
    socket.emit("login", {
        "uuid": config.client_uuid,
        "type": "server"
    });
});

fs = require('fs');
var HttpsProxyAgent = require('https-proxy-agent');
var Socks = require('socks');

function getRandomLine(filename) {
    var fs = require('fs');
    var lines = fs.readFileSync(filename).toString().split("\n");
    line = lines[Math.floor(Math.random() * lines.length)];
    return line
}

//object of bots
var bots = {};

bot_count = 0;

var fs = require('fs');
var lines = fs.readFileSync(config.proxies).toString().split("\n");
var url = require('url');
var game_server_ip = null;

function createAgent(ip,type) {

    data = ip.split(":");

    return new Socks.Agent({
            proxy: {
                ipaddress: data[0],
                port: parseInt(data[1]),
                type: parseInt(type)
            }}
    );
}

var proxy_mode = "HTTP";

function startFeederBotOnProxies() {

    for (proxy_line in lines) {

        if(lines[proxy_line].trim() == "#HTTP"){
            proxy_mode = "HTTP";
        }else if(lines[proxy_line].trim() == "#SOCKS4"){
            proxy_mode = "SOCKS4";
        }else if(lines[proxy_line].trim() == "#SOCKS5"){
            proxy_mode = "SOCKS5";
        }

        if (lines[proxy_line][0] == "#" || lines[proxy_line].length < 3) {
            continue;
        }

        //usefull for testing single proxies
        if (process.argv[3] != null && proxy_line != process.argv[3]) {
            continue;
        }

        proxy = "http://" + lines[proxy_line];
        proxy_single = lines[proxy_line];
        console.log(proxy_mode + " ; " + proxy_single);

        try {

            var opts = url.parse(proxy);

            if (proxy != null) {
                if(proxy_mode=="HTTP"){
                    agent = HttpsProxyAgent(opts);
                }else if(proxy_mode=="SOCKS4"){
                    agent = createAgent(lines[proxy_line],4);
                }else if(proxy_mode=="SOCKS5"){
                    agent = createAgent(lines[proxy_line],5);
                }

            } else {
                var agent = null;
            }

            if (lines[proxy_line] == "NOPROXY") {
                agent = null;
            }

            console.log("Attempting connection to " + game_server_ip);
            for (i = 0; i < config.botsPerIp; i++) {
				if(bot_count<config.maxBots){
					bot_count++;
					bots[bot_count] = new FeederBot(bot_count, agent, bot_count, game_server_ip);
				}
            }

        } catch (e) {
            console.log('Error occured on startup: ' + e);
        }
    }
}

console.log("ogar-feeder-bot started! Join a game in Chrome with the Userscript installed.");
console.log("Press CTRL + C to stop this script.");
});
/*

if (!fs.existsSync('proxy.txt')) {
    console.log("INFO: did not found proxy.txt - creating it.");
    fs.copySync(path.resolve(__dirname,'./proxy.sample.txt'), 'proxy.txt');
}

if (!fs.existsSync('config.js')) {
    console.log("INFO: did not found config.js - creating it.");
    fs.copySync(path.resolve(__dirname,'./config.sample.js'), 'config.js');
}

var config = require('./config');
var names = require('./names');

var AgarioClient = require('agario-client'); //Use this in your scripts
spawnCount = 0;

function FeederBot(bot_id, agent, bot_number, server) {
    this.bot_id = bot_id; //ID of bot for logging

    if (config.useRandomSkinName) {
        this.nickname = names.getRandomName();
    } else {
        this.nickname = config.useStaticName;
    }

    this.interval_id = 0; //here we will store setInterval's ID
    this.ball_id = null;
    this.server = ''; //server address will be stored here
    this.client = new AgarioClient('Bot_' + this.bot_id); //creates new client
    this.client.debug = 0;
    this.client.agent = agent;
    this.client.headers['user-agent'] = config.userAgent;
        if (facebookManager.hasAvailableToken()) {
        this.client.auth_token = facebookManager.getToken();
    }
    this.isOnFeedMission = false;
    this.lastsent = {minx: 0, miny: 0, maxx: 0, maxy: 0};
    this.onboard_client(server, bot_number);
}

FeederBot.prototype = {
    log: function(text) {
        if (config.verbosityLevel > 0) {
            console.log('Bot_' + this.bot_id + ': ' + text);
        }
    },

    reset_map_data: function(){
        var bot = this;
        bot.map_min_x = null;
        bot.map_min_y = null;
        bot.map_max_x = null;
        bot.map_max_y = null;
    },

    onboard_client: function(server, bot_number) {
        var bot = this;
        setTimeout(function() {
            bot.connect(server);
        }, config.onboardingTimer * bot_number);
    },

    connect: function(server) {
        if (config.verbosityLevel > 0) {
            this.log('Connecting to: ' + server);
        }

        if (spawnCount > config.maxBots) {
            this.log('ERROR: spawned to many bots - Increase config.maxBots for more bots.');
            return;
        }

        this.server = server;
        this.client.connect(server);
        this.attachEvents();
    },

    attachEvents: function() {
        var bot = this;

        bot.client.on('ballDisppear', function(ball_id) {
            setTimeout(function(){
                if (bot.client.balls[ball_id]) bot.client.balls[ball_id].destroy();
            }, 200);
        });

        bot.client.on('connected', function() {
            bot.reset_map_data();
            if (config.verbosityLevel > 0) {
                bot.log('Connection Success, spawning');
            }
            bot.client.spawn(bot.nickname);
            spawnCount++;
            socket.emit("spawn-count", spawnCount + '/' + config.maxBots);
            //we will search for target to eat every 100ms
            bot.interval_id = setInterval(function() {
                bot.recalculateTarget();
            }, 500);
        });

        bot.client.on('mapSizeLoad', function(server_minx, server_miny, server_maxx, server_maxy) {
            //bot.log('got my map-size: ' + min_x + ";" + min_y + ";" + max_x + ";" + max_y);
            if (bot.valcompare(server_maxx - server_minx, server_maxy - server_miny)) {
              bot.real_minx = server_minx;
              bot.real_miny = server_miny;
              bot.real_maxx = server_maxx;
              bot.real_maxy = server_maxy;
            } else {
              if (bot.valcompare(server_minx, bot.lastsent.minx)) {
                if (0.01 < server_maxx - bot.lastsent.maxx || -0.01 > server_maxx - bot.lastsent.maxx) {
                  bot.real_minx = server_minx;
                  bot.real_maxx = server_minx + 14142.135623730952;
                }
              }
              if (0.01 < server_minx - bot.lastsent.minx || -0.01 > server_minx - bot.lastsent.minx) {
                if (bot.valcompare(server_maxx, bot.lastsent.maxx)) {
                  bot.real_maxx = server_maxx;
                  bot.real_minx = server_maxx - 14142.135623730952;
                }
              }
              if (0.01 < server_miny - bot.lastsent.miny || -0.01 > server_miny - bot.lastsent.miny) {
                if (bot.valcompare(server_maxy, bot.lastsent.maxy)) {
                  bot.real_maxy = server_maxy;
                  bot.real_miny = server_maxy - 14142.135623730952;
                }
              }
              if (bot.valcompare(server_miny, bot.lastsent.miny)) {
                if (0.01 < server_maxy - bot.lastsent.maxy || -0.01 > server_maxy - bot.lastsent.maxy) {
                  bot.real_miny = server_miny;
                  bot.real_maxy = server_miny + 14142.135623730952;
                }
              }
              if (server_minx < bot.real_minx) {
                bot.real_minx = server_minx;
                bot.real_maxx = server_minx + 14142.135623730952;
              }
              if (server_maxx > bot.real_maxx) {
                bot.real_maxx = server_maxx;
                bot.real_minx = server_maxx - 14142.135623730952;
              }
              if (server_miny < bot.real_miny) {
                bot.real_miny = server_miny;
                bot.real_maxy = server_miny + 14142.135623730952;
              }
              if (server_maxy > bot.real_maxy) {
                bot.real_maxy = server_maxy;
                bot.real_miny = server_maxy - 14142.135623730952;
              }
              bot.lastsent.minx = server_minx;
              bot.lastsent.miny = server_miny;
              bot.lastsent.maxy = server_maxy;
              bot.lastsent.maxx = server_maxx;
            }

            bot.offset_x = bot.real_minx || -7071;
            bot.offset_y = bot.real_miny || -7071;
        });

        bot.client.on('connectionError', function(e) {
            if (config.verbosityLevel > 0) {
                bot.log('Connection Failed: ' + e);
            }
        });

        bot.client.on('myNewBall', function(ball_id) {
            // Should always be generated.
            if (config.verbosityLevel > -1) {
                bot.log('New Cell Generated (' + ball_id + ')');
            }
        });

        bot.client.once('leaderBoardUpdate', function(old, leaders) {
            var name_array = leaders.map(function(ball_id) {
                return bot.client.balls[ball_id].name || 'unnamed'
            });
            if (config.verbosityLevel > 0) {
                bot.log('Server Leaderboard: ' + name_array.join(' - '));
            }
        });

        bot.client.on('somebodyAteSomething', function(eater_ball, eaten_ball) {
            var ball = bot.client.balls[eater_ball];
            if (!ball) return; //if we don't know that ball, we don't care
            if (!ball.mine) return; //if it's not our ball, we don't care
            //bot.client.log('I ate ' + eaten_ball + ', my new size is ' + ball.size);
        });

        bot.client.on('mineBallDestroy', function(ball_id, reason) { //when my ball destroyed
            if (reason.by) {
                if (config.verbosityLevel > 0) {
                    bot.log(bot.client.balls[reason.by] + ' has killed a cell.');
                }
            }

            if (reason.reason == 'merge') {
                if (config.verbosityLevel > 1) {
                    bot.log('Merged with another cell. Bot_' + ball_id + ' now has ' + bot.client.my_balls.length + ' balls.')
                }
            } else {
                if (config.verbosityLevel > 1) {
                    bot.log('Lost a cell! Bot_' + ball_id + ' has ' + bot.client.my_balls.length + ' cells left.');
                }
            }
        });

        bot.client.on('lostMyBalls', function() {
            if (config.verbosityLevel > 0) {
                bot.log('Has been killed, respawning.');
            }
            bot.reset_map_data();
            bot.client.spawn(bot.nickname);
            bot.isOnFeedMission = false;
        });

        bot.client.on('disconnect', function() {
            if (config.verbosityLevel > 0) {
                bot.log('Disconnected from the server.');
            }
            if (spawnCount > 0){ spawnCount--;}
            socket.emit("spawn-count", spawnCount + '/' + config.maxBots);
        });

        bot.client.on('reset', function() { //when client clears everything (connection lost?)
            clearInterval(bot.interval_id);
        });

        bot.client.on('packetError', function(packet, err, preventCrash) {
           bot.log('Packet error detected for packet: ' + packet.toString());
           bot.log('Crash will be prevented, bot will be disconnected');
           preventCrash();
           //bot.client.disconnect();
        });
    },

    valcompare: function (Y, Z) {
        return 0.01 > Y - Z && -0.01 < Y - Z;
    },

    getDistanceBetweenBalls: function(ball_1, ball_2) {
        return this.getDistanceBetweenBallAndPosition(ball_1, ball_2.x, ball_2.y);
    },

    getDistanceBetweenBallAndPosition: function(ball_1, x, y) {
        return this.getDistanceBetweenPositions(ball_1.x, ball_1.y, x, y);
    },

    getDistanceBetweenPositions: function(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y1 - y2, 2));
    },

    getAvailableTransporter: function() {
        var bot = this;
        var my_ball = bot.client.balls[bot.client.my_balls[0]];
        if (!my_ball) return;

        possible_transporter = null

        for (var bot_id in bots) {
            ball_id = bots[bot_id].id
            bot_ball = bots[bot_id].client.balls[bots[bot_id].client.my_balls[0]];
            if (!bot_ball) continue;
            if (bot.getDistanceBetweenBallAndPosition(my_ball, bot_ball.x, bot_ball.y) > 2000) {
                continue;
            }
            if (bot.getDistanceBetweenBallAndPosition(my_ball, bot_ball) > bot.getDistanceBetweenBallAndPosition(my_ball, possible_transporter)) {
                continue;
            }
            if (my_ball.size / bot_ball.size > 0.8) continue;

            possible_transporter = bot_ball;
        }

        return possible_transporter;
    },

    getMassPixelRadius: function(mass) {
        return Math.ceil(Math.sqrt(100 * mass));
    },

    canSplitFeedPlayer: function(botMass, otherMass) {
        requiredMass = otherMass * 1.25;
        return requiredMass < botMass
    },

    playerInRange: function(my_ball, playerX, playerY, playerSize, range) {
        var bot = this;
        bot_distance = bot.getDistanceBetweenBallAndPosition(my_ball, playerX, playerY) - bot.getMassPixelRadius(valid_player_pos.size)
        ditance_needed = range //400 - bot.getMassPixelRadius(my_ball.size);
        return bot_distance < ditance_needed;
    },

    in_circle: function(center_x, center_y, radius, x, y) {
        //square_dist = (center_x - x) ^ 2 + (center_y - y) ^ 2;
        //return square_dist <= (radius/2) ^ 2;
        dx = x - center_x
        dy = y - center_y
        return dx * dx + dy * dy <= radius * radius
    },

    getCoordinatesOfCircleAngle: function(center_x, center_y, radius, angle) {
        x = Math.ceil(center_x + radius * Math.cos(angle));
        y = Math.ceil(center_y + radius * Math.sin(angle));
        return {
            "x": x,
            "y": y
        };
    },

    checkIfPathCrossesBall: function(from_x, from_y, dest_x, dest_y, ball_id) {
        bot = this;
        ball = bot.client.balls[ball_id];

        // Translate coordinates
        var x1 = Math.ceil(from_x);
        var y1 = Math.ceil(from_y);
        var x2 = Math.ceil(dest_x);
        var y2 = Math.ceil(dest_y);
        // Define differences and error check
        var dx = Math.abs(x2 - x1);
        var dy = Math.abs(y2 - y1);
        var sx = (x1 < x2) ? 1 : -1;
        var sy = (y1 < y2) ? 1 : -1;
        var err = dx - dy;
        // Main loop
        while (!((x1 == x2) && (y1 == y2))) {
            var e2 = err << 1;
            if (e2 > -dy) {
                err -= dy;
                x1 += sx;
            }
            if (e2 < dx) {
                err += dx;
                y1 += sy;
            }

            if (bot.in_circle(ball.x, ball.y, bot.getMassPixelRadius(ball.mass), x1, y1)) {
                return true;
            }
        }
        // Return the result
        return false;
    },

    getNearestBallOnPath: function(from_x, from_y, dest_x, dest_y) {
        bot = this;
        my_ball = bot.client.balls[bot.client.my_balls[0]];

        for (ball_id in bot.client.balls) {
            ball = bot.client.balls[ball_id];
            if (!ball.virus) {
                continue;
            }

            if (bot.checkIfPathCrossesBall(from_x, from_y, dest_x, dest_y, ball_id)) {
                console.log("Path not safe: bot would die!");
                return ball_id;
            }
        }

        return null;
    },

    safeMoveTo: function(x, y) {
        bot = this;
        my_ball = bot.client.balls[bot.client.my_balls[0]];

        safeX = x;
        safeY = y;

        nearest_obstacle = bot.getNearestBallOnPath(my_ball.x, my_ball.y, x, y);

        if (nearest_obstacle != null) {
            ball = bot.client.balls[nearest_obstacle];
            bestXDistance = 99999999;
            bestX = 0;
            bestY = 0;

            for (var i = 0; i < 360; i = i + 16) {
                pos = bot.getCoordinatesOfCircleAngle(ball.x, ball.y, bot.getMassPixelRadius(ball.mass) + bot.getMassPixelRadius(my_ball.mass), i)
                test_path = bot.getNearestBallOnPath(pos.x, pos.y, my_ball.x, my_ball.y);
                test_path2 = bot.getNearestBallOnPath(pos.x, pos.y, x, y);

                if (test_path == null && test_path2 == null) {
                    console.log("this path is safe.")

                    distance1 = bot.getDistanceBetweenPositions(pos.x, pos.y, my_ball.x, my_ball.y);
                    distance2 = bot.getDistanceBetweenPositions(pos.x, pos.y, x, y);
                    totalDistance = distance1 + distance2;
                    if (totalDistance < bestXDistance) {
                        bestXDistance = totalDistance;
                        bestX = pos.x;
                        bestY = pos.y;
                        console.log("found safe spot!");
                    }
                } else {
                    console.log("pathfinding: this path is not safe.")
                }
            }

            if (bestX == 0 && bestY == 0) {
                console.log("pathfinding: impossible.")
                return;
            } else {
                safeX = bestX;
                safeY = bestY;
            }

            console.log("pathfinding done:")
            console.log(safeX)
            console.log(safeY)
        }

        bot.client.moveTo(safeX, safeY);
    },

    moveToPlayerPosWithOffset: function() {
        bot = this;
        if(valid_player_pos==null){return;}

        if(valid_player_pos["dimensions"] == null){
            console.log("!!UPDATE USERSCRIPT!!")
            return;
        }

        offset_x = bot.offset_x + 7071;
        offset_y = bot.offset_y + 7071;

        //console.log("offset move " + offset_x + ";" + offset_y);

        bot.client.moveTo(valid_player_pos["x"] + offset_x, valid_player_pos["y"] + offset_y);
    },

    getCandidateBall: function(){
        var bot = this;
        var candidate_ball = null;
        var candidate_distance = 0;
        var my_ball = bot.client.balls[bot.client.my_balls[0]];

        for (var ball_id in bot.client.balls) {
            var ball = bot.client.balls[ball_id];
            if (ball.virus) {
                if (config.verbosityLevel > 1) { bot.log('virus ( green ball ) has been spotted.');}
                continue;
            }

            if (!ball.visible) continue;
            if (ball.mine) continue;

            if (config.botMode == "blind") {
                if(valid_player_pos["suicide_targets"] == null){
                    console.log("!!UPDATE USERSCRIPT!!")
                    return;
                }

                if(valid_player_pos["suicide_targets"].indexOf(ball.id) > -1){ return ball; }
            }



            if (ball.size / my_ball.size > 0.5) continue;
            var distance = bot.getDistanceBetweenBalls(ball, my_ball);
            if (candidate_ball && distance > candidate_distance) continue;

            candidate_ball = ball;
            candidate_distance = bot.getDistanceBetweenBalls(ball, my_ball);
        }
        return candidate_ball;
    },

    recalculateTarget: function() {
        var bot = this;
        var candidate_ball = null;
        var candidate_distance = 0;
        var my_ball = bot.client.balls[bot.client.my_balls[0]];
        if (!my_ball) return;

        if(config.botMode == "default"){

            if (valid_player_pos != null && bot.isOnFeedMission == true) {

                if (config.enableSaveMoveTo) {
                    bot.safeMoveTo(valid_player_pos["x"] + (bot.offset_x + 7071), valid_player_pos["y"] + (bot.offset_y + 7071));
                } else {
                    bot.moveToPlayerPosWithOffset();
                    //console.log("swag m8");
                }

                if (bot.playerInRange(my_ball, valid_player_pos["x"], valid_player_pos["y"], valid_player_pos.size, 400)) {
                    if (bot.canSplitFeedPlayer(my_ball.mass, valid_player_pos.size)) {
                        bot.client.split();
                    }
                }

                return
            }

            bot.candidate_ball = bot.getCandidateBall(bot);

            got_tranporter = false;
            transporter = bot.getAvailableTransporter();
            if (transporter != null) {
                candidate_ball = transporter;
                got_tranporter = true;
            }

            if (valid_player_pos != null && my_ball.mass > config.minimumMassBeforeFeed) {
                bot.isOnFeedMission = true;
                return;
            }

            if (valid_player_pos != null && bot.playerInRange(my_ball, valid_player_pos["x"], valid_player_pos["y"], valid_player_pos.size, 1000)) {

                if (!got_tranporter ||
                    bot.getDistanceBetweenBalls(candidate_ball, my_ball) >
                    bot.getDistanceBetweenBallAndPosition(my_ball, valid_player_pos["x"], valid_player_pos["y"])
                ) {
                    bot.isOnFeedMission = true;
                    return;
                }
            }

            if (candidate_ball == null) {
                //console.log("normal move");
                bot.moveToPlayerPosWithOffset();
            } else {
                //console.log("normal move");
                bot.client.moveTo(candidate_ball.x, candidate_ball.y);
            }
        }else if(config.botMode == "blind"){
            candidate_ball = bot.getCandidateBall(bot);
            if (candidate_ball == null) {
                //bot.client.moveTo(0, 0);
            } else {
                bot.client.moveTo(candidate_ball.x, candidate_ball.y);
            }

        }
    }

};

//you can do this in your code to use bot as lib
//module.exports = ExampleBot;

//launching bots below

var contains = function(needle) {
    // Per spec, the way to identify NaN is that it is not equal to itself
    var findNaN = needle !== needle;
    var indexOf;

    if (!findNaN && typeof Array.prototype.indexOf === 'function') {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function(needle) {
            var i = -1,
                index = -1;

            for (i = 0; i < this.length; i++) {
                var item = this[i];

                if ((findNaN && item !== item) || item === needle) {
                    index = i;
                    break;
                }
            }
            return index;
        };
    }

    return indexOf.call(this, needle) > -1;
};

var WebSocket = require('ws');
var valid_player_pos = null;
var suicide_targets = null;
var socket = require('socket.io-client')(config.feederServer);

socket.on('pos', function(data) {
    valid_player_pos = data;
    //console.log(data);
});

socket.on('cmd', function(data) {
    console.log(data);
    if (data.name == "split") {
        for (bot in bots) {
            bots[bot].client.split();
        }
    } else if (data.name == "eject") {
        for (bot in bots) {
            bots[bot].client.eject();
        }
    } else if (data.name == "connect_server") {
        if (data.ip == null) {
            return;
        }
        if (data.ip == "") {
            return;
        }
        for (bot in bots) {
            bots[bot].client.disconnect();
        }
        bots = {};
        game_server_ip = data.ip;
        console.log("client requested bots on: " + game_server_ip);

        setTimeout(function() {
            startFeederBotOnProxies();
        }, 1000);
    }
});

socket.on('force-login', function(data) {
    console.log(data);
    if (data == "server-booted-up") {
        return;
    }
    socket.emit("login", {
        "uuid": config.client_uuid,
        "type": "server"
    });
});

fs = require('fs');
var HttpsProxyAgent = require('https-proxy-agent');
var Socks = require('socks');

function getRandomLine(filename) {
    var fs = require('fs');
    var lines = fs.readFileSync(filename).toString().split("\n");
    line = lines[Math.floor(Math.random() * lines.length)];
    return line
}

//object of bots
var bots = {};

bot_count = 0;

var fs = require('fs');
var lines = fs.readFileSync(config.proxies).toString().split("\n");
var url = require('url');
var game_server_ip = null;

function createAgent(ip,type) {

    data = ip.split(":");

    return new Socks.Agent({
            proxy: {
                ipaddress: data[0],
                port: parseInt(data[1]),
                type: parseInt(type)
            }}
    );
}

var proxy_mode = "HTTP";

function startFeederBotOnProxies() {

    for (proxy_line in lines) {

        if(lines[proxy_line].trim() == "#HTTP"){
            proxy_mode = "HTTP";
        }else if(lines[proxy_line].trim() == "#SOCKS4"){
            proxy_mode = "SOCKS4";
        }else if(lines[proxy_line].trim() == "#SOCKS5"){
            proxy_mode = "SOCKS5";
        }

        if (lines[proxy_line][0] == "#" || lines[proxy_line].length < 3) {
            continue;
        }

        //usefull for testing single proxies
        if (process.argv[3] != null && proxy_line != process.argv[3]) {
            continue;
        }

        proxy = "http://" + lines[proxy_line];
        proxy_single = lines[proxy_line];
        console.log(proxy_mode + " ; " + proxy_single);

        try {

            var opts = url.parse(proxy);

            if (proxy != null) {
                if(proxy_mode=="HTTP"){
                    agent = HttpsProxyAgent(opts);
                }else if(proxy_mode=="SOCKS4"){
                    agent = createAgent(lines[proxy_line],4);
                }else if(proxy_mode=="SOCKS5"){
                    agent = createAgent(lines[proxy_line],5);
                }

            } else {
                var agent = null;
            }

            if (lines[proxy_line] == "NOPROXY") {
                agent = null;
            }

            console.log("Attempting connection to " + game_server_ip);
            for (i = 0; i < config.botsPerIp; i++) {
                bot_count++;
                bots[bot_count] = new FeederBot(bot_count, agent, bot_count, game_server_ip);
            }

        } catch (e) {
            console.log('Error occured on startup: ' + e);
        }
    }
}

console.log("ogar-feeder-bot started! Join a game in Chrome with the Userscript installed.");
console.log("Press CTRL + C to stop this script.");*/