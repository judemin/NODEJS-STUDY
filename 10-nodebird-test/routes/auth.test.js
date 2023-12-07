const app = require('../app');
const request = require('supertest');
const { sequelize } = require('../models');

// 모든 테스트 이전에 한번만 실행
beforeAll(async () => {
    // DB 연결하기
    await sequelize.sync({ force: true });
});

// 각 테스트 이전 실행
beforeEach(() => { });

describe('POST /join', () => {
    test('로그인 안 했으면 가입', (done) => {
        // request는 비동기 함수이다
        // 언제 함수가 끝나는지 jest에게 알려줘야 함
        // done을 호출해야 jest가 테스트 끝났는지 알 수 있음
        request(app)
            .post('/auth/join')
            .send({
                email: 'zerohch0@gmail.com',
                nick: 'zerocho',
                password: 'nodejsbook',
            })
            .expect('Location', '/')
            .expect(302, done);
    });
});

describe('POST /join', () => {
    const agent = request.agent(app);
    beforeEach((done) => {
        agent
            .post('/auth/login')
            .send({
                email: 'zerohch0@gmail.com',
                password: 'nodejsbook',
            })
            .end(done);
    });

    test('이미 로그인했으면 redirect /', (done) => {
        const message = encodeURIComponent('로그인한 상태입니다.');
        agent
            .post('/auth/join')
            .send({
                email: 'zerohch0@gmail.com',
                nick: 'zerocho',
                password: 'nodejsbook',
            })
            .expect('Location', `/?error=${message}`)
            .expect(302, done);
    });
});

describe('POST /login', () => {
    test('가입되지 않은 회원', (done) => {
        const message = encodeURIComponent('가입되지 않은 회원입니다.');
        request(app)
            .post('/auth/login')
            .send({
                email: 'zerohch1@gmail.com',
                password: 'nodejsbook',
            })
            .expect('Location', `/?error=${message}`)
            .expect(302, done);
    });

    test('로그인 수행', (done) => {
        request(app)
            .post('/auth/login')
            .send({
                email: 'zerohch0@gmail.com',
                password: 'nodejsbook',
            })
            .expect('Location', '/')
            .expect(302, done);
    });

    test('비밀번호 틀림', (done) => {
        const message = encodeURIComponent('비밀번호가 일치하지 않습니다.');
        request(app)
            .post('/auth/login')
            .send({
                email: 'zerohch0@gmail.com',
                password: 'wrong',
            })
            .expect('Location', `/?error=${message}`)
            .expect(302, done);
    });
});

describe('GET /logout', () => {
    test('로그인 되어있지 않으면 403', (done) => {
        request(app)
            .get('/auth/logout')
            .expect(403, done);
    });

    const agent = request.agent(app);
    beforeEach((done) => {
        agent
            .post('/auth/login')
            .send({
                email: 'zerohch0@gmail.com',
                password: 'nodejsbook',
            })
            .end(done);
    });

    test('로그아웃 수행', (done) => {
        agent
            .get('/auth/logout')
            .expect('Location', `/`)
            .expect(302, done);
    });
});

afterAll(async () => {
    await sequelize.sync({ force: true });
});

// 테스트 이후 한번만 실행
afterAll(() => { });