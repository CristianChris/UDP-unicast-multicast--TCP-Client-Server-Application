####Application's [Report](under construction)
####Running the application:
In order to run our aplication we will need to install several tools for that:

1. [NodeJS](https://nodejs.org/en/) as a JavaScript environment.
2. Node.js modules: net; json-socket; underscore; fs; dgram.
3. If we will run more nodes(servers) on once machine we need to set up more local host addresses on lo0 interface.
For this we need to write the following Linux command in our terminal (```sudo ifconfig lo0 alias 127.0.0.N 255.255.255.0```), were in sted of ```N``` any number between 0- 254.

After the installation of the JavaScript environment, modules and setting up more localhost addresses we are ready to go.
First we need to open our node.js file that represents a node(burl or knot)

####Under construction
After the installation, from our terminal we will need to run first our Redis service to serve us the brokering. For this just type the following command: ```redis-server```

Afterwards, open a new terminal instance and type the following command: ```node app [port]```

Note! We should be at the path where our project tree is located!

Instead of [port] you need to write what port you want to run this app on. You can open multiple instances of the application running on different ports, considering they are not running anohter process.
