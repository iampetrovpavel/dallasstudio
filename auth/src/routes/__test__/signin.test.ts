import request from 'supertest'
import { app } from '../../app'

it('fails when a email that does not exist is supplied', async () => {
    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(400)
})

it('fails when an incorrect passwordt is supplied', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            name: 'Петров Павел',
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201)

    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: '123asdsdfsdf'
        })
        .expect(400)
})

it('response with cookie when given valid credentials', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            name: 'Петров Павел',
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201)

    const response = await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(200)

    expect(response.get('Set-Cookie')).toBeDefined()
})