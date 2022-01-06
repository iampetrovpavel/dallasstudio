import {MongoMemoryServer} from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { app } from '../app'
import jwt from 'jsonwebtoken'

declare global {
    var signin: () => string[];
}

jest.mock('../nats-wrapper')


let mongo: any

beforeAll(async () => {
    process.env.JWT_KEY = 'asdasdasd'

    mongo = await MongoMemoryServer.create()
    const mongoUri = mongo.getUri()

    await mongoose.connect(mongoUri)
})

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections()
    for (let collection of collections) {
        await collection.deleteMany({})
    }
})

afterAll(async () => {
    await mongo.stop()
    await mongoose.connection.close()
})

global.signin = () => {
    const payload = {
        id: new mongoose.Types.ObjectId().toHexString(),
        email: 'test@test.ru'
    }
    const token = jwt.sign(payload, process.env.JWT_KEY!)
    const session = {jwt: token}
    const sessionJSON = JSON.stringify(session)
    const base64 = Buffer.from(sessionJSON).toString('base64')
    return [`express:sess=${base64}`]
}