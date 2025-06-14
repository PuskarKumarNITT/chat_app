const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");

async function userDetails(req,res){
    try{
        const token = req.cookies.token || "";

        // console.log("Token in user Details",token);

        const user = await getUserDetailsFromToken(token);

        return res.status(200).json({
            message: "User details",
            data: user
        })

    }catch (err){
        return res.status(500).json({
            message: err.message || err,
            error: true
        })
    }
}

module.exports = userDetails;