import request from 'supertest';
import express from 'express';
import UserRouter from '../router/user-router';
import JWT from 'jsonwebtoken'
import { config } from '../config';
import User from '../model/user';


const userRouter = new UserRouter
const app = express();
app.use(express.json());

app.use('/user', userRouter.router);

describe('Test Get All User Route', () => {
    it('get all users with valid jwt token, should return status 200', async () => {
        const jwt = JWT.sign({ username: "admin", userId: 1, role: "admin", name: "Admin User"}
            , config.jwtKey, { algorithm: 'HS256' });
        const response = await request(app).get('/user').set({ Authorization: `Bearer ${jwt}`});
        expect(response.status).toBe(200);
    });

    it('get all users with valid jwt token, but not admin role, should return status 401', async () => {
        const jwt = JWT.sign({ username: "user", userId: 1, role: "user", name: "User"}
            , config.jwtKey, { algorithm: 'HS256' });
        const response = await request(app).get('/user').set({ Authorization: `Bearer ${jwt}`});
        expect(response.status).toBe(401);
    });

    it('get all users with invalid jwt token, should return status 401', async () => {
        const response = await request(app).get('/user').set({ Authorization: "Bearer 123456"});
        expect(response.status).toBe(401);
    });

    it('get all users without authorization header, should return status 401', async () => {
        const response = await request(app).get('/user');
        expect(response.status).toBe(401);
    });
});

describe('Test User Verify Route', () => {
    it('verify users data with valid jwt token, should return status 200', async () => {
        const jwt = JWT.sign({ username: "admin@gmail.com", userId: 1, role: "admin", name: "Admin User"}
            , config.jwtKey, { algorithm: 'HS256' });
        const response = await request(app).get('/user/verify').set({ Authorization: `Bearer ${jwt}`});
        const { username, userId, role, name } = response.body.data;
        expect(response.status).toBe(200);
        expect(response.body.data).not.toHaveProperty("password");
        expect(username).toBe("admin@gmail.com");
        expect(userId).toBe(1);
        expect(role).toBe("admin");
        expect(name).toBe("Admin User");
    });
});

describe('Register User', () => {

    it('Register user but have existed same username, should return status 404', async () => {
        const response = await request(app).post('/user').send({username: "admin@gmail.com", password:"611235611256", name:"Admin User", isCharity:false})
            .set('Content-Type', 'application/json')

        expect(response.status).toBe(404);
    });

    it('Register user, should return status 200', async () => {

        const user = await User.findOne({ where: { username: "unit.test@gmail.com" } });
        if(user)
            user.destroy();

        const response = await request(app).post('/user').send({username: "unit.test@gmail.com", password:"12345678", name:"Jest Unit Test", isCharity:false})
            .set('Content-Type', 'application/json')

        expect(response.status).toBe(200);
    });
});

describe('Login', () => {
    
    it('Login valid user, should return status 200', async () => {
        const response = await request(app).post('/user/login').send({username: "admin@gmail.com", password:"P@ssw0rd"})
            .set('Content-Type', 'application/json')
        expect(response.body.data).toHaveProperty('jwt')
        expect(response.status).toBe(200);
    });

    it('Login wrong password, should return status 403', async () => {
        const response = await request(app).post('/user/login').send({username: "admin@gmail.com", password:"12345678"})
            .set('Content-Type', 'application/json')
        expect(response.status).toBe(403);
    });

    it('Login not existed user, should return status 404', async () => {
        const response = await request(app).post('/user/login').send({username: "not.existed.user@gmail.com", password:"12345678"})
            .set('Content-Type', 'application/json')
        expect(response.status).toBe(404);
    });
});