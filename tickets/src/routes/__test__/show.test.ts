import request from 'supertest'
import { app } from '../../app';
import mongoose from 'mongoose'

it('return 404 if ticket not found', async () => {
	const id = new mongoose.Types.ObjectId().toHexString()
	await request(app)
		.get(`/api/tickets/${id}`)
		.send()
		.expect(404)
})

it('return ticket if ticket  found', async () => {
	const title = 'test title';
	const price = 20;
	const response = await request(app)
		.post('/api/tickets')
		.set('Cookie', global.signin())
		.send({
			title, price,
			directionId: new mongoose.Types.ObjectId().toHexString(),
			count: 8,
			month: 2,
			year: 2022,
			userId: new mongoose.Types.ObjectId().toHexString(),
		})
		.expect(201)
	const ticketResponse = await request(app)
		.get(`/api/tickets/${response.body.id}`)
		.send()
		.expect(200)
	expect(ticketResponse.body.title).toEqual(title)
	expect(ticketResponse.body.price).toEqual(price)
})