const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const morgan = require('morgan');
const passport = require('passport');
const dotenv = require('dotenv');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const nunjucks = require('nunjucks');

const socket = require('./routes/socket');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
socket(io);

// 넌적스 세팅
app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true,
});

// 라우터
const pageRouter = require('./routes/page');
const apiRouter = require('./routes/api');
const authRouter = require('./routes/auth');
app.use('/', pageRouter);
app.use('/api', apiRouter);
app.use('/auth', authRouter);

const { sequelize } = require('./models');
const passportConfig = require('./passport');
dotenv.config();

passportConfig();
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
}));

app.use(passport.initialize());
app.use(passport.session());

sequelize.sync({ force: false })
    .then(() => {
        console.log("데이터베이스 연결 성공");
    })
    .catch((err) => {
        console.error(err);
    });

server.listen(8081, () => {
    console.log('Server listening on port 8081');
});
