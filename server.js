const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const morgan = require('morgan');
const passport = require('passport');
const dotenv = require('dotenv');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const nunjucks = require('nunjucks');
const path = require('path');
const socketServer = require('./sockets/socketServer');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
//  Express 서버와 함께 Socket.IO 서버를 띄움(Express 앱과 Socket.IO 간에 통신할 수 있는 환경을 구축)
socketServer(io);

// 넌적스 세팅
app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true,
});

const { sequelize } = require('./models');
const passportConfig = require('./passport');
dotenv.config();

passportConfig();
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
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
        maxAge: 600000, // 밀리초 단위, 10분
    },
}));
app.use(passport.initialize());
app.use(passport.session());

// 라우터
const pageRouter = require('./routes/page');
const apiRouter = require('./routes/api');
const authRouter = require('./routes/auth');
app.use('/', pageRouter);
app.use('/api', apiRouter);
app.use('/auth', authRouter);

sequelize.sync({ force: false })
    .then(() => {
        console.log("데이터베이스 연결 성공");
    })
    .catch((err) => {
        console.error(err);
    });

app.get('/', (req, res) => {
    res.redirect('/login');
});

server.listen(8080, () => {
    console.log('Server listening on port 8080');
});
