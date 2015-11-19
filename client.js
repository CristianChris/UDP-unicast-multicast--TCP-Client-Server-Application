// Node.js modules
var net = require('net');
var JsonSocket = require('json-socket');
var clientTCP = net.createServer();
var _ = require('underscore');
var fs = require('fs');
var dgram = require('dgram');
var clientUDP = dgram.createSocket('udp4');

// Client set up
var SRC_PORT = 6025;
var PORT = 3000;
var MULTICAST_ADDR = '239.255.255.250';

// Declaring some variables
var mavenHost = '';
var mavenNeighbours = 0;
var mavenEmployees = 0;
var totalAvgSalary = [];

// Bind the multicast port to our UDP client and execute functions
clientUDP.bind(SRC_PORT, function () {
    multicastNew();
    setTimeout(mavenRequest,2000);
});

// Multicast listening
clientUDP.on('listening', function () {
    var address = clientUDP.address();
    console.log('UDP Client listening on ' + address.address + ':' + address.port +' (multicast address).\n');
    console.log('-----------------------Answeres from the nodes------------------------');
});

// Proccesing the messages that comes from nodes and saving into variables the nodes addreses
clientUDP.on('message', function (messageFromNodes, rinfo) {
    // Declaring and saving the information that comes from nodes
    var host = String(messageFromNodes).substring(6, 15);
    var neighbours = parseInt(String(messageFromNodes).substring(22,24));
    var employees = parseInt(String(messageFromNodes).substring(39));
    var AvgSalary = parseInt(String(messageFromNodes).substring(76));
    totalAvgSalary.push(AvgSalary)
    console.log('-------------Host: ' +host+':'+PORT+' has: _' +neighbours+ '_ neighbours and _'+ employees +'_ employees and the average salary is _'+AvgSalary+'_');
    // Choosing the maven node by some criteria(>neighbours && >employees)
    if (neighbours >= mavenNeighbours ) {
        if (employees >= mavenEmployees) {
            mavenHost = host;
            mavenNeighbours = neighbours;
            mavenEmployees = employees;
        };
    };
    console.log('Curent Maven Host: ' +mavenHost+':'+PORT+' has: _' +mavenNeighbours+ '_ neighbours and _'+ mavenEmployees +'_ employees');
    console.log('----------------------------------------------------------------------');
});

// Function that sends multicast command to nodes listening on MULTICAST_ADDR
function multicastNew() {
    var messageClient = new Buffer ('host & neighbours & employers');
    console.log('Sending multicast the command "'+messageClient+'" \n   to all nodes that are listening on multicast address "'+MULTICAST_ADDR+':'+PORT+'"');
    clientUDP.send(messageClient, 0, messageClient.length, PORT , MULTICAST_ADDR, function () {
    });
};

// Function that will create a TCP connection between the client and the maven
//also it will request mavens data including it's neighbours as well
//filtering and saving it into a .txt file
function mavenRequest () {
    console.log('Addres of our maven is: '+mavenHost+':'+PORT+' ('+mavenNeighbours+' neighbours and '+mavenEmployees+' employees)\n');
    // Decorate a standard net.Socket with JsonSocket
    var socket = new JsonSocket(new net.Socket());
    // Establish a connection to maven
    socket.connect(PORT, mavenHost, function(){
        // Sending a command to our maven
        socket.sendMessage({command: 'MavenRequestData'});
        socket.on('message', function(MavenRequestData) {
            // console.log(MavenRequestData);
            console.log('Data recived: '+JSON.stringify(MavenRequestData)+'\n');
            // Applying our filter function
            var filterResult = filtering(MavenRequestData);
            console.log('Filter result: '+JSON.stringify(filterResult));
            // Writing our filterResult to a file
            fs.writeFile("./savedData.json", JSON.stringify(filterResult), function(err) {
                console.log('----------------------------------------------------------------------')
                console.log("Filtered result was saved in data.txt in the current directory!");
                if(err) {
                    return console.log(err);
                };
            });
        });
    });
};

// Function that filters collected data ( filter criteria: salary, departament, sorting )
function filtering(collection) {
    // Calculating the total average salary of all the nodes that answered using UDP unicast
    var total = 0;
    for(var i = 0; i < totalAvgSalary.length; i++) {
        total = totalAvgSalary[i]+total;
    }
    var resultTotalAvgSalary = total / totalAvgSalary.length
    console.log('Group by departament: Computer Science; \nFiltering by salary > total average salary of all nodes ('+resultTotalAvgSalary+');\nSorting by last names.\n');
    // grouping by departaments of the collection
    var filterDepartament = _.groupBy(collection, function(value){
                return value.departament
    });
    // filtering the 'computer science' group by salary > total average of all nodes
    var filterSalary = _.filter(filterDepartament['Computer Science'], function(num){ return num.salary > resultTotalAvgSalary; });
    // sorting by last name the collection
    var filterName = _.sortBy(filterSalary, 'lastName');
    return filterName
}







