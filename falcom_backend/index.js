// Importing the packages (express)
const express = require("express");
const connectDatabase = require("./database/database");
const dotenv = require("dotenv");
const cors = require("cors");
const accessFromData = require("express-fileupload");
const fs = require("fs");
const path = require("path");
const https = require("https");
const helmet = require("helmet");

// Creating an express app
const app = express();

// Express Json Config
app.use(express.json());

app.use(express.static("./public"));

// Helmet Configuration
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "trusted-cdn.com"],
        styleSrc: ["'self'", "fonts.googleapis.com"],
        imgSrc: ["'self'", "data:", "trusted-cdn.com"],
      },
    },
  })
);

// express fileupload
app.use(accessFromData());

// use hpp to prevent http parameter pollution
const hpp = require("hpp");
app.use(hpp());
app.use(express.urlencoded({ extended: true }));

// const csrf = require("csurf");
// const csrfProtection = csrf({ cookie: true });
// app.use(csrfProtection);

//  cors configuration
const corsOptions = {
  origin: true,
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

// dotenv Configuration
dotenv.config();

// Connecting to database
connectDatabase();

// Defining the port
const PORT = process.env.PORT;

// Making a test endpoint
// Endpoints : POST, GET, PUT , DELETE
app.get("/test", (req, res) => {
  res.send("Test API is Working!....");
});
const options = {
  key: fs.readFileSync(path.resolve(__dirname, "server.key")),
  cert: fs.readFileSync(path.resolve(__dirname, "server.crt")),
};
// Configuring Routes of User
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/product", require("./routes/productRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/review", require("./routes/review&ratingRoutes"));
app.use("/api/order", require("./routes/orderRoutes"));
app.use("/api/khalti", require("./routes/paymentRoutes"));
app.use("/api/admin", require("./routes/activityRoute"));

// app.get("/api/csrf-token", (req, res) => {
//   res.json({ csrfToken: req.csrfToken() }); // Send CSRF token to the client
// });
// Starting the server (always at the last)
https.createServer(options, app).listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
module.exports = app;
