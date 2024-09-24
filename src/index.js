const express = require("express");
const multer = require("multer");  // Import multer
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


app.use("/user", require("./routes/userRoutes"));
app.use("/about", require("./routes/aboutRoutes"));
app.use("/career", require("./routes/careerRoutes"));

const PORT = process.env.REACT_APP_SERVER_DOMIN;

// Set storage engine for Multer
// const storage = multer.diskStorage({
//   destination: './uploads/', // Specify the folder where you want to store files
//   filename: function (req, file, cb) {
//     // Save file with a unique name (timestamp + original name)
//     cb(null, Date.now() + path.extname(file.originalname));
//   }
// });


// Initialize upload
const uploadImage = multer({dest: 'uploads/'});

// Create a route to handle file upload
app.post('/upload',  uploadImage.single("file"),(req, res) => {
  console.log("req.body",req.body);
  console.log("req.file",req.file)
  if (!req.file) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }
  const url = req.file.originalname.replaceAll(" ", '-');
  // Return file info or URL
  res.json({
    url : `http://localhost:8000/${req.file.path}.${req.file.mimetype.split('/')[1]}`,
    file: `uploads/${req.file.originalname.replaceAll(" ", '-')}`
  });
});

app.get("/", (req, res) => {
  res.json({
    msg: 'Okay',
    status: 200,
  });
});


app.get("/file/:uuid", (req, res) => {
  res.json({
    msg: 'Okay',
    status: 200,
  });
});



app.listen(PORT, () => console.log("Server is running at port : " + PORT));
