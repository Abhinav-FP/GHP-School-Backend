const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, 
}; 


app.use(cors(corsOptions));
const dotenv = require("dotenv");
require("./mongoconfig");
dotenv.config();
app.use(express.json({ limit: '10mb' }));
const path = require('path');

app.use("/user", require("./routes/userRoutes"));

// app.use("/task", require("./routes/taskRoutes"));


const PORT = process.env.REACT_APP_SERVER_DOMIN;
app.get("/", (req, res) => {
  res.json({
    msg:'Okay',
    status:200
  })
});

app.listen(PORT, () => console.log("Server is running at port : " + PORT));
 