import { Context } from "telegraf";

export interface SessionData {
    like: boolean;
    isWaitingForCity?: boolean;
    isWaitingForConversion?: boolean;
}

export interface IBotContext extends  Context {
    session: SessionData;
}