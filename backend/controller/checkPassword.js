const UserModel = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


async function checkPassword(req, res) {
    try {
        const { password, userId } = req.body;

        const user = await UserModel.findOne({ _id: userId });

        const verifyPassword = bcrypt.compareSync(password, user.password);

        if (!verifyPassword) {
            return res.status(400).json({
                message: "please check your password",
                error: true
            })
        }
        const tokenData = {
            id: user._id,
            email: user.email
        }

        const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });

        const cookieOptions = {
            httpOnly: true,          // prevents access via JS
            secure: true,            // use false on localhost, true on production
            sameSite: "None",        // for cross-site cookies (required for Render)
            maxAge: 24 * 60 * 60 * 1000
        }

        return res.cookie('token', token, cookieOptions).status(200).json({
            message: "Logged in",
            token,
            success: true
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message || err,
            error: true
        })
    }
}

module.exports = checkPassword;