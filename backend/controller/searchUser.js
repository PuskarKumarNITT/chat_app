const UserModel = require("../models/UserModel");

async function searchUser(request, response) {
    try {
        const { search } = request.body;
        const query = new RegExp(search,"i");
        const user = await UserModel.find({
            "$or":[
                {name: query},
                {email: query}
            ]
        })

        return response.json({
            message: 'all User',
            data: user,
            success: true
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true
        })
    }
}

module.exports = searchUser;