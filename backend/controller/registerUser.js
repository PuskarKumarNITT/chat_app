const UserModel = require("../models/UserModel");
const bcrypt = require("bcryptjs");
async function registerUser(req,res){
    try{
        const {name,email,password,profile_pic} = req.body;
        const checkEmail = await UserModel.findOne({email})  // check for email 
        if(checkEmail){
            return res.status(400).json({
                message: "User already Exist",
                error : true
            })
        }

        // password to hash conversion using bcrypt 
        const salt = bcrypt.genSaltSync(10);
        const hashpassword = bcrypt.hashSync(password, salt);

        const payload = {
            name,
            email,
            profile_pic,
            password: hashpassword
        }

        const user = new UserModel(payload);
        const userSave  = await user.save();

        return res.status(201).json({
            message: "User Created Successfully",
            data: userSave,
            success: true
        })
    } catch(error) {
        return res.status(500).json({
            message: error.message || error,
            error : true
        })
    }
}

module.exports = registerUser;