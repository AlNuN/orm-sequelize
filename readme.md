# Orm Sequelize

This is a project where I follow the Alura's course 'ORM com Sequelize'. It runs on NodeJS and requires a little setup.

After downloading the project You'll need to install the dependencies with the command `npm install`. Be sure to have NodeJS, NPM and a MySQL database installed in your machine.

Configure the connection to the database in the file `api/config/config.json`. It's very straightfoward, just add your username, password and database name in the `development` object.

In order to create the tables in the database use the command `npx sequelize-cli db:migrate`. You can populate the tables using the command `npx sequelize-cli db:seed:all`.

Run `npm start` and the application will be served at [localhost:3000](http://localhost:3000/) with nodemon hot reload.

Then you can try the routes such as GET `pessoas` and the others declared at `api/routes`.
