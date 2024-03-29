import mongoose from "mongoose"
import { app } from './app'
import { natsWrapper } from './nats-wrapper'
import { OrderCreatedListener } from './events/listeners/order-created-listener'
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener'
import { OrderCompliteListener } from "./events/listeners/order-complite-listener"

const start = async () => {
    if(!process.env.JWT_KEY){
        throw new Error('JWT_KEY undefined')
    }
    if(!process.env.MONGO_URI){
        throw new Error('MONGO_URI undefined')
    }
    if(!process.env.NATS_CLIENT_ID){
        throw new Error('NATS_CLIENT_ID undefined')
    }
        if(!process.env.NATS_URL){
        throw new Error('NATS_URL undefined')
    }
        if(!process.env.NATS_CLUSTER_ID){
        throw new Error('NATS_CLUSTER_ID undefined')
    }
    try {
        await natsWrapper.connect(
            process.env.NATS_CLUSTER_ID, 
            process.env.NATS_CLIENT_ID, 
            process.env.NATS_URL
        )
        console.log('Connected to NATS')
        natsWrapper.client.on('close', () => {
            console.log('NATS connection closed!')
            process.exit()
        })
        process.on('SIGINT', () => natsWrapper.client.close())
        process.on('SIGTERM', () => natsWrapper.client.close())

        new OrderCreatedListener(natsWrapper.client).listen()
        new OrderCancelledListener(natsWrapper.client).listen()
        new OrderCompliteListener(natsWrapper.client).listen()

        const mongo_link = process.env.MONGO_URI+process.env.MONGO_DB
        await mongoose.connect(mongo_link);
    } catch (err) {
        console.error(err);
    }

    app.listen(3000, () => {
        console.log('Listening on port 3000!');
    });
};

start();