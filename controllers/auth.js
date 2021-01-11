const { response } = require("express");
const bcrypt = require('bcryptjs');

const User = require('../models/user.js');
const { generateJWT } = require("../helpers/jwt.js");

const createUser = async (req, res = response) => {

    const { email, password } = req.body;
    try {

        const EmailExists = await User.findOne({email});

        if(EmailExists){
            return res.status(400).json({
                ok: false,
                msg: 'this email is already validated'
            });
        }

        const user = new User(req.body);

        //Encriptar password
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        await user.save();

        // Generar mi JWT
        const token = await generateJWT(user.id);

        res.json({
            ok: true,
            user,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'talk with the admin'
        })
    }


}

const login = async (req, res = response) => {

    const {email, password} = req.body;

    try {
        const userDB = await User.findOne({email});
        if(!userDB){
            return res.status(404).json({
                ok: false,
                msg: 'Email not found'
            });
        }

        //validate the password
        const validatePassword = bcrypt.compareSync(password, userDB.password);
        if(!validatePassword){
            return res.status(400).json({
                ok: false,
                msg: 'Password isn´t valid'
            });
        }

        //Generate JWT
        const token = await generateJWT(userDB.id);

        return res.json({
            ok: true,
            user: userDB,
            token
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'talk with the admin'
        });
    }
}

const renewToken = async (req, res = response) => {

    // get uid
    const uid = req.uid;

    // generate new token
    const token = await generateJWT(uid);

    //get user by uid
    const user = await User.findById(uid);

    return res.json({
        ok: true,
        user,
        token
    });
}

module.exports = {
    createUser,
    login,
    renewToken
}