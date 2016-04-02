// IGNORE THESE
var config = {};
config.account = {};
// END OF IGNORE

// 0 = Shows small amount of logs | 1 = Shows default logs | 2 = Shows most logs
config.verbosityLevel = 1;

// Useragent the bot will use
config.userAgent = 'ogar-feeder-bot';

// the feederServer connects your node script with your browser (mouse coordinates & commands)
// you can use the public server or run your own node server/server.js
// if you are new just use the free public server ws://104.236.100.252:8081
config.feederServer = "ws://127.0.0.1:8081";

config.serverPort = 8081; // optional: setting only used if you run your own feederServer - it will run on this port
config.client_uuid = "pDtUsxMur684eLt"; // after you install the userscript press F12 and search for a debug msg on the console

// Location of your proxy files with HTTP proxies (Sock proxies not supported yet!)
config.proxies = "proxy.txt";
config.botsPerIp = 2;
config.onboardingTimer = 0;

// Maximum number of bots to load
config.maxBots = 500;

config.useRandomSkinName = true; // Set to true to use random name
config.useStaticName = "Classixz"; // If above is false, us this skin name

// The bot can have different AI modes:
// * default 	Bot will follow your mouse and listen to SPlit and eject commands
// * blind		Bot will just know your ball id and will try to find you and run into you
config.botMode = "default";

// Edit this value so bots collect mass before coming towards the player
config.minimumMassBeforeFeed = 0;
config.enableSaveMoveTo = false;


// IGNORE THIS
module.exports = config;
// END OF IGNORE