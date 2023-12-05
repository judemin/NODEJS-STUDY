const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const passport = require('passport');
const { sequelize } = require('./models')

dotenv.config();
const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');
const passportConfig = require('./passport');

const app = express();
passportConfig();

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true,
});

// force true : recreate all table, only in dev
sequelize.sync({ force: false })
    .then(() => {
        console.log("Successfully Connected to MySQL")
    })
    .catch((err) => {
        console.log(err);
    });

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // req.body from ajax json req
app.use(express.urlencoded({ extended: false })); // from req.body form
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    }
}));
// passport must be set under express session
// req.user req.login req.isAuthenticate req.logout
app.use(passport.initialize());
// session cookie named connect.sid is sent to browser
app.use(passport.session());

app.use('/', pageRouter);
app.use('/auth', authRouter);

app.use((req, res, next) => {
    const error = new Error('${req.method ${req.url} router not found}');
    error.status = 404;
    next(error);
});
app.use((err, req, res, next) => {
    res.locals.message = err.message;
    // divide progeam into dev, production environment
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

app.listen(app.get('port'), () => {
    console.log('Server is listening', app.get('port'));
})