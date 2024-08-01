import Participant from "./participant";
import amqplib from 'amqplib';
import ParticipantObj from "./interfaces/optionsObj";
import ConsumeCallback from "./interfaces/callback";


class ParticipantManager {
    private participants: Participant[] = [];
    exchange: string;
    buildOptions: ParticipantObj[];
    connection: amqplib.Connection;
    durable?: boolean;

    constructor(connection: amqplib.Connection, exchange: string, buildOptions: ParticipantObj[], durable: boolean = false) {
        this.connection = connection;
        this.exchange = exchange;
        this.buildOptions = buildOptions;
        this.durable = durable;
    }

    createParticipant(sendQueue: string, receiveQueue: string, callback: ConsumeCallback){
        const participant = new Participant(this.connection, sendQueue, receiveQueue, this.exchange, callback, this.durable);
        this.participants.push(participant);
    }

    generateParticipants(){
        for(let participantObj of this.buildOptions){
            this.createParticipant(participantObj.sendQueue, participantObj.receiveQueue, participantObj.callback);
        }
    }

    async consumeAll(){
        for(let participant of this.participants){
            await participant.consume();
        }
    }

}

export default ParticipantManager;