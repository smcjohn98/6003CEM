import request from 'supertest';
import express from 'express';
import PetRouter from '../router/pet-router';
import JWT from 'jsonwebtoken'
import { config } from '../config';
import User from '../model/user';
import Pet from '../model/pet';

const petRouter = new PetRouter
const app = express();
app.use(express.json());

app.use('/pet', petRouter.router);

describe('Test Get Pet Route', () => {
    
    const adminJwt = JWT.sign({ username: "admin@gmail.com", userId: 1, role: "admin", name: "Admin User"}
    , config.jwtKey, { algorithm: 'HS256' });
    beforeAll(async () => {
        User.hasMany(Pet, {foreignKey: "createdBy"})
        Pet.belongsTo(User, {foreignKey: "createdBy"})

        if(!await Pet.findByPk(999) ){
            await Pet.create({ id:999, type: "cat", name: "Test Pet", 
            dob: "2023-01-01", breed: "abys", sex: 'F', createdBy: 1, description: "description" })
        }
    });

    it('get all pet', async () => {
        const response = await request(app).get('/pet');
        expect(response.status).toBe(200);
    });

    it('get pet detail', async () => {
        const response = await request(app).get('/pet/999');
        expect(response.status).toBe(200);
    });

    it('update pet', async () => {
        const response = await request(app).put('/pet/999').send({ type: "cat", name: "Test Pet", 
        dob: "2023-01-01", breed: "abys", sex: 'F', createdBy: 1, description: "description" }).set({ Authorization: `Bearer ${adminJwt}`});
        expect(response.status).toBe(200);
    });


    it('delete pet', async () => {
        const response = await request(app).delete('/pet/999').set({ Authorization: `Bearer ${adminJwt}`});
        expect(response.status).toBe(200);
    });

});