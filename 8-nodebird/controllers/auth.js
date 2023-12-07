const User = require("../models/user");
const bcrypt = require('bcrypt');
const passport = require("passport");

exports.join = async (req, res, next) => {
    const { nick, email, password } = req.body;
    try {
        const exUser = await User.findOne({ where: { email } });
        if (exUser)
            return res.redirect('/join?error=exist');

        const hash = await bcrypt.hash(password, 12);
        await User.create({
            email,
            nick,
            password: hash,
        });
        return res.redirect('/');
    } catch (error) {
        console.error(error);
        next(error);
    }
};
// POST /auth/login
exports.login = (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if (authError) { // server fail
            console.log(authError);
            return next(authError);
        } else if (!user) { // logic fail
            return res.redirect('/?loginError=${info.message}');
        }
        return req.login(user, (loginError) => { // login success
            if (loginError) {
                console.log(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        })
        // middleware in middleware need (req, res, next)
    })(req, res, next);
};

exports.logout = (req, res) => {
    req.logout(() => {
        res.redirect('/');
    });
};