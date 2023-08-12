exports.renderLogin = (req, res) => {
    res.render('login', {
        title: '로그인',
    });
}

exports.renderJoin = (req, res) => {
    res.render('join', {
        title: '계정생성',
    });
}

exports.renderIndex = (req, res) => {
    const userName = req.user.userName;
    res.render('index', {
        title: '인덱스',
        userName,
    });
}