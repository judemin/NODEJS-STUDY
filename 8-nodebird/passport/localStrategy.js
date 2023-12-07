const passport = require("passport");
const User = require("../models/user");
const bcrypt = require('bcrypt');
const { Strategy: LocalStrategy } = require('passport-local').Strategy;

module.exports = () => {
    passport.use(new LocalStrategy({
        usernameField: 'email', // req.body.email
        passwordField: 'password',
        passReqToCallback: false
    }, async (email, password, done) => { // done(server fail, success user, logic fail)
        try {
            const exUser = await User.findOne({ where: { email } });
            if (exUser) {
                const result = await bcrypt.compare(password, exUser.password);
                if (result)
                    done(null, exUser);
                else
                    done(null, false, { message: 'Invalid password' });
            } else {
                done(null, false, { message: 'Unkown User' });
            }
        } catch (error) {
            console.log(error);
            done(error);
        }
    }));
};