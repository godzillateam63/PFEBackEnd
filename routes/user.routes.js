const  router = require('express').Router();
const authController = require("../controller/auth.controller");
const userController = require("../controller/user.controller");


const { passwordResetValidator} = require('../utils/errors.utils');


router.post("/signup",authController.signUp);
router.post("/login",authController.signIn)
router.get("/logout",authController.logOut)
router.post('/email-password-send',authController.forgotPassword)
router.post('/change-password',authController.resetPassword)

router.get('/',userController.getAllUser)

router.get("/:id",userController.userInfo);

router.put("/:id",userController.updateUser);

router.delete("/:id",userController.DeleteUser);

module.exports=router;