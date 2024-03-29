import request from 'supertest'
import { app } from '../../app'

it('response with details about the current user', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            name: 'Петров Павел',
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201)

    const response = await request(app)
        .get('/api/users/currentuser')
        .send()
        .expect(200)

    console.log(response.body)
})