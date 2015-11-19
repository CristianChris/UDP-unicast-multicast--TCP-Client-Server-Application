//----------- Setting up our node using arguments ---------------
if (process.argv.length <= 5) {
    console.log("Usage: node (filename.js) HOST PORT neighbours data_file");
    console.log("Example: ( node node.js 127.0.0.3 3000 '[\"127.0.0.2\", \"127.0.0.4\"]' data_node_3.json ) ");
    process.exit(-1);
}

var HOST = process.argv[2];
var PORT = process.argv[3];
var neighbours = JSON.parse(process.argv[4]);
var data_file = process.argv[5];

console.log('Host: ' + HOST);
console.log('Port: ' + PORT);
console.log('Neighbours: ' + neighbours);
console.log('Data file to read from: ' + data_file);
//---------------------------------------------------------------

// Node.js modules
var net = require('net');
var JsonSocket = require('json-socket');
var extend = require('extend');
var dgram = require('dgram');
var nodeUDP = dgram.createSocket({ type: 'udp4', reuseAddr: true });
var fs = require('fs')

// Node set up multicast addres and multicast port
var SRC_PORT = 6025;
var MULTICAST_ADDR = '239.255.255.250';

// Read from file data and store it to employeeDict (object of objects)
var employeeDict =JSON.parse(fs.readFileSync('./data/'+data_file));


// Counting the data
var employeeDictLength = Object.keys(employeeDict).length;


// Listening for multicast messages
nodeUDP.on('listening', function () {
    var address = nodeUDP.address();
    console.log('UDP Node is listening on ' + address.address + ":" + address.port);
});

// Reciving multicast messages and execute commands and sends back answere
nodeUDP.on('message', function (messageFromClient, rinfo) {
    console.log('__Recived multicast command "'+messageFromClient+'" from the client address: ' + rinfo.address + ':' + rinfo.port );
    if (messageFromClient=='host & neighbours & employers') {
        avgSalary = averageSalary();
        numberNeighbours = neighbours.length;
        messageFromNodes = 'Host: '+HOST+' have: '+numberNeighbours+' neighbours and '+employeeDictLength+' employees and the average salary is '+ avgSalary;
        nodeUDP.send(messageFromNodes, 0, messageFromNodes.length, rinfo.port , rinfo.address, function () {
            console.log('____Sending answere back to the command "'+messageFromClient+'" ('+messageFromNodes+')');
        });
    };
});

// Bind our node's UDP connection to a PORT and add membership of the node for multicasting
nodeUDP.bind(PORT, function () {
    nodeUDP.addMembership(MULTICAST_ADDR);
});

// Function that will create a TCP connection that can be served between node and node
//or node and client, will process the commands that it will recive
//and will send the result back
net.createServer(function(socket) {
    socket = new JsonSocket(socket);
    socket.on('message', function(message) {
        if (message.command == 'RequestData') {
            socket.sendMessage(employeeDict);
        } else if(message.command == 'MavenRequestData'){
            for (var i = 0; i < neighbours.length; i++) {
                neighboursDataCollection(i);
            }
          setTimeout(function sendMessageClient(){socket.sendMessage(employeeDict)},500);
        }
    });
}).listen(PORT, HOST);
console.log('TCP Node is listening on ' + HOST +':'+ PORT);

// Function that collects data from neighbours only and append it to it's own
function neighboursDataCollection(i) {
        var socket = new JsonSocket(new net.Socket());
        socket.connect(PORT, neighbours[i], function(){
            socket.sendMessage({command: 'RequestData'});
            socket.on('message', function(RequestData) {
                extend(employeeDict, RequestData);
                });
        });
};
// Function that calculate the average salary from it's data
function averageSalary () {
    var arrSalary = [];
    var arrSalaryInt = [];
    var total = 0;
    for (var id in employeeDict) {
        arrSalary.push(employeeDict[id]["salary"]);
    }
    for(var i = 0; i < arrSalary.length; i++) {
        arrSalaryInt[i] = parseInt(arrSalary[i]);
        total = arrSalaryInt[i]+total;
    }
    var avg = total / arrSalaryInt.length
    return avg;
}

