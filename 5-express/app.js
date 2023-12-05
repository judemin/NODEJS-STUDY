const express = require('express');
const path = require('path');
const morgan = require('morgan')
const cookieParser = require('cookie-parser');
const multer = require('multer');
const session = require('express-session');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.set('port', process.env.PORT || 3000);

// show log of every request
app.use(morgan('dev'));
// uses in production level, show detail information
//app.use(morgan('combined'));

app.use(cookieParser('cookiePassword'));

// session
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
    },
    name: process.env.COOKIE_SECRET
}));

// req.body parser, newer version of bodyparser
app.use(express.json());
// decode form data from frontend
// true : qs, false : query string
app.use(express.urlencoded({ extended: true }));

// forward req path to real
// doesn't use next() function
// app.use('/', express.static(__dirname, 'public'));

app.use((req, res, next) => {
    console.log('This is middleware');
    next();
})

app.get('/', (req, res) => {
    res.send('Hello Express!');
})

app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
})

app.get('/cookie', (req, res) => {
    req.cookies;
    // signed cookie for better 
    req.signedCookies;
    res.cookie('name', encodeURIComponent(name), {
        expires: new Date(),
        httpOnly: true,
        path: '/',
    });
});


// multer
try {
    fs.readdirSync('uploads');
} catch (error) {
    console.error('creating upload folder');
    fs.mkdirSync('uploads');
}

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, 'uploads/');
        },
        filename(req, file, done) {
            const ext = path.extname(file.originalname);
            done(null, path.basename(file.originalname, ext) + Date.now() + ext);
        }
    }),
    limits: { fileSize: 5 * 1024 * 1024 }
});

app.get('/upload', (req, res) => {
    res.sendFile(path.join(__dirname, 'multipart.html'));
})

app.post('/upload', upload.single('image'), (req, res) => {
    console.log(req.file);
    res.status(200).send('File Uploaded Successfully');
})

app.use((req, res, next) => {
    res.status(404).send('404 Page not found');
});

// Error Middleware
// All 4 arguments are needed
app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send('Internal server error. Please try again later');
});

app.listen(app.get('port'), () => {
    console.log('Express Server is listening', app.get('port'));
});