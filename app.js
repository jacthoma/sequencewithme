var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server);
	
server.listen(process.env.PORT || 5000);


app.get('/', function(req, res){
	res.sendfile(__dirname + '/index.html');
});

app.get('/js/canvas.js', function (req, res) {
    res.sendfile(__dirname + '/js/canvas.js');
});

// jQuery
app.get('/js/jquery-1.9.1.js', function (req, res) {
	res.sendfile(__dirname + '/js/jquery-1.9.1.js');
})

// SOUNDS
app.get('/sounds/02_KICK_2.wav', function (req, res) {
    res.sendfile(__dirname + '/sounds/02_KICK_2.wav');
});
app.get('/sounds/03_SNARE_1.wav', function (req, res) {
    res.sendfile(__dirname + '/sounds/03_SNARE_1.wav');
});
app.get('/sounds/ClosedHat10.wav', function (req, res) {
    res.sendfile(__dirname + '/sounds/ClosedHat10.wav');
});
app.get('/sounds/shake.wav', function (req, res) {
    res.sendfile(__dirname + '/sounds/shake.wav');
});


// New Sounds
app.get('/sounds/bassDrum1.wav', function (req, res) {
    res.sendfile(__dirname + '/sounds/bassDrum1.wav');
});
app.get('/sounds/bassDrum3.wav', function (req, res) {
    res.sendfile(__dirname + '/sounds/bassDrum1.wav');
});
app.get('/sounds/bassDrum5.wav', function (req, res) {
    res.sendfile(__dirname + '/sounds/bassDrum5.wav');
});

// synth sounds
app.get('/sounds/synth1_A_.wav', function (req, res) {
    res.sendfile(__dirname + '/sounds/synth1_A_.wav');
});
app.get('/sounds/synth1_C.wav', function (req, res) {
    res.sendfile(__dirname + '/sounds/synth1_C.wav');
});
app.get('/sounds/synth1_D.wav', function (req, res) {
    res.sendfile(__dirname + '/sounds/synth1_D.wav');
});
app.get('/sounds/synth1_E.wav', function (req, res) {
    res.sendfile(__dirname + '/sounds/synth1_E.wav');
});
app.get('/sounds/synth1_G.wav', function (req, res) {
    res.sendfile(__dirname + '/sounds/synth1_G.wav');
});
app.get('/sounds/synth1_A.wav', function (req, res) {
    res.sendfile(__dirname + '/sounds/synth1_A.wav');
});
app.get('/sounds/synth1_C2.wav', function (req, res) {
    res.sendfile(__dirname + '/sounds/synth1_C2.wav');
});
app.get('/sounds/synth1_D2.wav', function (req, res) {
    res.sendfile(__dirname + '/sounds/synth1_D2.wav');
});
app.get('/sounds/synth1_E2.wav', function (req, res) {
    res.sendfile(__dirname + '/sounds/synth1_E2.wav');
});

//

io.sockets.on('connection', function(socket){
	socket.on('send state', function(data){
		io.sockets.emit('new state', data);
	});
});

// END SOUNDS

// CHAT
/*
io.sockets.on('connection', function(socket){
	socket.on('send message', function(data){
		io.sockets.emit('new message', data);
	});
});
*/
// END CHAT
