const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema(
    {
            firstname: {
            type: String,
required:true,
            minlength: 3,
            maxlength: 55,
            unique: true,

        },
        lastname: {
            required:true,
            type: String,
            unique: true,
            minlength: 3,
            maxlength: 55,


        },
        username: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 55,
            unique: true,
            trim: true,



        },
        phone: {
            type: String,
            required: true,
            maxlength: 8,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            validate: [isEmail],
            lowercase: true,
            unique: true,
            trim: true,
        },
        token: {
            type: String,


        },
        password: {
            type: String,
            required: true,
            max: 1024,
            minlength: 6
        },
        resetPasswordLink: {
            data: String,
            default: ""
        },
    },
    {
        timestamps: true,
             }
);



userSchema.pre("save", async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error('incorrect password');
    }
    throw Error('incorrect email')
};

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;

