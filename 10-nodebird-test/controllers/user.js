const User = require('../models/user');

exports.follow = async (req, res, next) => {
  try {
    // 아래의 비즈니스 로직을 services로 분리할 수 있다
    // 테스트를 더욱 용이하게 만들 수 있다
    const user = await User.findOne({ where: { id: req.user.id } });
    if (user) { // req.user.id가 followerId, req.params.id가 followingId
      await user.addFollowing(parseInt(req.params.id, 10));
      res.send('success');
    } else {
      res.status(404).send('no user');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};