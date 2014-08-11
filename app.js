var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var bodyParser = require('body-parser');

var ECHO_FILE_PATH = path.join(__dirname, 'echo.html');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/echo', function(req, res) {
  res.sendFile(ECHO_FILE_PATH);
});

app.get('*', function(req, res) {
  dumpReqToSocket(req, res);
});

app.post('*', function(req, res) {
  dumpReqToSocket(req, res);
});

app.put('*', function(req, res) {
  dumpReqToSocket(req, res);
});

// io.on('connection', function(socket) {
//   console.log('a user connected');
//   socket.on('disconnect', function() {
//     console.log('user disconnected');
//   });
// });

function dumpReqToSocket(req, res) {

  if (!/(.ico|.jpg|.jpeg|.gif|.png)$/.test(req.url)) {

    var data = {
      url: req.url,
      queryData: Object.keys(req.query).length && req.query || undefined,
      formData: Object.keys(req.body).length && req.body || undefined,
      when: Date.now()
    };

    io.emit('request data', data);
  }

  res.send('Got your request and echoed it!');
}

http.listen(3123, function(){
  console.log('Server listening on port 3123. Visit /echo for request echo.');
});