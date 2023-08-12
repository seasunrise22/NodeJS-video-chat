const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/user');

exports.userJoin = async (req, res) => {
    const { userName, userPassword } = req.body;
    try {
        const hash = await bcrypt.hash(userPassword, 12);
        await User.create({
            userName,
            userPassword: hash,
        });
        return res.redirect('/index');
    } catch (error) {
        console.error(error);
    }
}

exports.userLogin = async (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if (authError) {
            console.error(authError);
        }
        if (!user) {
            return res.json(info.message);
        }
        return req.login(user, (loginError) => {
            if (loginError) {
                console.error(loginError);
            }

            return res.redirect('/index');
        });
    })(req, res, next);
}

