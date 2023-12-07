const { isLoggedIn, isNotLoggedIn } = require('./');

describe('isLoggedIn', () => {
    // 테스트는 설명을 자세하게 적어주면 좋다
    const res = {
        // function chaining을 구현할 수 있다
        status: jest.fn(() => res),
        send: jest.fn(),
    };
    const next = jest.fn();

    test('로그인되어 있으면 isLoggedin이 next를 호출해야 한다.', () => {
        const req = {
            // 호출될떄 true를 반환하는 mocked 객체가 된다
            isAuthenticated: jest.fn(() => true),
        };
        isLoggedIn(req, res, next);
        expect(next).toBeCalledTimes(1);
    });

    test('로그인되어 있지 않으면 isLoggedin이 에러를 응답해야 한다.', () => {
        const req = {
            isAuthenticated: jest.fn(() => false),
        };
        isLoggedIn(req, res, next);
        expect(res.status).toBeCalledWith(403);
        expect(res.send).toBeCalledWith('로그인 필요');
    });
})

describe('isNotLoggedIn', () => {
    const res = {
        redirect: jest.fn(),
    };
    const next = jest.fn();

    test('로그인되어 있지 않으면 isNotLoggedIn이 next를 호출해야 한다.', () => {
        const req = {
            isAuthenticated: jest.fn(() => false),
        };
        isNotLoggedIn(req, res, next);
        expect(next).toBeCalledTimes(1);
    });

    test('로그인되어 있으면 isNotLoggedIn이 에러를 응답해야 한다.', () => {
        const req = {
            isAuthenticated: jest.fn(() => true),
        };
        isNotLoggedIn(req, res, next);
        const message = encodeURIComponent('로그인한 상태입니다.');
        expect(res.redirect).toBeCalledWith(`/?error=${message}`);
    });
})