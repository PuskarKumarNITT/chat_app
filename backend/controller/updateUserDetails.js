const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");
const UserModel = require("../models/UserModel");

async function updateUserDetails(req,res){
    try{
        const token = req.cookies.token || "";

        const user = await getUserDetailsFromToken(token);
        
        const {name,profile_pic} = req.body;
        const updateUser = await UserModel.updateOne({_id: user._id},{
            name,
            profile_pic
        })

        const userInformation = await UserModel.findById(user._id);

        return res.json({
            message: "user update successfully",
            data: userInformation,
            success: true
        })
    }catch (err){
        return res.status(500).json({
            message: err.message|| err,
            error: true
        })
    }
}

module.exports = updateUserDetails;