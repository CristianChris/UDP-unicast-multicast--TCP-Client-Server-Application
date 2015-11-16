####Application's [Report](under construction)
####Running the application:
In order to run our application we will need to install several tools for that:

1. [NodeJS](https://nodejs.org/en/) as a JavaScript environment.
2. Node.js modules: [net](https://nodejs.org/api/net.html); [json-socket](https://www.npmjs.com/package/jsonsocket); [underscore](https://www.npmjs.com/package/underscore); [fs](https://nodejs.org/api/fs.html); [dgram](https://nodejs.org/api/dgram.html).
3. To run more nodes(servers) on once machine we need to set up more local host addresses on lo0 interface.
For this we need to write the following Linux command in our terminal (```sudo ifconfig lo0 alias 127.0.0.N 255.255.255.0```), were in stead of ```N``` any number between 0-254.

After the installation of the JavaScript environment, modules and setting up more localhost addresses we are ready to go.
First we need to start our ```node.js``` several times to simulate our graphs nodes. Starting our node.js requires to give some parameters (```HOST, PORT, Neighbours HOST, data_file.json```). 

Example of the command to start one node together with parameters ( ```node node.js 127.0.0.2 3000 '["127.0.0.5", "127.0.0.3"]' data_node_2.json``` ).

After starting several nodes that have logical settings between them we can run our ```client.js```. The purpose of the client in this application is to find the MAVEN node and further to communicate with it using TCP for requesting it's won data plus his neighbours once.

MAVEN node is the node that have the biggest number of neighbours and also the biggest number of data.

After starting the ```client.js``` the client sends a UDP multicast message(command) asking for some information(what is the nodes address that listening on multicast address, how many nodes neighbours they have and how many data they have as well ) from all nodes. Each node sends back using UDP unicast protocol their address, number of neighbours and number of data they have.

After the client receives the answers from all nodes it process them for finding the MAVEN node.

After the MAVEN node was found our client sends a TCP message.command to him(MAVEN) asking for the information they have plus its neighbours one. The MAVEN node starts collecting the information from it's neighbours and append all to it's own. After it finished to collect data from it's neighbours, it send's back using TCP protocol to the client.

After the client receives the data from the MAVEN node and it's neighbours once, the client start to filter, sort and group it with the specific criteria.

After filtering, sorting and grouping client saves the result to a file.



#####Here is an example:
We have a graph with 4 nodes:

![alt tag](https://github.com/CristianChris/UDP-unicast-multicast-TCP-Client-Server-Application/blob/master/images/1.png "Example 1 model")

Each node have some data that is stored in data files (```data_node_2.json, data_node_3.json,...,data_node_5.json```).
![alt tag](https://github.com/CristianChris/UDP-unicast-multicast-TCP-Client-Server-Application/blob/master/images/2.png "Data entry of each node")

Using our logic we understand that the MAVEN node is node number 3 because it have the biggest number of neighbours and the biggest data (data entry).

![alt tag](https://github.com/CristianChris/UDP-unicast-multicast-TCP-Client-Server-Application/blob/master/images/3.png "MAVEN node")

Once we have imagined our graph we can start to create it.

First we need to create 4 localhost address on lo0 interface. For this we can write the following command in our terminal:
```sudo ifconfig lo0 alias 127.0.0.2 255.255.255.0```
```sudo ifconfig lo0 alias 127.0.0.3 255.255.255.0```
```sudo ifconfig lo0 alias 127.0.0.4 255.255.255.0```
```sudo ifconfig lo0 alias 127.0.0.5 255.255.255.0```

After we created our virtual localhost address we run 4 times our ```node.js``` file with the logical parameters:

(```node node.js HOST, PORT, Neighbours HOST, data_file.json```).

2) ```node node.js 127.0.0.2 3000 '["127.0.0.5", "127.0.0.3"]' data_node_2.json``` 

![alt tag](https://github.com/CristianChris/UDP-unicast-multicast-TCP-Client-Server-Application/blob/master/images/node_2.png "node_2")

3) ```node node.js 127.0.0.3 3000 '["127.0.0.2", "127.0.0.4"]' data_node_3.json```

![alt tag](https://github.com/CristianChris/UDP-unicast-multicast-TCP-Client-Server-Application/blob/master/images/node_3.png "node_3")

4) ```node node.js 127.0.0.4 3000 '["127.0.0.3" ]' data_node_4.json```

![alt tag](https://github.com/CristianChris/UDP-unicast-multicast-TCP-Client-Server-Application/blob/master/images/node_4.png "node_4")

5) ```node node.js 127.0.0.5 3000 '["127.0.0.2" ]' data_node_5.json```

![alt tag](https://github.com/CristianChris/UDP-unicast-multicast-TCP-Client-Server-Application/blob/master/images/node_5.png "node_5")

Once we have created our graph and settled up, we can run our ```client.js``` by the command ```node client.js```

![alt tag](https://github.com/CristianChris/UDP-unicast-multicast-TCP-Client-Server-Application/blob/master/images/client.png "client")

As we see the ```client.js``` found the correct MAVEN (node 3) that have the address ```127.0.0.3``` and further collected the data that was filtered and saved.



