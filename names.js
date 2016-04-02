var names = {};

names.nameList = [

	"¯\_(ツ)_/¯"
	
];

names.getRandomName = function() {
    return names.nameList[Math.floor((Math.random() * names.nameList.length))];
};

module.exports = names;
