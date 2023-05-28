import request from 'supertest';
import express from 'express';
import SingupCodeRouter from '../router/signup-code-router';
import JWT from 'jsonwebtoken'
import { config } from '../config';
import User from '../model/user';
import Pet from '../model/pet';
import SignupCode from '../model/signup-code';

const router = new SingupCodeRouter
const app = express();
app.use(express.json());

app.use('/signup-code', router.router);

describe('Test Signup Code Route', () => {
    
    const adminJwt = JWT.sign({ username: "admin@gmail.com", userId: 1, role: "admin", name: "Admin User"}
    , config.jwtKey, { algorithm: 'HS256' });


    beforeAll(async () => {
        if(!await SignupCode.findByPk(999) ){
            await SignupCode.create({ id:999, code: "ABCD", isValid: true})
        }
    });


    it('get all signup code', async () => {
        const response = await request(app).get('/signup-code').set({ Authorization: `Bearer ${adminJwt}`});
        expect(response.status).toBe(200);
    });

    it('generate signup code', async () => {
        const response = await request(app).post('/signup-code').set({ Authorization: `Bearer ${adminJwt}`});
        expect(response.status).toBe(200);
    });

    it('delete signup code', async () => {
        const response = await request(app).delete('/signup-code/999').set({ Authorization: `Bearer ${adminJwt}`});
        expect(response.status).toBe(200);
    });

});