const dotenv = require("dotenv");
require("./mongoconfig");
dotenv.config();

const express = require("express");
const multer = require("multer"); 
const app = express();
const cors = require("cors");
const path=require("path");
const { principalAdd, principalEdit, imageTest } = require("./controller/PrincipalController");
let upload = require("./utils/uploadConfig");
const { directorAdd, directorEdit } = require("./controller/DirectorController");
const { bannerAdd } = require("./controller/BannerController");
const { resultAdd } = require("./controller/ResultController");
const { galleryAdd } = require("./controller/GalleryController");
const uploadgallery = require("./utils/uploadGallery");
const { donationAdd } = require("./controller/DonationController");


const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '2000mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/file', express.static(path.join(__dirname, '..', 'tmps')));
app.use('/files', express.static(path.join(__dirname, '..', 'tmp')));
app.post("/image/test",upload.single('photo'), imageTest);
app.post("/about/principal/add", upload.single('photo'), principalAdd);
app.post("/about/principal/edit",upload.single('photo'), principalEdit);
app.post("/about/director/add", upload.single('photo'), directorAdd);
app.post("/about/director/edit",upload.single('photo'), directorEdit);
app.post("/home/banner/add", upload.single('photo'), bannerAdd);
app.post("/result/add", upload.single('photo'), resultAdd);
app.post("/facilities/gallery/add", uploadgallery.array('photos'), galleryAdd);
app.post("/donation/add", upload.single('photo'), donationAdd);
 
upload = multer();
app.use(upload.none()); 

app.use("/user", require("./routes/userRoutes"));
app.use("/about", require("./routes/aboutRoutes"));
app.use("/career", require("./routes/careerRoutes"));
app.use("/home", require("./routes/homeRoutes"));
app.use("/result", require("./routes/resultRoutes"));
app.use("/fees", require("./routes/feesRoutes"));
app.use("/facilities", require("./routes/facilitiesRoutes"));

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use("/donation", require("./routes/facilitiesRoutes"));

const PORT = process.env.REACT_APP_SERVER_DOMIN;

app.get("/", (req, res) => {
  res.json({
    msg: 'Okay',
    status: 200,
  });
});

app.listen(PORT, () => console.log("Server is running at port : " + PORT));
