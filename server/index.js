// Importing Node modules and initializing Express
const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  logger = require("morgan"),
  router = require("./router"),
  mongoose = require("mongoose"),
  config = require("./config/main"),
  socket = require("./socket"),
  cors = require("cors");

// Database Setup
mongoose.connect(config.database, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// for testing
app.use(cors());
app.set('view engine', 'ejs');
// Start the server
let server;
if (process.env.NODE_ENV != config.test_env) {
  server = app.listen(config.port);
  console.log(`Your server is running on port ${config.port}.`);
} else {
  server = app.listen(config.test_port);
}

// Set static file location for production
// app.use(express.static(__dirname + '/public'));

// Setting up basic middleware for all Express requests
app.use(bodyParser.json()); // Send JSON responses
app.use(bodyParser.urlencoded({ extended: true })); // Parses urlencoded bodies
app.use(logger("dev")); // Log requests to API using morgan

// Enable CORS from client-side
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// Import routes to be served
router(app);

socket.init(server)

// necessary for testing
module.exports = server;
