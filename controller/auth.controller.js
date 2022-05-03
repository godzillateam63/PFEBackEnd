const UserModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const { singUpErrors, signInErrors } = require('../utils/errors.utils');

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (id) => {
    return jwt.sign({id}, process.env.TOKEN_SECRET, {
        expiresIn: maxAge
    })
};

module.exports.signUp = async (req, res) => {
 /*   var myData = new UserModel(req.body);
    myData.save().then(item => {
        res.send("item saved to database");
    }) .catch(err => {
        res.status(400).send("unable to save to database");
    });*/
   const {firstname, lastname, username,phone,email,token,password} = req.body

    try {
        const user = await UserModel.create({firstname, lastname, username,phone,email,token,password });
        res.status(201).json({ user: user._id});
        if(user){
            console.log(req.body)
        }
    }
    catch(err) {
        const errors = singUpErrors(err);
        res.status(200).send({ errors })
    }
}
module.exports.signIn=async (req,res) =>{
    const {email,password } = req.body
    try {
        const user = await UserModel.login(email,password); 
        const token = createToken(user._id);

        //console.log(user);
       // console.log(token);
        res.cookie('jwt', token,{httpOnly: true, maxAge});
        res.status(201).json({user:user._id});


    }catch (err){
        const errors =signInErrors(err)
        res.status(200).json({errors});

    }

}
module.exports.logOut=async (req,res) =>{
    res.cookie('jwt','',{maxAge:1}); 
    res.redirect('/');

}

exports.forgotPassword = (req, res) => {
    if (!req.body) return res.status(400).json({ message: "No request body" });
    if (!req.body.email)
        return res.status(400).json({ message: "No Email in request body" });

    console.log("forgot password finding user with that email");
    const { email } = req.body;
    console.log("signin req.body", email);
    
    UserModel.findOne({ email }, (err, user) => {
     
        if (err || !user)
            return res.status("401").json({
                error: "User with that email does not exist!"
            });


        const token = jwt.sign(
            { _id: user._id, iss: "NODEAPI" },
            process.env.JWT_SECRET
        );

 
        const emailData = {
            from: "noreply@node-react.com",
            to: email,
            subject: "Password Reset Instructions",
            text: `Please use the following link to reset your password: ${process.env.CLIENT_URL
            }/reset-password/${token}`,
            html: `<p>Please use the following link to reset your password:</p> <p>${process.env.CLIENT_URL
            }/reset-password/${token}</p>`
        };

        console.log(token)
        return user.updateOne({ resetPasswordLink: token }, (err, success) => {
            if (err) {
                return res.json({ message: err });
            } else {
                sendEmail(emailData);
                return res.status(200).json({
                    message: `Email has been sent to ${email}. Follow the instructions to reset your password.`
                });
            }
        });
    });
};
exports.resetPassword = (req, res) => {
    const { resetPasswordLink, newPassword } = req.body;

    UserModel.findOne({ resetPasswordLink }, (err, user) => {
 
        if (err || !user)
            return res.status("401").json({
                error: "Invalid Link!"
            });

        const updatedFields = {
            password: newPassword,
            resetPasswordLink: ""
        };

        user = _.extend(user, updatedFields);
        UserModel.updated = Date.now();

        user.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json({
                message: `Great! Now you can login with your new password.`
            });
        });
    });
};
