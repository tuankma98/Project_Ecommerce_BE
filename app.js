const express = require('express')
const bodyParser = require("body-parser");
const cors = require("cors");
var morgan = require('morgan')
require('dotenv').config()

const route = require('./src/routes');
const db = require('./src/config/db.config');

const app = express()
const port = process.env.POST || 3000

/**
 * Connect to MongoServer
 */
db.initMongoServer();
db.initAdminAccount();

var corsOptions = {
  origin: "http://localhost:8081"
};
app.use(cors(corsOptions));
app.use(morgan("dev"));
// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Init Route
 */
route(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})