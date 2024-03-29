import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'
import { natsWrapper } from '../../nats-wrapper'
import { Ticket } from '../../models/ticket'

it('return 404 if provided id is not exist', async () => {
	const id = new mongoose.Types.ObjectId().toHexString()
	await request(app)
		.put(`/api/tickets/${id}`)
		.set('Cookie', global.signin())
		.send({
			title: 'sdsdf',
			price: 20,
			directionId: new mongoose.Types.ObjectId().toHexString(),
			count: 8,
			month: 2,
			year: 2022,
			userId: '123',
		})
		.expect(404)
})

it('return 401 if the user is not authenticated', async () => {
	const id = new mongoose.Types.ObjectId().toHexString()
	await request(app)
		.put(`/api/tickets/${id}`)
		.send({
			title: 'sdsdf',
			price: 20,
			directionId: new mongoose.Types.ObjectId().toHexString(),
			count: 8,
			month: 2,
			year: 2022,
			userId: '123',
		})
		.expect(401)
})

it('return 401 if user is not own the ticket', async () => {
	const response = await request(app)
		.post('/api/tickets')
		.set('Cookie', global.signin())
		.send({
			title: 'asdasd',
			price: 20,
			directionId: new mongoose.Types.ObjectId().toHexString(),
			count: 8,
			month: 2,
			year: 2022,
			userId: '123',
		})
	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', global.signin())
		.send({
			title: '98989898',
			price: 20000,
		})
		.expect(401)
})

it('updates the ticket proveded invalid title or price', async () => {
	const cookie = global.signin()
	const response = await request(app)
		.post('/api/tickets')
		.set('Cookie', cookie)
		.send({
			title: 'wwerwer',
			price: 20,
			directionId: new mongoose.Types.ObjectId().toHexString(),
			count: 8,
			month: 2,
			year: 2022,
			userId: '123',
		})
	 await request(app)
	 	.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', cookie)
		.send({
			title: '',
			price: 20
		})
		.expect(400)
	await request(app)
	 	.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', cookie)
		.send({
			title: 'wfsdfsdf',
			price: -20
		})
		.expect(400)
})

it('updates the ticket proveded valid inputs', async () => {
	const cookie = global.signin()
	const response = await request(app)
		.post('/api/tickets')
		.set('Cookie', cookie)
		.send({
			title: 'wwerwer',
			price: 20,
			directionId: new mongoose.Types.ObjectId().toHexString(),
			count: 8,
			month: 2,
			year: 2022,
			userId: '123',
		})

	await request(app)
	 	.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', cookie)
		.send({
			title: 'new title',
			price: 100
		})
		.expect(200)

	const ticketResponse = await request(app)
		.get(`/api/tickets/${response.body.id}`)
		.send()

	expect(ticketResponse.body.title).toEqual('new title')
	expect(ticketResponse.body.price).toEqual(100)
})

it('publish an event', async () => {
	const cookie = global.signin()
	const response = await request(app)
		.post('/api/tickets')
		.set('Cookie', cookie)
		.send({
			title: 'wwerwer',
			price: 20,
			directionId: new mongoose.Types.ObjectId().toHexString(),
			count: 8,
			month: 2,
			year: 2022,
			userId: '123',
		})

	await request(app)
	 	.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', cookie)
		.send({
			title: 'new title',
			price: 100
		})
		.expect(200)
	expect(natsWrapper.client.publish).toHaveBeenCalled()
})

it('reject if the ticket is reserved', async () => {
	const cookie = global.signin()
	const response = await request(app)
		.post('/api/tickets')
		.set('Cookie', cookie)
		.send({
			title: 'wwerwer',
			price: 20,
			directionId: new mongoose.Types.ObjectId().toHexString(),
			count: 8,
			month: 2,
			year: 2022,
			userId: '123',
		})

	const ticket = await Ticket.findById(response.body.id)
	
	ticket!.set({orderId: new mongoose.Types.ObjectId().toHexString()})
	await ticket!.save()

	await request(app)
	 	.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', cookie)
		.send({
			title: 'new title',
			price: 100
		})
		.expect(400)
})