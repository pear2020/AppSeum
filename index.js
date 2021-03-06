import express from "express";
import dotenv from "dotenv";
import userRouter from "./router/userRouter.js";
import itemRouter from "./router/itemRouter.js";
const app = express();
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import helmet from 'helmet'; // creates headers that protect from attacks (security) 
app.use(helmet())
//cloud mongodb connection
var mongoDB = "mongodb+srv://capstone:capstone@cluster0.kcjop.mongodb.net/gallery";
//Get the default connection
var db = mongoose.connection;
import cookieParser from "cookie-parser";

mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// ** MIDDLEWARE ** //
const whitelist = ['http://localhost:3000', 'http://localhost:4000', 'https://appseum-0403.herokuapp.com']
const corsOptions = {
  origin: function (origin, callback) {
    console.log("** Origin of request " + origin)
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      console.log("Origin acceptable")
      callback(null, true)
    } else {
      console.log("Origin rejected")
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(cors(corsOptions));

// parse application/x-www-form-urlencoded
//accepting larger image file here to save
app.use(bodyParser.urlencoded({
  parameterLimit: 100000,
  limit: '50mb',
  extended: true
}));
// parse application/json
//accepting larger image file here to save
app.use(bodyParser.json({
  parameterLimit: 100000,
  limit: '50mb',
  extended: true
}));
app.use(cookieParser());

app.use("/api/users", userRouter);
app.use("/api/items", itemRouter);

dotenv.config();

//if port 4000 is occupied, will go to 5000
//const PORT = process.env.PORT || 5000;
const PORT = process.env.PORT || 4000

//getting the web server. port 4000
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

import path from "path";
import { fileURLToPath } from 'url';


if(process.env.NODE_ENV === "production"){
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  // Serve static files from the React frontend app
  app.use(express.static(path.join(__dirname, 'front-end/build')))
  // Anything that doesn't match the above, send back index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/front-end/build/index.html'))
  })
}
