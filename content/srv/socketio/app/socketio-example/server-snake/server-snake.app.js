/*

Copyright (C) 2016  Jimmy LATOUR
http://labodudev.fr

*/
module.exports.serverSnake = new serverSnake();

var wf = WF();

function serverSnake()
{
	var self = this;
	this.socket = undefined;
	this.currentPlayer = undefined;
	// this.clients = [];

	this.code = function(socket)
	{
		self.socket = socket;
		self.socket.SERVER.CLIENTS[socket.id].player = {
			3:socket.id,
			s: wf.CONF['SNAKE_CONF'].speed,
			a: 0,
			sa: wf.CONF['SNAKE_CONF'].speedAngle,
			d: 0,
			ls:[],
			lp: [],
			n: 0,
			w: 0,
			h: 0,
			0: Math.floor(Math.random() * (wf.CONF['SNAKE_CONF'].gameWidth - 20 - 20)) + 20,
			1: Math.floor(Math.random() * (wf.CONF['SNAKE_CONF'].gameWidth - 20 - 20)) + 20,
		};

		socket.on('error', self.error);
		socket.on('0', self.respawn.bind(this, socket));
		socket.on('2', function(player) { self.gotit(socket, player); });
		socket.on('5', function(d) { self.updatePlayer(socket, d); });
		socket.on('r', function(d) { self.resize(socket, d); });
	}

	this.error = function(obj) {
		console.log(obj);
	}

	this.respawn = function(socket) {
		console.log('[INFO] User respawned!');
		socket.emit('1', JSON.stringify(socket.SERVER.CLIENTS[socket.id].player));
	}

	this.gotit = function(socket, player) {
		console.log('[INFO] Player ' + player.name + ' connecting!');
		socket.SERVER.CLIENTS[socket.id].player = player;

		if (socket.SERVER.engineArray[2].exec.LoadAppByName('snake') != undefined)
			socket.SERVER.engineArray[2].exec.LoadAppByName('snake').exec.generatePath(socket.SERVER.CLIENTS[socket.id].player);

		socket.IO[0].emit('3', { n: socket.SERVER.CLIENTS[socket.id].player.name });

		var gameSetup = { w: wf.CONF['SNAKE_CONF'].gameWidth, h: wf.CONF['SNAKE_CONF'].gameHeight, s: wf.CONF['SNAKE_CONF'].speed, sa: wf.CONF['SNAKE_CONF'].speedAngle };
		socket.emit('4', JSON.stringify(gameSetup));
	}

	this.updatePlayer = function(socket, d) {
		d = JSON.parse(d);
		// socket.SERVER.CLIENTS[socket.id].player.d = d['0'];
		socket.broadcast.emit('6', JSON.stringify({
			0: d[0],
			1: d[1],
			3: d[3],
		}) );
	}

	this.resize = function(socket, d) {
    self.socket.SERVER.CLIENTS[socket.id].player.w = d.w;
    self.socket.SERVER.CLIENTS[socket.id].player.h = d.h;
	}

	this.sendUpdates = function() {
		// if(self.socket != undefined) {
		// 	// if (self.socket.SERVER.engineArray[2].exec.LoadAppByName('snake') != undefined)
		// 		// self.socket.SERVER.engineArray[2].exec.LoadAppByName('snake').exec.moveLoop();
		//
		// 	var size = Object.keys(self.socket.SERVER.CLIENTS).length;
		// 	if(self.socket.SERVER != undefined && self.socket.SERVER.CLIENTS != undefined && size > 0) {
		//
		// 		for (var i in self.socket.SERVER.CLIENTS) {
		// 			var listUser = {};
		// 			for (var y in self.socket.SERVER.CLIENTS) {
		// 				if (self.socket.SERVER.CLIENTS[y].player != undefined && y != i) {
		// 					listUser[y] = {
		// 						0: parseFloat(self.socket.SERVER.CLIENTS[y].player['0']).toFixed(2),
		// 						1: parseFloat(self.socket.SERVER.CLIENTS[y].player['1']).toFixed(2),
		// 					};
		// 				}
		// 			}
		//
		// 			listUser = JSON.stringify(listUser);
		// 			self.socket.SERVER.CLIENTS[i].emit('6', listUser);
		// 		}
		// 	}
		// }

		// setTimeout(self.sendUpdates, 1000 / wf.CONF['SNAKE_CONF'].networkUpdateFactor);
	}
}

// module.exports.serverSnake.sendUpdates();
