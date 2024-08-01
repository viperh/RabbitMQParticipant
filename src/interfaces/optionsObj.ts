import ConsumeCallback from "./callback";

interface ParticipantObj {
    sendQueue: string;
    receiveQueue: string;
    callback: ConsumeCallback;
}

export default ParticipantObj;