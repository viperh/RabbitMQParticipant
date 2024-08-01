import amqplib from 'amqplib';
import ConsumerCallback from './interfaces/callback';
import ConsumeCallback from "./interfaces/callback";

class Participant {
    connection: amqplib.Connection;
    exchange: string;
    sendQueue: string;
    receiveQueue: string;
    callback: ConsumerCallback;
    durable: boolean = false;
    options = {
        noAck: true
    }
    channel?: amqplib.Channel;

    constructor(connection: amqplib.Connection, sendQueue: string, receiveQueue: string, exchange: string, callback: ConsumeCallback, durable?: boolean){
        this.connection = connection;
        this.exchange = exchange;
        this.sendQueue = sendQueue;
        this.receiveQueue = receiveQueue;
        this.callback = callback;
        if(durable){
            this.durable = durable;
        }
        this.init();
    }

    async decode(payload: any){
        if(!payload) return;
        const obj = JSON.parse(payload.content.toString());
        return await this.callback(obj);
    }

    async init(){
        this.channel = await this.connection.createChannel();
        await this.channel.assertExchange(this.exchange, 'direct', {durable: this.durable});
        await this.channel.assertQueue(this.receiveQueue, {durable: this.durable});
        await this.channel.bindQueue(this.receiveQueue, this.exchange, this.receiveQueue);
    }

    async sendMessage(message: any){
        if(!this.channel) return;
        this.channel.sendToQueue(this.sendQueue, Buffer.from(message));
    }

    async consume(){
        if(!this.channel) return;
        await this.channel.consume(this.receiveQueue, (payload: any) => {this.decode(payload)}, this.options);
    }

}

export default Participant;