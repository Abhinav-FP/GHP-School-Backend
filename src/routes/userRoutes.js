const router =  require("express").Router();

const {signup, login, profile, verifyToken} = require("../controller/AuthController")


router.post("/signup", signup);

router.post("/login", login);  
router.get("/profile", verifyToken,  profile);  


module.exports= router;