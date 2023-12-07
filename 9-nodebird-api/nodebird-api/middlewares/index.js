const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const { Domain } = require('../models');

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(403).send('로그인 필요');
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    const message = encodeURIComponent('로그인한 상태입니다.');
    res.redirect(`/?error=${message}`);
  }
};

// 자주 쓰이는 것들은  middleware의 index에 넣어두고 사용한다
// JWT Token은 API 서버에서 정말 자주 쓰이기 때문에 미들웨어로 사용
exports.verifyToken = (req, res, next) => {
  try {
    // JWT Secret은 인감도장과 같아서 빼앗기면 안된다
    res.locals.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') { // 유효기간 초과
      return res.status(419).json({
        code: 419,
        message: '토큰이 만료되었습니다',
      });
    }
    return res.status(401).json({
      code: 401,
      message: '유효하지 않은 토큰입니다',
    });
  }
};

// api를 제한하는 로직을 구현할 수 있다
exports.apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1분
  max: 10,
  handler(req, res) {
    res.status(this.statusCode).json({
      code: this.statusCode, // 기본값 429
      message: '1분에 열 번만 요청할 수 있습니다.',
    });
  },
});

exports.deprecated = (req, res) => {
  res.status(410).json({
    code: 410,
    message: '새로운 버전이 나왔습니다. 새로운 버전을 사용하세요.',
  });
};

exports.corsWhenDomainMatches = async (req, res, next) => {
  const domain = await Domain.findOne({
    // new URL(req.get('origin')).host인 경우 http가 떨어진다
    where: { host: new URL(req.get('origin')).host },
  });
  if (domain) {
    cors({
      origin: req.get('origin'),
      // cookie를 함께 받고싶을 경우 credentials를 넣어준다
      credentials: true,
    })(req, res, next);
  } else {
    next();
  }
};