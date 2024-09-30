const express = require("express");
const multer = require("multer");  // Import multer
const app = express();
const cors = require("cors");
const path=require("path");


const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};

app.use(cors(corsOptions));
const dotenv = require("dotenv");
require("./mongoconfig");
dotenv.config();
app.use(express.json({ limit: '50mb' }));


app.use("/user", require("./routes/userRoutes"));
app.use("/about", require("./routes/aboutRoutes"));
app.use("/career", require("./routes/careerRoutes"));
app.use("/home", require("./routes/homeRoutes"));
app.use('/images', express.static(path.join(__dirname, 'images')));

const PORT = process.env.REACT_APP_SERVER_DOMIN;

app.get("/", (req, res) => {
  res.json({
    msg: 'Okay',
    status: 200,
  });
});

app.listen(PORT, () => console.log("Server is running at port : " + PORT));
