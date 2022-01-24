<img src="coderhouse.png" align="right" />

# ProductsInExpress

This readme will detail the total deliveries of a Coderhouse backend programming course.

## Deliveries

- [Entrega3](https://github.com/nicolas-jb/ProductsInExpress/tree/main/src/Entrega3) - Make a server project based on node.js that uses the express middleware and deploy the following endpoints on port 8080:

	- Route get '/products' that returns an array with all available products on the server
	- Route get '/productoRandom' that returns a product chosen at random among all the products available

- [Entrega4](https://github.com/nicolas-jb/ProductsInExpress/tree/main/src/Entrega4) - Make a server project based on node.js and express that offer a RESTful API of products. In detail, incorporating the following routes:
	-  GET '/api/productos' 
	-  GET '/api/productos/:id' 
	-  POST '/api/productos' 
	-  PUT '/api/productos/:id' 
	-  DELETE '/api/productos/:id'

- [Entrega5-EJS](https://github.com/nicolas-jb/ProductsInExpress/tree/main/src/Entrega5-EJS) - Using the same product API of the class's deliverable project above, build a web server (not REST) that incorporates with EJS: 
	- A product upload form in the root path (set the path '/productos' to receive the POST, and redirect to the same form).
	- A view of the loaded products in the GET route '/productos'.
	- Both pages will have a button that redirects to the other.


- [Entrega5-PUG](https://github.com/nicolas-jb/ProductsInExpress/tree/main/src/Entrega5-PUG) - Using the same product API of the class's deliverable project above, build a web server (not REST) that incorporates with PUG: 
	- A product upload form in the root path (set the path '/productos' to receive the POST, and redirect to the same form).
	- A view of the loaded products in the GET route '/productos'.
	- Both pages will have a button that redirects to the other.


- [Entrega5-Handlebars](https://github.com/nicolas-jb/ProductsInExpress/tree/main/src/Entrega5-Handlebars) - Using the same product API of the class's deliverable project above, build a web server (not REST) that incorporates with Handlebars: 
	- A product upload form in the root path (set the path '/productos' to receive the POST, and redirect to the same form).
	- A view of the loaded products in the GET route '/productos'.
	- Both pages will have a button that redirects to the other.

- [Entrega6](https://github.com/nicolas-jb/ProductsInExpress/tree/main/src/Entrega6) - 
- Instruction 1: 
	- Modify the last deliverable so that it has a websocket channel that allows to represent, below the entry form, a table with the list of products in real time (There can be several clients connected simultaneously and in each of them they will be reflected changes made to products without having to reload the view). 
	 - When a client connects, he will receive the list of products to represent in the view.

Aspects to include in the deliverable: To build the dynamic table with the data received by websocket use Handlebars in the frontend. 

- Instruction 2: 
	- We will add a chat channel between the clients and the server to the project.

Aspects to include in the deliverable: 
At the bottom of the entry form, the center of messages stored in the server, where the messages of all the users identified by their email appear. 
The format to be represented will be: 
email (bold text in blue) [date and time DD/MM/YYYY HH:MM:SS)] (normal text in brown) : message (italic text in green) 
Also incorporate two input elements: 
		- One for the user to enter their email (mandatory to be able to use the chat) and another to enter messages and send them using a button. 
	- Messages must persist on the server in a file.

- [Entrega7](https://github.com/nicolas-jb/ProductsInExpress/tree/main/src/Entrega7) - Create a table view that consumes from the route '/api/productos-test' of the server a list with 5 randomly generated products using Faker.js as random test information generator (instead of being taken from the database data). Choosing appropriately the topics to make up the 'product' object (name, price and photo).

- [Entrega13](https://github.com/nicolas-jb/ProductsInExpress/tree/main/src/Entrega13) - Implement on the deliverable that we have been performing authentication through  passport + Facebook. Once the user is logged in, their name will be displayed complete, email and profile picture. Data will be extracted from the profile returned by the social network. In addition, a session space controlled by passport will be activated. This will be active for 10 minutes and in each access this will be recharged.
Implement error views for login (invalid credentials) and registration (user already
registered).
The rest of the functions must remain as they were in the original project.

- [Entrega14](https://github.com/nicolas-jb/ProductsInExpress/tree/main/src/Entrega14) - On the project of the last deliverable challenge, move all the keys and credentials used to a .env file, and load it using the dotenv library.
The only configuration that is not going to be handled with this library is going to be the listening port of the server. It should be read from the arguments passed on the command line, using some library (minimist or yargs). In the case of not passing this parameter by command line, connect by default to the port 8080.
Observation: for the moment you can leave the choice of session and persistence explicit in the code itself. Later we will also make this configuration parameterizable.

	Add a '/info' route that presents the following data in a simple view:
	- Input arguments 
	- Path of execution
	- Platform name (operating system) 
	- Process id
	- Node.js version 
	- Project folder
	- Total reserved memory (rss)
	
	Add another route '/api/randoms' that allows calculating a number of random numbers in the range from 1 to 1000 specified by query parameters (query).
For example: /randoms?cant=20000.
If such a parameter is not entered, calculate 100,000,000 numbers.
The data returned to the frontend will be an object that will contain the numbers as keys
random generated along with the number of times each one came out. This route will not be blocking (use the fork method of child process). Check the non-blocking with a
amount of 500,000,000 randoms.

	**Remark: use separate routers and apis for this functionality.**

- [Entrega15](https://github.com/nicolas-jb/ProductsInExpress/tree/main/src/Entrega15) - Instruction:
Based on the project that we are carrying out, add one more parameter in the command path that allows the server to be executed in fork or cluster mode. This parameter will be 'FORK' in the first case and 'CLUSTER' in the second, and if it is not passed, the server will start in fork mode.
	- Add in the info view, the number of processors present in the server.
	- Run the server (FORK and CLUSTER modes) with nodemon checking the number of processes taken by node.
	- Run the server (with the appropriate parameters) using Forever, verifying its correct operation.
List the processes by Forever and by operating system.

	Run the server (with proper parameters: FORK mode) using PM2 in your fork and cluster modes. List the processes by PM2 and by operating system. 
	- Both in Forever and in PM2 allow the listening mode, so that the update of the server code is immediately reflected in all processes. 
	- Test the completion of fork and cluster processes in the appropriate cases. 

	Configure ***Nginx*** to load balance our server as follows: Redirect all queries to /api/randoms to a cluster of servers listening on the port 8081. The cluster will be created from node using the native cluster module. Redirect all other queries to a single server listening on port 8080. Check that everything works correctly. Then modify the configuration so that all queries to /api/randoms are redirected to a cluster of servers managed from nginx, dividing them equally among 4 instances listening on ports 8082, 8083, 8084 and 8085 respectively.

- [Entrega16](https://github.com/nicolas-jb/ProductsInExpress/tree/main/src/Entrega16) - Add gzip compression to the worker server project.
Check on the /info route with and without compression, the difference in the number of bytes returned in a case and another.

	Then implement logging that logs the following:
	- Path and method of all requests received by the server (info)
	- Route and method of requests to routes that do not exist on the server (warning)
	- Errors thrown by message and product apis, only (error)

	Consider the following criteria:

● Log all levels to console (info, warning and error)

● Record only the warning logs to a file called warn.log

● Send only the error logs to a file called error.log


Then, perform the complete analysis of the performance of the server with which we come working.
We are going to work on the '/info' route, in fork mode, adding or extracting a console.log from the information collected before returning it to the client. In addition we will disable the child_process of the route '/randoms'

For both conditions (with or without console.log) in path '/info' GET:
	- The profiling of the server, performing the test with --prof of node.js. Analyze the results obtained after processing them with --prof-process.
	- We will use **Artillery** as a command line load test, emulating 50 concurrent connections with 20 requests for each one. Extract a report with the results in a text file.

We will then use **Autocannon** on the command line, emulating 100 concurrent connections made in a time of 20 seconds. 

Server profiling with node.js inspector mode --inspect. Check process time
Less performant on the inspection source file.

The flame diagram with **0x**, emulating the load with ***Autocannon*** with the same parameters as above.

- [Entrega19](https://github.com/nicolas-jb/ProductsInExpress/tree/main/src/Entrega19) - Divide the deliverable project with which we have been working into layers, properly grouping the routing, controller, business logic and persistence layers.  

	Consider grouping routes by functionality, with their controllers, business logic with use cases, and persistence layer.  
	The persistence layer will contain the necessary methods to deal with the interaction of the business logic with the data itself.

- [Entrega20](https://github.com/nicolas-jb/ProductsInExpress/tree/main/src/Entrega20) - Modify the persistence layer incorporating the concepts of Factory and DAO.
	- The DAOs must present the same interface towards the business logic of our server.
	- The selected DAO (by a command line parameter as we did above) will be
returned by a Factory for the business layer to operate with.
	- Each of these persistence cases must be implemented using the singleton pattern that prevent the creation of new instances of these data access mechanisms.
	- Check that if I call the factory twice, with the same option chosen, it returns the same instance.
	 
	*Use DTO to display information in the same way regardless of persistence mode*

- [Entrega20 - refactor](https://github.com/nicolas-jb/ProductsInExpress/tree/main/src/Entrega20%20-%20refactor) - -  Refactor of Release20, further layering the project and improving views

- [Entrega21](https://github.com/nicolas-jb/ProductsInExpress/tree/main/src/Entrega21) - Instruction
	- Develop a test HTTP client that uses **Axios** to send requests, and test the
functionality towards the API Rest of products, verifying the correct reading of available products, incorporation of new products, modification and deletion.
	- Make the client in an independent module and from a separate code generate the requests corresponding, reviewing the results from the database and in the server response obtained on the HTTP client.

- [Entrega22](https://github.com/nicolas-jb/ProductsInExpress/tree/main/src/Entrega22) - Based on the latest RESTful API server deliverable project, reform the routing layer and the controller so that requests can be made through the query language
**GraphQL**.
Use ***GraphiQL*** to perform functional testing of queries and mutations.

- [Entrega23-koa](https://github.com/nicolas-jb/ProductsInExpress/tree/main/src/Entrega23-koa) - Move the current project to the **KOA** framework

- [Entrega23-sails](https://github.com/nicolas-jb/ProductsInExpress/tree/main/src/Entrega23-sails) - Move the current project to the **SAILS** framework