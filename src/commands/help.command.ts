import { Telegraf } from "telegraf";
import { Command } from "./command.class";
import { IBotContext } from "../context/context.interface";

export class HelpCommand extends Command {
    constructor(bot: Telegraf<IBotContext>) {
        super(bot);
    }

    handle(): void {
        this.bot.help((ctx) => {
            ctx.reply("Я могу помочь вам с несколькими командами:\n\n" +
                     "/start - Начать работу с ботом\n" +
                     "/help - Показать доступные команды\n" +
                     "/weather - Узнать погоду в вашем городе");
        });
    }
}