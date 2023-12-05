// router -> controller -> service
// controller : know req, res
// service : dont know req, res
exports.renderProfile = (req, res, next) => {
    res.render('profile', { title: 'My information - NodeBird' });
};

exports.renderJoin = (req, res, next) => {
    res.render('join', { title: 'Sign Up - NodeBird' });
};

exports.renderMain = (req, res, next) => {
    res.render('main', {
        title: 'NodeBird',
        twits: [],
    });
};
