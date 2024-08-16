This is Graphql Server. It using Postgrephile to connect postgresql database.

The details of database connection inside the dbConnection.js file. Also database Url, JWT Secret and Port details are available inside the .Env file plese checkout.

This server will start using node index.js

Requirments:

NodeJs
Postgresql Database

Steps:

1: Clone this Server Repository

2: type " npm i " command to install all depencency.

3: to run server type " node index.js"

There is a database file inside the Database folder. Please checkout that SQL file.

We implemented database security such as Row level permission, it always ask for JWT token with their corresponding Userid to access database. Also implemented a Roles base authentication. We added Constraints in our table so it will through error for wrong input validation. So it has input validation in our database as well as front-end side.

This server give only one API endpoint, here we got the API endpoint URL : http://localhost:$PORT/graphql. We can Access our Api with this just one URl which makes thing Easier. There is also Playground which is created by Postgrephile. That can Access by URL :http://localhost:$PORT/graphiql.
