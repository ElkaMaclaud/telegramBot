import { Context } from "telegraf";

export interface SessionData {
    like: boolean;
}

export interface IBotContext extends  Context {
    session: SessionData;
}