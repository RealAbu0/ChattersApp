import { MessageEventType } from "../enum/message-event-type";

export interface ChatMessageEvent{
    messageEventType: MessageEventType;
    message: string;
    user: string;
}