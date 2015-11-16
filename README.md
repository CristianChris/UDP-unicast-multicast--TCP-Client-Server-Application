####Application's [Report](under construction)
####Running the application:
In order to run our aplication we will need to install several tools for that:

1. [NodeJS](https://nodejs.org/en/) as a JavaScript environment.
2. Node.js modules: [net](https://nodejs.org/api/net.html); [json-socket](https://www.npmjs.com/package/jsonsocket); [underscore](https://www.npmjs.com/package/underscore); [fs](https://nodejs.org/api/fs.html); [dgram](https://nodejs.org/api/dgram.html).
3. To run more nodes(servers) on once machine we need to set up more local host addresses on lo0 interface.
For this we need to write the following Linux command in our terminal (```sudo ifconfig lo0 alias 127.0.0.N 255.255.255.0```), were in sted of ```N``` any number between 0-254.

After the installation of the JavaScript environment, modules and setting up more localhost addresses we are ready to go.
First we need to start our ```node.js``` several times to simulate our grapths nodes. Starting our node.js requers to give some parameters (```HOST, PORT, Neighbours HOST, data_file.json```). 

Example of the command to start one node togheter with parameters ( ```node node.js 127.0.0.2 3000 '["127.0.0.5", "127.0.0.3"]' data_node_2.json``` ).

After starting several nodes that have logical settings between them we can run our ```client.js```. The purpuse of the client in this application is to find the MAVEN node and further to comunicate with it using TCP for requesting it's won data plus his neighbours once.

MAVEN node is the node that have the biggest number of neighbours and also the biggest number of data.

After starting the ```client.js``` the cliend sends a UDP multicast message(command) asking for some information(what is the nodes address that listening on multicast address, how many nodes neighbours they have and how many data they have as well ) from all nodes. Each node sends back using UDP unicast protocol their address, number of neighbours and number of data they have.

After the client recives the answeres from all nodes it proccess them for finding the MAVEN node.

After the MAVEN node was found our client sends a TCP message.command to him(MAVEN) asking for the information they have plus its neighbours one. The MAVEN node starts collecting the information from it's neighbours and append all to it's own. After it finished to collect data from it's neighbours, it send's back using TCP protocol to the client.

After the client recieves the data from the MAVEN node and it's neighbours once, the client start to fillter, sort and group it with the specific criteria.

After filltering, sorting and grouping client saves the result to a file.



######Here is an example:
We have a graph with 4 nodes.

![alt tag](https://github.com/CristianChris/UDP-unicast-multicast-TCP-Client-Server-Application/blob/master/images/1.png "Example 1 model")



####Under construction

