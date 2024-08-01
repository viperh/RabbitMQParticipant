"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class Participant {
    constructor(connection, sendQueue, receiveQueue, exchange, callback, durable) {
        this.durable = false;
        this.options = {
            noAck: true
        };
        this.connection = connection;
        this.exchange = exchange;
        this.sendQueue = sendQueue;
        this.receiveQueue = receiveQueue;
        this.callback = callback;
        if (durable) {
            this.durable = durable;
        }
        this.init();
    }
    decode(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!payload)
                return;
            const obj = JSON.parse(payload.content.toString());
            return yield this.callback(obj);
        });
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.channel = yield this.connection.createChannel();
            yield this.channel.assertExchange(this.exchange, 'direct', { durable: this.durable });
            yield this.channel.assertQueue(this.receiveQueue, { durable: this.durable });
            yield this.channel.bindQueue(this.receiveQueue, this.exchange, this.receiveQueue);
        });
    }
    sendMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.channel)
                return;
            this.channel.sendToQueue(this.sendQueue, Buffer.from(message));
        });
    }
    consume() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.channel)
                return;
            yield this.channel.consume(this.receiveQueue, (payload) => { this.decode(payload); }, this.options);
        });
    }
}
exports.default = Participant;
