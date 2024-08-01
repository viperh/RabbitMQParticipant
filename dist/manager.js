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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const participant_1 = __importDefault(require("./participant"));
class ParticipantManager {
    constructor(connection, exchange, buildOptions, durable = false) {
        this.participants = [];
        this.connection = connection;
        this.exchange = exchange;
        this.buildOptions = buildOptions;
        this.durable = durable;
    }
    createParticipant(sendQueue, receiveQueue, callback) {
        const participant = new participant_1.default(this.connection, sendQueue, receiveQueue, this.exchange, callback, this.durable);
        this.participants.push(participant);
    }
    generateParticipants() {
        for (let participantObj of this.buildOptions) {
            this.createParticipant(participantObj.sendQueue, participantObj.receiveQueue, participantObj.callback);
        }
    }
    consumeAll() {
        return __awaiter(this, void 0, void 0, function* () {
            for (let participant of this.participants) {
                yield participant.consume();
            }
        });
    }
}
exports.default = ParticipantManager;
