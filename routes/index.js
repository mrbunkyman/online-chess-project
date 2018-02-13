var express = require("express"),
    router = express();

// router.use(express.static('/public'));
//router.use(express.static("public"));
router.get("/",(req,res)=>{
    res.render("./index/index");
})

module.exports = router;