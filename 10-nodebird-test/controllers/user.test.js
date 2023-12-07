jest.mock('../models/user');
const User = require('../models/user');
const { follow } = require('./user');

describe('follow', () => {
    test('사용자를 찾아 팔로잉을 추가하고 success를 응답', async () => {
        const res = {
            send: jest.fn(),
        };
        const req = {
            user: { id: 1 },
            params: { id: 2 },
        };
        const next = jest.fn();
        // jest의 mocking한 user로 바꾼다
        User.findOne.mockReturnValue({
            addFollowing(id) {
                return Promise.resolve(true);
            }
        });
        await follow(req, res, next);
        expect(res.send).toBeCalledWith('success');
    });

    test('사용자를 찾지 못하면 res.status(404).send(no User)를 호출함', async () => {
        const res = {
            status: jest.fn(() => res),
            send: jest.fn(),
        }
        const req = {
            user: { id: 1 },
            params: { id: 2 },
        };
        const next = jest.fn();
        User.findOne.mockReturnValue(null);
        await follow(req, res, next);
        expect(res.status).toBeCalledWith(404);
        expect(res.send).toBeCalledWith('no user');
    });

    test('DB에서 에러가 발생하면 next(error)를 호출함', async () => {
        const req = {
            user: { id: 1 },
            params: { id: 2 },
        };
        const res = {};
        const next = jest.fn();
        const message = 'DB에러';
        User.findOne.mockReturnValue(Promise.reject(message));
        await follow(req, res, next);
        expect(next).toBeCalledWith(message);
    });
});