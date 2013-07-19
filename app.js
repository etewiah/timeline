var express = require('express');
app = require('express.io')()
app.http().io()

app.use(express.logger());
app.use(express.static(__dirname + '/public'));

var data = [
        {
        date: new Date(1962, 10, 14).getTime(),
        name: "Cuban missile crisis",
        title: "Cuban missile crisis",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Soviet-R-12-nuclear-ballistic_missile.jpg/300px-Soviet-R-12-nuclear-ballistic_missile.jpg"
        },
        {
        date: new Date(1967, 6, 1).getTime(),
        name: "Sgt Pepper",
        title: "Sgt. Pepper's Lonely Hearts Club Band",
        image: "http://upload.wikimedia.org/wikipedia/en/thumb/5/50/Sgt._Pepper%27s_Lonely_Hearts_Club_Band.jpg/220px-Sgt._Pepper%27s_Lonely_Hearts_Club_Band.jpg"
        },
        {
        date: new Date(1968, 4, 4).getTime(),
        name: "Martin Luther King",
        title: "Assassination of Martin Luther King, Jr",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Martin_Luther_King_Jr_NYWTS.jpg/220px-Martin_Luther_King_Jr_NYWTS.jpg"
        },
        {
        date: new Date(1968, 7, 20).getTime(),
        name: "The Moon Landing",
        title: "The Moon Landing",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Apollo_11_first_step.jpg/300px-Apollo_11_first_step.jpg"
        },
        {
        date: new Date(1967, 8, 15).getTime(),
        name: "Woodstock Festival",
        title: "Woodstock Festival",
        image: "https://upload.wikimedia.org/wikipedia/en/thumb/b/b7/Woodstock_poster.jpg/250px-Woodstock_poster.jpg"
        }
];

app.io.sockets.on('connection', function (socket) {
  console.log('connection');
  socket.emit('dataInit', data);
});

// Send client html.
app.get('/', function(req, res) {
    res.sendfile(__dirname + '/index.html')
})

console.log("started on port 7076...");
app.listen(7076)
